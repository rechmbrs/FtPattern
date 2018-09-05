/*
FORWARD FFT
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
#include <fftw.h>
#include <math.h>



#include "FRecord.h"
#include "resource.h"
#include "myColor.h"




#define filterSelectorAbout 	 0
#define filterSelectorParameters 1
#define filterSelectorPrepare	 2
#define filterSelectorStart 	 3
#define filterSelectorContinue	 4
#define filterSelectorFinish	 5

#define userCanceledErr			(-128)

#define VER	 "3.1"

myColor Color;	

void Pump_FFTtoPowerSpectraNoShift(unsigned char* out, fftw_complex *complex_in, int xsize, int ysize);

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
// This is dialog window
int FAR PASCAL ProbaDialog (HWND hWnd, unsigned int wMsg, unsigned int wParam,LONG lParam)
{
	switch( wMsg )
	{
		case WM_COMMAND:

			switch(LOWORD(wParam))
			{
				case IDCANCEL:
					ErrorCode =  userCanceledErr;
					EndDialog( hWnd,0 );
					break;

				case IDOK:
					EndDialog( hWnd,0 );
					break;
			}
	}
	return 0;
}
										// Entry point, executed when user starting this plugin
										// Executed several times (3 times minimum) with different "selector" values

void ENTRYPOINT (	const short		selector,  // TYPE of action requared
					FilterRecord	*fPB,	   // Pointer to the information about image 
					long			*data,	   // Never use this one, keep everything in registry
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
		fPB->inLoPlane	=0;				   // First requested plane (RED)
		fPB->inHiPlane	=fPB->planes-1;	   // Last requested plane (Blue or transparency)
		fPB->outLoPlane	=0;
		fPB->outHiPlane	=fPB->planes-1;

	}

	if(selector == filterSelectorContinue)
	{		// Dialog window (comment if(){} is you don't want it)
		/*
			if( DialogBox((HINSTANCE)hDllInstance,"proba",HWnd,ProbaDialog))
			{
				MessageBox(HWnd, "Can't load dialog box!\n", NULL, MB_OK | MB_APPLMODAL );
				ErrorCode = userCanceledErr;
			}
		*/
 		//if(ErrorCode == = userCanceledErr){*result=ErrorCode;	return;}	// If something is wrong

		// Image Processing (Example)
/*
		for(long row=0;row<fPB->imageSize.v;row++)			// Row cycle
			for(long col=0;col<fPB->imageSize.h;col++)		// Column cycle
				for(long plane=0;plane<fPB->planes;plane++)	// Color cycle	0=R 1=G 2=B 3=transparency(if present)
				{
					fPB->outData[fPB->outRowBytes*row + fPB->planes*col + plane]
					=
					fPB->inData [fPB->inRowBytes*(fPB->imageSize.v-row-1)  + fPB->planes*col + plane];
				}
*//*
		for(long row=0;row<fPB->imageSize.v;row++)			// Row cycle
			for(long col=0;col<fPB->imageSize.h;col++)		// Column cycle
				for(long plane=0;plane<fPB->planes;plane++)	// Color cycle	0=R 1=G 2=B 3=transparency(if present)
				{
					fPB->outData[fPB->outRowBytes*row + fPB->planes*col + plane]
					=	100+fPB->inData [fPB->inRowBytes*row + fPB->planes*col + plane];
				}
*/

	SetRectMy(&fPB->inRect  ,0,0,0,0); // Do not forget to clear data request (infinite cycle otherwise) 
	SetRectMy(&fPB->outRect ,0,0,0,0);
	SetRectMy(&fPB->maskRect,0,0,0,0);


	/*
		Data initialization 
	*/
	fftwnd_plan p;

	int i, j;
	int nSum;

	unsigned char* in  = fPB->inData;
    unsigned char* out = fPB->outData;
	unsigned char* buf1;

	int xsize = fPB->imageSize.h; //Row Size 
	int ysize = fPB->imageSize.v; //Col Size


	buf1     = new unsigned char [xsize*ysize];

	fftw_complex *complex_in  = (fftw_complex *) data;
	fftw_complex *complex_out = (fftw_complex *) data;

	complex_in  = (fftw_complex *) malloc(xsize * ysize * sizeof(fftw_complex));
	complex_out = (fftw_complex *) malloc(xsize * ysize * sizeof(fftw_complex));

/*
	//Debug window with some information about initialization (uncomment during debuging or use #ifdef _DEBUG )
	
	char string[80];
	char strCaption[] = {"Info"};

	sprintf(string, "FFT: Size_xy( %d %d) bpr (in out)= (%d %d) color %d Ver: %s\n", xsize, ysize,fPB->inRowBytes, fPB->outRowBytes, fPB->planes, VER);
	MessageBox(HWnd, string, strCaption, MB_OK | MB_APPLMODAL );
*/

	//Copy data from image to buf1, if image is colored -> convert to greyscale 
	//buf1<=in
	for(i=0;i<xsize;i++)	
	for(j=0;j<ysize;j++)	
	{
		nSum = 0;
		for(long plane=0;plane<fPB->planes;plane++)	// Color cycle	0=R 1=G 2=B 3=transparency(if present)
		{
			nSum += in[fPB->inRowBytes*j + fPB->planes*i + plane];
		}
		nSum = nSum/fPB->planes;
		buf1[xsize*j + i] = nSum;
	}

	//Copy to data to complex_in
	// use "((i+j)%2==0?1:-1)" in order to put origin (zero frequency in the center) (-1)^(i+j)= pow(-1,i+j) = ((i+j)%2==0?1:-1) 
	for(i=0;i<xsize;i++)
	for(j=0;j<ysize;j++)
	{
		complex_in[xsize*j + i].im = 0;
		complex_in[xsize*j + i].re = ((i+j)%2==0?1:-1)*buf1[xsize*j + i];
	}

	p = fftw2d_create_plan(ysize, xsize, FFTW_FORWARD,
                            //FFTW_MEASURE
							FFTW_ESTIMATE | FFTW_IN_PLACE);

	fftwnd_one(p, complex_in, NULL); 
	fftwnd_destroy_plan(p); 

	Pump_FFTtoPowerSpectraNoShift(buf1, complex_in, xsize, ysize);

	unsigned char nSat, nHue, nLight;
	double dMaxAmp = log10(xsize*ysize*255+1);


	for(i=0;i<xsize;i++)	
	for(j=0;j<ysize;j++)		
	{
		for(long plane=0;plane<fPB->planes;plane++)	// by color 0=R 1=G 2=B 3=Transparency(if present)
		{
			nHue   = round_to_byte( Color.ComplexPhi(complex_in[xsize*j + i].re, complex_in[xsize*j + i].im));
			nLight = buf1[xsize*j + i];
			nSat   = 128;
		//For Gray Image assign nLight value to ALL planes (inverse will not be possible)
			if (plane==0) 
				out[fPB->outRowBytes*j + fPB->planes*i + plane] = GetRValue(Color.HLStoRGB(nHue, nLight , nSat));
			if (plane==1) 
				out[fPB->outRowBytes*j + fPB->planes*i + plane] = GetGValue(Color.HLStoRGB(nHue, nLight , nSat));
			if (plane==2) 
				out[fPB->outRowBytes*j + fPB->planes*i + plane] = GetBValue(Color.HLStoRGB(nHue, nLight , nSat));
	
		}
	}
    

	delete [] buf1;
	free( complex_in  );
	free( complex_out );


	// The end of processing

		SetRectMy(&fPB->inRect  ,0,0,0,0); // Do not forget to clear data request (infinite cycle otherwise) 
		SetRectMy(&fPB->outRect ,0,0,0,0);
		SetRectMy(&fPB->maskRect,0,0,0,0);
		
	} //if(selector == filterSelectorContinue)



		*result = 0;	// No Errors
		return;	
}

void Pump_FFTtoPowerSpectraNoShift(unsigned char* out, fftw_complex *complex_in, int xsize, int ysize)
{
	double dMaxAmp = log10(xsize*ysize*255+1);

	int i;

	for ( i = 0; i<xsize * ysize; i++)
		out[i] = round_to_byte( 255*(log10( Color.ComplexAbs(complex_in[i].re,complex_in[i].im)+1)/dMaxAmp) );	
}
