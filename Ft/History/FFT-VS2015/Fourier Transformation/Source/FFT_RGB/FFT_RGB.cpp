/*
Phil Thornton, www.mdr.co.nz
modified for 64 bit photoshop, and fftw v3 in dll, and 16 bit images
and simplified

Note that 16 bit input images are converted to 8 bit values for processing

April 2010
************


FORWARD FFT
where the R and G channel are used instead
of H and L 
*/
/*
Multi dim arrays row-based order (C-order)
      i  j
  in [X][Y] = in [j+Y*i]
  
	2 5 8 11 
    1 4 7 10
    0 3 6  9

  in this code 
  all arrays are  
  in[Y][X] = in[ROW][COLUMN] = in [j][i] = in[i+j*RowSize]
  RowSize is a number of Columns
*/

/*
complex = i*Im + Re

  Amp = sqrt(Im^2+Re^2)
  Phi = atan(Im/Re)


  Im = Amp*sin(Phi)
  Re = Amp*cos(Phi)

  one way to make transform unique is to use negative Amp 
  
  Amp = sign(Re)*sqrt(Im^2+Re^2)

  another way is to correct phi: 
  if Re > 0  phi = atan(Im/Re);
  if Re < 0  phi = pi + atan(Im/Re);
  
  if Phi<0 phi = 2*pi + phi
*/

#include <windows.h>
#include "fftw3.h"
#include <math.h>

#include "C:\sdk\adobe_photoshop_sdk_cc_2015_win\pluginsdk\photoshopapi\photoshop\PIFilter.h"
#include "resource.h"
#include "myColor.h"

#define c_re(c) ((c)[0])
#define c_im(c) ((c)[1])


#define filterSelectorAbout 	   0
#define filterSelectorParameters   1
#define filterSelectorPrepare	   2
#define filterSelectorStart 	   3
#define filterSelectorContinue	   4
#define filterSelectorFinish	   5

#define userCanceledErr			(-128)

#define VER	 "5.1"

void SetRectMy(Rect *rect,short top,short left,short right,short bottom)
{
	rect->top=top;
	rect->left=left;
	rect->right=right;
	rect->bottom=bottom;
}

HANDLE hDllInstance = NULL;

// Entry point (dll initialization)
// Executed once when PhotoShop scans the "Plugins" folder

BOOL APIENTRY DLLEntry(HANDLE hInstance, DWORD fdwReason, LPVOID lpReserved)
{
	if (fdwReason == DLL_PROCESS_ATTACH)	
		hDllInstance = hInstance;		// Process descriptor 

	return 1;
}
short ErrorCode = 0;
		// Entry point, executed when user starting this plugin
		// Executed several times (3 times minimum) with different "selector" values

extern "C" __declspec(dllexport) void ENTRYPOINT (	const short		selector,  // TYPE of action requared
					FilterRecord	*fPB,	   // Pointer to the information about image 
					intptr_t			*data,	   // Never use this one, keep everything in registry
					short			*result)   // Error code should be assigned to this variable  before return
{

	HWND HWnd=NULL;
	PlatformData *platform;

	if(selector==0)	platform = (PlatformData *)(fPB->serialNumber);
		else		platform = (PlatformData *)(fPB->platformData);

	if(platform!=NULL)HWnd = (HWND)platform->hwnd;			// Descriptor of parent window
	
		if(selector == filterSelectorPrepare)		// figure out memory requirement
	{
/*	//Debug window with some information about initialization (uncomment during debuging or use #ifdef _DEBUG )
	
	char string[180];
	char strCaption[] = {"Info"};

	sprintf(string, "Prepare FFT_RGB: Ver: %s\nMode: %d inCol %d inPlane %d\nSize_xy( %d %d) bpr (in out)= (%d %d) planes %d ", VER,
		fPB->imageMode, fPB->inColumnBytes, fPB->inPlaneBytes,
		fPB->imageSize.h, fPB->imageSize.v,fPB->inRowBytes, fPB->outRowBytes, fPB->planes);
	MessageBox(HWnd, string, strCaption, MB_OK | MB_APPLMODAL );
	*/
	*result = 0;	// No Errors
	return;	
	}

	if(selector == filterSelectorStart)		// Request pointers to data arrays 
	{
		SetRectMy(&fPB->inRect  ,0,0,fPB->imageSize.h, fPB->imageSize.v);  // Input buffer (Whole)
		SetRectMy(&fPB->outRect ,0,0,fPB->imageSize.h, fPB->imageSize.v);  // Output buffer (Whole) 
		SetRectMy(&fPB->maskRect,0,0,0,0);								   // Ignore mask
		fPB->inLoPlane	=0;				   // First requested plane (RED)
		fPB->inHiPlane	=fPB->planes-1;	   // Last requested plane (Blue or transparency)
		fPB->outLoPlane	=0;
		fPB->outHiPlane	=fPB->planes-1;
	}

	if(selector == filterSelectorContinue)
	{
	SetRectMy(&fPB->inRect  ,0,0,0,0); // Do not forget to clear data request (infinite cycle otherwise) 
	SetRectMy(&fPB->outRect ,0,0,0,0);
	SetRectMy(&fPB->maskRect,0,0,0,0);

	/*
		Data initialization 
	*/
	fftw_plan p;
	myColor Color(fPB->imageMode);	


	int i, j;
	long nSum;
	int xsize = fPB->imageSize.h; //Row Size 
	int ysize = fPB->imageSize.v; //Col Size

	unsigned char* in  = (unsigned char*)fPB->inData;
	unsigned char* out = (unsigned char*)fPB->outData;

	fftw_complex *complex_in  = (fftw_complex *) data;
	complex_in  = (fftw_complex *) fftw_malloc(xsize * ysize * sizeof(fftw_complex));

	//Copy to data to complex_in
	// use "((i+j)%2==0?1:-1)" in order to put origin (zero frequency in the center) (-1)^(i+j)= pow(-1,i+j) = ((i+j)%2==0?1:-1) 
	for(i=0;i<xsize;i++)
	for(j=0;j<ysize;j++)
	{
		unsigned short nVal;
		nSum = 0;
		int R, G, B;
		for(int plane=0;plane<fPB->planes;plane++)	// Color cycle	0=R 1=G 2=B 3=transparency(if present)
		{
			if (fPB->imageMode == 3) nVal = in[fPB->inRowBytes*j + fPB->planes*i + plane];
			else {
				memcpy(&nVal,&in[fPB->inRowBytes*j + i*fPB->planes*fPB->inPlaneBytes + plane*fPB->inPlaneBytes],2);
				if (plane == 0) R = nVal;
				if (plane == 1) G = nVal;
				if (plane == 2) B = nVal;
				double n = nVal*255.0/32768.0;	// convert to 8 bit colour
				nVal = n;
			}
			nSum += nVal;
		}
		nSum = nSum/fPB->planes;
		c_im(complex_in[xsize*j + i]) = 0;
		c_re(complex_in[xsize*j + i]) = ((i+j)%2==0?1:-1)*nSum;
	}

	p = fftw_plan_dft_2d(ysize, xsize, complex_in, complex_in, FFTW_FORWARD,FFTW_ESTIMATE);
	fftw_execute(p); 
	fftw_destroy_plan(p); 

	if (fPB->imageMode == 3) {
		double dMaxAmp = log10((double)(xsize*ysize*255+1));
		int i;
		unsigned char nSat, nHue, nLight;
		for(i=0;i<xsize;i++)	
		for(j=0;j<ysize;j++)		
		{
			nHue   = round_to_byte( Color.ComplexPhi(c_re(complex_in[xsize*j + i]), c_im(complex_in[xsize*j + i])));
			nLight = round_to_byte( 255.0*(log10( Color.ComplexAbs(c_re(complex_in[xsize*j + i]),c_im(complex_in[xsize*j + i]))+1)/dMaxAmp) );
			nSat   = 128;
			for(int plane=0;plane<fPB->planes;plane++)	// by color 0=R 1=G 2=B 3=Transparency(if present)
			{
		//For Gray Image assign nLight value to ALL planes (inverse will not be possible)
				if (plane==0) 
					out[fPB->outRowBytes*j + fPB->planes*i + plane] = nLight;
				if (plane==1) 
					out[fPB->outRowBytes*j + fPB->planes*i + plane] = nHue;
				if (plane==2) 
					out[fPB->outRowBytes*j + fPB->planes*i + plane] = nSat;
			}
		}
	} else {
		double dMaxAmp = log10((double)(xsize*ysize*255+1));
		int i;
		unsigned short nSat, nHue, nLight;
		for(i=0;i<xsize;i++)	
		for(j=0;j<ysize;j++)		
		{
			nHue   = round_to_byte( Color.ComplexPhi(c_re(complex_in[xsize*j + i]), c_im(complex_in[xsize*j + i])));
			nLight = round_to_byte( 255.0*(log10( Color.ComplexAbs(c_re(complex_in[xsize*j + i]),c_im(complex_in[xsize*j + i]))+1)/dMaxAmp) );
			nSat   = 32768/2;
			nHue = nHue*32768/255;
			nLight = nLight*32768/255;
			for(int plane=0;plane<fPB->planes;plane++)	// by color 0=R 1=G 2=B 3=Transparency(if present)
			{
		//For Gray Image assign nLight value to ALL planes (inverse will not be possible)
				if (plane==0) 
					memcpy(&out[(fPB->outRowBytes*j) + (fPB->planes*i*fPB->inPlaneBytes)],&nLight,2);
				if (plane==1) 
					memcpy(&out[(fPB->outRowBytes*j) + (fPB->planes*i*fPB->inPlaneBytes) + fPB->inPlaneBytes],&nHue,2);
				if (plane==2) 
					memcpy(&out[(fPB->outRowBytes*j) + (fPB->planes*i*fPB->inPlaneBytes) + (plane*fPB->inPlaneBytes)],&nSat,2);
			}
		}
	}

	fftw_free( complex_in  );

	// The end of processing

		SetRectMy(&fPB->inRect  ,0,0,0,0); // Do not forget to clear data request (infinite cycle otherwise) 
		SetRectMy(&fPB->outRect ,0,0,0,0);
		SetRectMy(&fPB->maskRect,0,0,0,0);
		
	} //if(selector == filterSelectorContinue)

	*result = 0;	// No Errors
	return;	
}

