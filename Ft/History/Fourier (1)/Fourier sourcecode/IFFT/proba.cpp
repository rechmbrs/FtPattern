/*
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

#define VER	 "3.2"

myColor Color;	

void Pump_FFTtoPowerSpectraNoShift(unsigned char* out, fftw_complex *complex_in, int xsize, int ysize);
void Shift(unsigned char* out, unsigned char* in,  int xsize, int ysize);

HANDLE hDllInstance = NULL;

// Точка входа (инициализация dll)
// Выполняется один раз при сканировании фотошопом директории "Plugins"

BOOL APIENTRY DLLEntry(HANDLE hInstance, DWORD fdwReason, LPVOID lpReserved)
{
	if (fdwReason == DLL_PROCESS_ATTACH)	
		hDllInstance = hInstance;		// получаем дескриптор процесса

	return 1;
}
short ErrorCode = 0;
										// Это наш "навороченный" диалог
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
										// Точка входа при вызове фильтра
										// Вызывается несколько раз (минимум три) с разными значениями selector

void ENTRYPOINT (	const short		selector,  // TYPE of action requared
					FilterRecord	*fPB,	   // Указатель на структуру содержащую необходимую информацию об изображении
					long			*data,	   // Никогда этот указатель не используйте	(лучше храните всё в реестре)
					short			*result)   // Этой переменной мы должны присвоить код ошибки перед возвратом
{

	HWND HWnd=NULL;
	PlatformData *platform;

	if(selector==0)	platform = (PlatformData *)(fPB->serialNumber);
		else		platform = (PlatformData *)(fPB->platformData);

	if(platform!=NULL)HWnd = (HWND)platform->hwnd;			// Вот так нам передают дескриптор родительского окна
	
	if(selector == filterSelectorStart)		// В этом месте мы запрашиваем указатели на массивы с данными
	{
		SetRectMy(&fPB->inRect  ,0,0,fPB->imageSize.h, fPB->imageSize.v);  // Входной буфер целиком
		SetRectMy(&fPB->outRect ,0,0,fPB->imageSize.h, fPB->imageSize.v);  // Выходной буфер целиком
		SetRectMy(&fPB->maskRect,0,0,0,0);								   // Маску игнорируем
		fPB->inLoPlane	=0;				   // Первый запрашиваемый план    (красный)
		fPB->inHiPlane	=fPB->planes-1;	   // Последний запрашиваемый план (голубой либо прозрачность)
		fPB->outLoPlane	=0;
		fPB->outHiPlane	=fPB->planes-1;

	}

	if(selector == filterSelectorContinue)
	{	/*	
		// Dialog box
			if( DialogBox((HINSTANCE)hDllInstance,"proba",HWnd,ProbaDialog))
			{
				MessageBox(HWnd, "Can't load dialog box!\n", NULL, MB_OK | MB_APPLMODAL );
				ErrorCode = userCanceledErr;
			}
 		//	if(ErrorCode == = userCanceledErr){*result=ErrorCode;	return;}	// ненормальное завершение

		// ОБРАБОТКА ИЗОБРАЖЕНИЯ
/*
		for(long row=0;row<fPB->imageSize.v;row++)			// Цикл по строкам
			for(long col=0;col<fPB->imageSize.h;col++)		// По столбцам
				for(long plane=0;plane<fPB->planes;plane++)	// По цветам	0=R 1=G 2=B 3=Transparency(если есть)
				{
					fPB->outData[fPB->outRowBytes*row + fPB->planes*col + plane]
					=
					fPB->inData [fPB->inRowBytes*(fPB->imageSize.v-row-1)  + fPB->planes*col + plane];
				}
*//*
		for(long row=0;row<fPB->imageSize.v;row++)			// Цикл по строкам
			for(long col=0;col<fPB->imageSize.h;col++)		// По столбцам
				for(long plane=0;plane<fPB->planes;plane++)	// По цветам	0=R 1=G 2=B 3=Transparency(если есть)
				{
					fPB->outData[fPB->outRowBytes*row + fPB->planes*col + plane]
					=	100+fPB->inData [fPB->inRowBytes*row + fPB->planes*col + plane];
				}
*/

	SetRectMy(&fPB->inRect  ,0,0,0,0); // Не забываем обнулить запрос на данные	иначе зациклимся
	SetRectMy(&fPB->outRect ,0,0,0,0);
	SetRectMy(&fPB->maskRect,0,0,0,0);


	fftwnd_plan ip; //inverse plane

	int i, j;

	unsigned char* in  = fPB->inData;
    unsigned char* out = fPB->outData;

	int xsize = fPB->imageSize.h; //Row Size 
	int ysize = fPB->imageSize.v; //Col Size
	
	unsigned char* buf1;
	buf1     = new unsigned char [xsize*ysize];

	fftw_complex *complex_in  = (fftw_complex *) data;
	fftw_complex *complex_out = (fftw_complex *) data;

	complex_in  = (fftw_complex *) malloc(xsize * ysize * sizeof(fftw_complex));
	complex_out = (fftw_complex *) malloc(xsize * ysize * sizeof(fftw_complex));

/*
	//needed for debug
	char string[80];
	char strCaption[] = {"Info"};

	sprintf(string, "FFT: Size_xy( %d %d) bpr (in out)= (%d %d) color %d Ver: %s\n", xsize, ysize,fPB->inRowBytes, fPB->outRowBytes, fPB->planes, VER);
	MessageBox(HWnd, string, strCaption, MB_OK | MB_APPLMODAL );
*/
			
	unsigned char nSat, nHue, nLight;
	unsigned char nRed, nBlue, nGreen;
	double dAmp, dPhi;
	double dMaxAmp = log10(xsize*ysize*255+1);
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
		for(long plane=0;plane<fPB->planes;plane++)	// by color 0=R 1=G 2=B 3=Transparency(if present)
		{
			if (plane==0) 
				nRed = out[fPB->outRowBytes*j + fPB->planes*i + plane];
			if (plane==1) 
				nGreen = out[fPB->outRowBytes*j + fPB->planes*i + plane];
			if (plane==2) 
				nBlue = out[fPB->outRowBytes*j + fPB->planes*i + plane];
		}
		Color.RGBtoHLS(RGB(nRed, nGreen, nBlue), nLight, nSat, nHue);
		
		dAmp = pow(10, (dMaxAmp*(nLight/255.0)) )-1;
		dPhi = 2.0*PI*nHue/255.0;
		complex_in[xsize*j + i].re = dAmp*cos(dPhi);
		complex_in[xsize*j + i].im = dAmp*sin(dPhi);
	}

	ip = fftw2d_create_plan(ysize, xsize, FFTW_BACKWARD,
                            //FFTW_MEASURE
							FFTW_ESTIMATE | FFTW_IN_PLACE);
	fftwnd_one(ip, complex_in, NULL); 
	fftwnd_destroy_plan(ip); 

	//Show image 	Transfer from complex to image 
	for(i=0;i<xsize;i++)	
	for(j=0;j<ysize;j++)		
	{
		nLight = round_to_byte( Color.ComplexAbs(complex_in[xsize*j + i].re, complex_in[xsize*j + i].im)/(ysize*xsize));
		for(long plane=0;plane<fPB->planes;plane++)	// by color 0=R 1=G 2=B 3=Transparency(if present)
		{
				out[fPB->outRowBytes*j + fPB->planes*i + plane] = nLight;
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

