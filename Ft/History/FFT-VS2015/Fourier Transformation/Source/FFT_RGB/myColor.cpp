// myColor.cpp: implementation of the myColor class.

/*
Phil Thornton, www.mdr.co.nz
modified for 64 bit photoshop, and fftw v3 in dll, and 16 bit images
and simplified
April 2010
************
*/
//
//////////////////////////////////////////////////////////////////////

#include "myColor.h"

//////////////////////////////////////////////////////////////////////
// Construction/Destruction
//////////////////////////////////////////////////////////////////////
//#define  HLSMAX   255   /* H,L, and S vary over 0-HLSMAX */
//#define  RGBMAX   255   /* R,G, and B vary over 0-RGBMAX */
                        /* HLSMAX BEST IF DIVISIBLE BY 6  like 252 (240 in windows)*/
                        /* RGBMAX, HLSMAX must each fit in a byte. */
//#define UNDEFINED (HLSMAX*2/3)

//Utility function, rounds real values into byte
unsigned char round_to_byte(double d)
{
	return unsigned char (__max(0.0,__min(d+0.5, 255.0)));
}

//Utility function, rounds real values into short
unsigned short round_to_short(double d)
{
	return unsigned short (__max(0.0,__min(d+0.5, 32767.0)));
}

myColor::myColor(int inmode)
{
	mode = inmode;
	if (mode == 3) {
		hslmax = 255;
		rgbmax = 255;
	} else {
		hslmax = 252;
		rgbmax = 32768;
	}
	undefined = hslmax*2/3;
}

double myColor::ComplexPhi(double re, double im)
{
	double phi;

	if (re!=0)
		phi = atan(im/re);
	else
		phi = PI/2;

	if (re<0)
	{
		phi = PI+phi;
	}

	if (phi<0)
	{
		phi = 2*PI+phi;
	}

	return hslmax*phi/(2.0*PI);
	/*
  another way is to correct phi:
  if Re > 0  phi = atan(Im/Re);
  if Re < 0  phi = pi + atan(Im/Re);

  if Phi<0 phi = 2*pi + phi
  */
}

myColor::~myColor()
{

}
