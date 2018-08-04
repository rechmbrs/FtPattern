// Ft_lib.h
// #include "..\Ft_lib\Ft_lib.h"
#ifdef __APPLE__
#define sprintf_s snprintf;
#endif


// Prototypes
template <class NUM>
NUM dabs(NUM X);
template <class NUM>
NUM absRoundLimit(NUM X, double dMax, double dRound);
template <class NUM>
int32_t ptr3D(NUM Dim1, NUM Dim2, NUM Dim3, NUM inD1, NUM inD2, NUM inD3);
template <class NUM>
int32_t ptr2D(NUM Dim1, NUM Dim2, NUM inD1, NUM inD2);
//template <class NUM1>, <class NUM2>
int aLert(char string1, char string2);


// Source code
template <class NUM>
NUM dabs(NUM X)
{
	if(X >= 0) return X;
	return -X;
}

template <class NUM>
NUM absRoundLimit(NUM X, double dMax, double dRound)
{
	if(X >= 0)
	{
		X = X + dRound;
		if(X > dMax) X = dMax;
		return X;
	}
	else
	{
		X = -X + dRound;
		if(X > dMax) X = dMax;
		return X;
	}
}

template <class NUM>
int32_t ptr3D(NUM Dim1, NUM Dim2, NUM Dim3, NUM inD1, NUM inD2, NUM inD3)
{
	int32_t ptr = ((int32_t)inD3 + ((int32_t)Dim3 * ((int32_t)inD2 + ((int32_t)Dim2 * (int32_t)inD1))));
	return ptr;
};

template <class NUM>
int32_t ptr2D(NUM Dim1, NUM Dim2, NUM inD1, NUM inD2)
{
	int32_t ptr = ((int32_t)inD2 + ((int32_t)Dim2 * (int32_t)inD1));
	return ptr;
};

//template <class NUM1, NUM2>
int aLert(char string1[], char string2[])
{
	#define u_zLen 1024
	

	int iERR = 0;

#ifdef _WIN32
    char zString[u_zLen];
    short ErrorCode = 0;
    
    sprintf_s(static_cast<void>(zString), static_cast<void>(string1), ErrorCode);

    wchar_t* vString = new wchar_t[u_zLen];
    wchar_t* wString = new wchar_t[u_zLen];
    
	MultiByteToWideChar(CP_ACP, 0, zString, -1, wString, u_zLen);
	MultiByteToWideChar(CP_ACP, 0, string2, -1, vString, u_zLen);
	iERR = MessageBox(NULL, wString, vString, MB_OKCANCEL | MB_APPLMODAL | MB_SYSTEMMODAL);
#elifdef __APPLE__
    // iERR = MessageBox(NULL, zString, string2, MB_OKCANCEL | MB_APPLMODAL | MB_SYSTEMMODAL);
#endif
	return iERR;
}
