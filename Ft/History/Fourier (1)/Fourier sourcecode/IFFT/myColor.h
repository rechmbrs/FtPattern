// myColor.h: interface for the myColor class.
//
//////////////////////////////////////////////////////////////////////

#if !defined(AFX_MYCOLOR_H__24ABEDCA_E6EC_4A21_A274_03675CEAE1BE__INCLUDED_)
#define AFX_MYCOLOR_H__24ABEDCA_E6EC_4A21_A274_03675CEAE1BE__INCLUDED_

#if _MSC_VER > 1000
#pragma once
#endif // _MSC_VER > 1000
#include <windows.h>
#include <math.h>

#define PI 3.1415926535897932384626433832795

unsigned char round_to_byte(double d);


class myColor  
{
public:
	myColor();
	virtual ~myColor();
	void RGBtoHLS(DWORD lRGBColor, BYTE &L, BYTE &S, BYTE &B);
	WORD HueToRGB(WORD n1,WORD n2,WORD hue);
	DWORD HLStoRGB(WORD hue,WORD lum, WORD sat);

	double ComplexAbs(double re, double im){return sqrt(re*re+im*im);};
	double ComplexPhi(double re, double im);

};

#endif // !defined(AFX_MYCOLOR_H__24ABEDCA_E6EC_4A21_A274_03675CEAE1BE__INCLUDED_)
