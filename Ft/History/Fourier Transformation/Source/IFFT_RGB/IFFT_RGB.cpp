/*
Phil Thornton, www.mdr.co.nz
modified for 64 bit photoshop, and fftw v3 in dll, and 16 bit images, and Russian comments -> English
and simplified

Note that 16 bit input images are converted to 8 bit values for processing

April 2010
************

Alex Chirokov 
Drexel University, 2005 
 
 1. 4/08/05: Dialog box is removed

  TODO: translate the comments to English

INVERSE FFT
*/
/*
Multi dim arrays row-based order (C-order)
      i  j
  in [X][Y] = in [j+Y*i]
  
	2 5 8 11 
    1 4 7 10
    0 3 6  9

  in this code 
  all arrays are in[Y][X] = in[ROW][COLUMN] = in [j][i] = in[i+j*RowSize]
  RowSize is number of Columns
*/

/*
complex = Im + Re

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
#include "../FFT_RGB/fftw3.h"
#include <math.h>

#include "C:\adobe_photoshop_cs5_sdk_win\photoshopapi\photoshop\PIFilter.h"   
#include "resource.h"
#include "myColor.h"

#define c_re(c) ((c)[0])
#define c_im(c) ((c)[1]) 

#define filterSelectorAbout 	 0
#define filterSelectorParameters 1
#define filterSelectorPrepare	 2
#define filterSelectorStart 	 3
#define filterSelectorContinue	 4
#define filterSelectorFinish	 5

#define userCanceledErr			(-128)

#define VER	 "4.2"
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
		hDllInstance = hInstance;			// Process descriptor 

	return 1;
}
short ErrorCode = 0;
	// Entry point, executed when user starting this plugin
	// Executed several times (3 times minimum) with different "selector" values 

extern "C" __declspec(dllexport) void ENTRYPOINT (	const short		selector,  // TYPE of action requared
					FilterRecord	*fPB,	   // Pointer to the information about image
					intptr_t		*data,	   // Never use this one, keep everything in registry
					short			*result)   // Error code should be assigned to this variable  before return
{

	HWND HWnd=NULL;
	PlatformData *platform;

	if(selector==0)	platform = (PlatformData *)(fPB->serialNumber);
		else		platform = (PlatformData *)(fPB->platformData);

	if(platform!=NULL)HWnd = (HWND)platform->hwnd;			// Descriptor of parent window
	
	if(selector == filterSelectorStart)		// Request pointers to data arrays 
	{
		SetRectMy(&fPB->inRect  ,0,0,fPB->imageSize.h, fPB->imageSize.v);  // Input buffer (Whole)
		SetRectMy(&fPB->outRect ,0,0,fPB->imageSize.h, fPB->imageSize.v);  // Output buffer (Whole)
		SetRectMy(&fPB->maskRect,0,0,0,0);								   // Ignore mask
		fPB->inLoPlane	=0;				    // First requested plane (RED)
		fPB->inHiPlane	=fPB->planes-1;	   // Last requested plane (Blue or transparency)
		fPB->outLoPlane	=0;
		fPB->outHiPlane	=fPB->planes-1;

	}

	if(selector == filterSelectorContinue)
	{

	SetRectMy(&fPB->inRect  ,0,0,0,0); // Do not forget to clear data request (infinite cycle otherwise)
	SetRectMy(&fPB->outRect ,0,0,0,0);
	SetRectMy(&fPB->maskRect,0,0,0,0);


	fftw_plan ip; //inverse plan
	myColor Color(fPB->imageMode);

	int i, j;

	unsigned char* in  = (unsigned char*)fPB->inData;
    unsigned char* out = (unsigned char*)fPB->outData;

	int xsize = fPB->imageSize.h; //Row Size 
	int ysize = fPB->imageSize.v; //Col Size
	
	fftw_complex *complex_in  = (fftw_complex *) data;
	complex_in  = (fftw_complex *) fftw_malloc(xsize * ysize * sizeof(fftw_complex));


/*needed for debug
char string[180];
char strCaption[] = {"Info"};
int debug = 1;

//needed for debug
if (debug == 1) {
	sprintf(string, "IFFT1: dLight = %f, cLight = %X, nLight = %hd\nchar 1 = %x, char 2 = %x", dLight, cLight, nLight,
		out[(fPB->outRowBytes*j) + (fPB->planes*i*fPB->inPlaneBytes) + (plane*fPB->inPlaneBytes)],
		out[(fPB->outRowBytes*j) + (fPB->planes*i*fPB->inPlaneBytes) + (plane*fPB->inPlaneBytes)+1]);
	if (MessageBox(HWnd, string, strCaption, MB_OKCANCEL | MB_APPLMODAL ) == 2) debug = 0;
}
*/			
	unsigned short nSat, nHue, nLight;
	unsigned short nRed, nBlue, nGreen;
	double dAmp, dPhi;
	double dMaxAmp;
	double nMax;
	nMax = xsize*ysize*255+1;
	dMaxAmp = log10(nMax);
	nMax = 255.0;
	
/*
Inverse transform

  1. first reconstruct complex numbers
	 Amp = 10^(MaxAmp*(Lightness/255))-1
	 Phi = 2*pi*Hue/255
    
	 Re = Amp*cos(Phi);
	 Im = Amp*sin(Phi);
*/

	for(i=0;i<xsize;i++)	
	for(j=0;j<ysize;j++)		
	{
		unsigned short nVal;
		for(int plane=0;plane<fPB->planes;plane++)	// Color cycle	0=R 1=G 2=B 3=transparency(if present)
		{  
			if (fPB->imageMode == 3) nVal = in[fPB->inRowBytes*j + fPB->planes*i + plane];
			else {
				memcpy(&nVal,&in[(fPB->outRowBytes*j) + (fPB->planes*i*fPB->inPlaneBytes) + (plane*fPB->inPlaneBytes)],2);    
				nVal = nVal*255/32768;
			}
			if (plane==0) 
				nRed = nVal;
			if (plane==1) 
				nGreen = nVal;
			if (plane==2) 
				nBlue = nVal;
		}
		Color.RGBtoHLS(nRed, nGreen, nBlue, &nLight, &nSat, &nHue);
		dAmp = pow(10, (dMaxAmp*(nRed/nMax)) )-1;
		dPhi = 2.0*PI*nGreen/nMax;
		c_re(complex_in[xsize*j + i]) = dAmp*cos(dPhi);
		c_im(complex_in[xsize*j + i]) = dAmp*sin(dPhi);
	}

	ip = fftw_plan_dft_2d(ysize, xsize, complex_in, complex_in, FFTW_BACKWARD,
 							FFTW_ESTIMATE);

	fftw_execute(ip); 
	fftw_destroy_plan(ip); 

	
	double dLight;
	unsigned char cLight;
	union short_or_chars {
		unsigned short s;
		unsigned char c[2];
	} sLight;

	//Show image 	Transfer from complex to image 
	for(i=0;i<xsize;i++)	
	for(j=0;j<ysize;j++)		
	{
		if (fPB->imageMode == 3) nLight = round_to_byte( Color.ComplexAbs(c_re(complex_in[xsize*j + i]), c_im(complex_in[xsize*j + i]))/(ysize*xsize));
		else {	// easier to debug like this
			dLight = Color.ComplexAbs(c_re(complex_in[xsize*j + i]), c_im(complex_in[xsize*j + i]))/(ysize*xsize);
			cLight = round_to_byte(dLight);
			nLight = cLight *32768/255;
			sLight.s = nLight;
		}
		for(int plane=0;plane<fPB->planes;plane++)	// by color 0=R 1=G 2=B 3=Transparency(if present)
		{
			if (fPB->imageMode == 3) out[fPB->outRowBytes*j + fPB->planes*i + plane] = (unsigned char)nLight;
			else {
				out[(fPB->outRowBytes*j) + (fPB->planes*i*fPB->inPlaneBytes) + (plane*fPB->inPlaneBytes)] = sLight.c[0];
				out[(fPB->outRowBytes*j) + (fPB->planes*i*fPB->inPlaneBytes) + (plane*fPB->inPlaneBytes)+1] = sLight.c[1]; 
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

