// myColor.cpp: implementation of the myColor class.
//
//////////////////////////////////////////////////////////////////////

#include "myColor.h"

//////////////////////////////////////////////////////////////////////
// Construction/Destruction
//////////////////////////////////////////////////////////////////////
#define  HLSMAX   255   /* H,L, and S vary over 0-hlsmax */ 
#define  RGBMAX   255   /* R,G, and B vary over 0-rgbmax */ 
                        /* HLSMAX BEST IF DIVISIBLE BY 6  like 252 (240 in windows)*/ 
                        /* RGBMAX, HLSMAX must each fit in a byte. */ 

/* Hue is undefined if Saturation is 0 (grey-scale) */ 
/* This value determines where the Hue scrollbar is */ 
/* initially set for achromatic colors */ 
#define UNDEFINED (HLSMAX*2/3)


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
		hlsmax = HLSMAX;
		rgbmax = HLSMAX;
	} else {
		hlsmax = HLSMAX;
		rgbmax = HLSMAX;
	}
	undefined = hlsmax*2/3;
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

	return hlsmax*phi/(2.0*PI); 
	/*
  another way is to correct phi: 
  if Re > 0  phi = atan(Im/Re);
  if Re < 0  phi = pi + atan(Im/Re);
  
  if Phi<0 phi = 2*pi + phi
  */
}


void myColor::RGBtoHLS(unsigned short R, unsigned short G, unsigned short B, unsigned short *L, unsigned short  *S, unsigned short *H)
{
      short cMax,cMin;      /* max and min RGB values */ 
	  WORD  Rdelta,Gdelta,Bdelta; /* intermediate value: % of spread from max  */ 

      /* calculate lightness */ 
      cMax = max( max(R,G), B);
      cMin = min( min(R,G), B);
      *L = ( ((cMax+cMin)*hlsmax) + rgbmax )/(2*rgbmax);

      if (cMax == cMin) {           /* r=g=b --> achromatic case */ 
         *S = 0;                     /* saturation */ 
         *H = undefined;             /* hue */ 
      }
      else {                        /* chromatic case */ 
         /* saturation */ 
         if (*L <= (hlsmax/2))
            *S = ( ((cMax-cMin)*hlsmax) + ((cMax+cMin)/2) ) / (cMax+cMin);
         else
            *S = ( ((cMax-cMin)*hlsmax) + ((2*rgbmax-cMax-cMin)/2) )
               / (2*rgbmax-cMax-cMin);

         /* hue */ 
      Rdelta = ( ((cMax-R)*(hlsmax/6)) + ((cMax-cMin)/2) ) / (cMax-cMin);
      Gdelta = ( ((cMax-G)*(hlsmax/6)) + ((cMax-cMin)/2) ) / (cMax-cMin);
      Bdelta = ( ((cMax-B)*(hlsmax/6)) + ((cMax-cMin)/2) ) / (cMax-cMin);

         if (R == cMax)
            *H = Bdelta - Gdelta;
         else if (G == cMax)
            *H = (hlsmax/3) + Rdelta - Bdelta;
         else /* B == cMax */ 
            *H = ((2*hlsmax)/3) + Gdelta - Rdelta;

         if (*H < 0)
            *H += hlsmax;
         if (*H > hlsmax)
            *H -= hlsmax;
      }
}

myColor::~myColor()
{

}
