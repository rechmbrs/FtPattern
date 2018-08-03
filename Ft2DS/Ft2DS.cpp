// Ft2DSv1.06
#define PLUGIN "Ft2DS Forward FOURIER Transform"
#define AUTHOR "RONC"
#define VER     "1.06<>"

//********************************************************************************************************
//
//********************************************************************************************************
// this file should be same as one for forward transform but with these interchanged
// both contain same code but one executes forward and the other inverse
#define FORWARD_Transform  true   //FORWARD Ft2DS.8bf
#define INVERSE_Transform  false  //INVERSE iFt2DS.8bf
//********************************************************************************************************
//********************************************************************************************************


/*
 Ron Chambers, rechmbrs@gmail.com  Ft2DS_iFt2DS
 Fixed 8 and 16 bit/channel images, added 32 bit/channel images, and simplified overall coding.
 
 Corrected inverse for missing the correction back to upper left corner to compensate for move to center in forward.
 
 Note:  16 bit/channel input images are NOT converted to 8 bit/channel values for processing as in previous version.  All processing is 32 bit/channel floating point but intermediate storage (Photoshop layer) is either 8, 16, or 32 bit/channel.
 
 Special note:  Adobe image formats expect only 0 and positive numbers with the maximum defined by the bit depth  8, 16, or 32.
 
 Photoshop CC 2018 / VisualStudio 2017 Community
 
 November/December 2017  January/February 2018
 
 */
//****************************************************
/*
 Phil Thornton, www.mdr.co.nz
 modified for 64 bit Photoshop, and fftw v3 in dll, and 16 bit images
 and simplified
 
 Note that 16 bit input images are converted to 8 bit values for processing
 
 April 2010
 
 */
//****************************************************
/*
 Alex Chirokov
 Drexel University, 2005
 
 1. 4/08/05: Dialog box is removed
 
 TODO: translate the comments to English
 */
//****************************************************
/*
 FORWARD FFT and INVERSE FFT
 where the R and G channel are used
 */
/*
 Multi dim arrays row-based order (C-order not Fortran-order)
 i  j
 in [X][Y] = in [j+Y * i]
 
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

//********************************************************************************************************
//********************************************************************************************************
//********************************************************************************************************

#ifdef _WIN32
#include <windows.h>
#include "..\Ft_lib\fftw3.h"
#include "C:\adobe_photoshop_sdk_cc_2017_win\pluginsdk\photoshopapi\photoshop\PIFilter.h"
#include "..\Ft_lib\Ft_lib.h"
#elif __APPLE__
#include "../Ft_lib/fftw3.h"
#include "../Ft_lib/Ft_lib.h"
#include <PIFilter.h>
#include <PIUtilities.h>
#include <DialogUtilities.h>
#endif
#include <math.h>
#include <string>
#include <thread>

#include "Ft2DS_resource.h"


#define c_re(c) ((c)[0])
#define c_im(c) ((c)[1])

#define filterSelectorAbout      0
#define filterSelectorParameters 1
#define filterSelectorPrepare     2
#define filterSelectorStart      3
#define filterSelectorContinue     4
#define filterSelectorFinish     5

#define userCanceledErr            (-128)
#define memoryCancelErr            (-64)

#define CONCAT2(a, b) a b
#define CONCAT(a, b) CONCAT2(a, b)
#define VERSION CONCAT(VER, __DATE__)

#define u_zLen 1024
wchar_t* uString = new wchar_t[u_zLen];
wchar_t* vString = new wchar_t[u_zLen];
wchar_t* wString = new wchar_t[u_zLen];
char xString[u_zLen];
char yString[u_zLen];
char zString[u_zLen];

int iERR = 0;

#ifdef __APPLE__
SPBasicSuite * sSPBasic = NULL;
#endif

void SetRectMy(Rect *rect, short top, short left, short right, short bottom)
{
    rect->top = top;
    rect->left = left;
    rect->right = right;
    rect->bottom = bottom;
}

#ifdef _WIN32
HANDLE hDllInstance = NULL;

// Entry point (dll initialization)
// Executed once when PhotoShop scans the "Plugins" folder

BOOL APIENTRY DLLEntry(HANDLE hInstance, DWORD fdwReason, LPVOID lpReserved)
{
    if(fdwReason == DLL_PROCESS_ATTACH)
        hDllInstance = hInstance;        // Process descriptor
    return 1;
}
#endif

//
// These are the dialog window parameters
//
short ErrorCode = 0;

bool Forward = FORWARD_Transform;//FORWARD Ft2DS.8bf
bool Inverse = INVERSE_Transform;//INVERSE iFt2DS.8bf

// Entry point, executed when user starting this plugin
// Executed several times (3 times minimum) with different "selector" values

#ifdef _WIN32
extern "C" __declspec(dllexport) void ENTRYPOINT(
                                                 const short        selector,  // TYPE of action required
                                                 FilterRecord    *fPB,       // Pointer to the information about image
                                                 intptr_t        *data,       // Never use this one, keep everything in registry
                                                 short           *result)   // Error code should be assigned to this variable  before return
{
    HWND HWnd = NULL;
    PlatformData *platform;
    
    platform = (PlatformData *)(fPB->platformData);
    
    if(platform != NULL)HWnd = (HWND)platform->hwnd;            // Descriptor of parent window
    
#elif __APPLE__
    DLLExport MACPASCAL void PluginMain(const int16        selector,  // TYPE of action required
                                        FilterRecordPtr    fPB,       // Pointer to the information about image
                                        intptr_t        *data,       // Never use this one, keep everything in registry
                                        int16            *result)   // Error code should be assigned to this variable  before return
    {
#endif
        int xSize = fPB->imageSize.h; //Row Size
        int ySize = fPB->imageSize.v; //Col Size
        double xSize_X_ySize = (double)(xSize * ySize);
        int bitDepth = fPB->depth;    //Bit Depth/Channel
        int nPlanes = fPB->planes;    //Number planes
        int nChans = nPlanes - 1;     //Number channels
        
        double PI = (double)3.141592653589793238462102433832795;
        double Rad2Deg = (double)180.0000000 / PI;
        double dSat[3] = { 0.333, 0.333, 0.334 };//straight sum
        
        if(selector == filterSelectorStart)        // Request pointers to data arrays
        {
            SetRectMy(&fPB->inRect, 0, 0, xSize, ySize);   // Input buffer (Whole)
            fPB->inLoPlane = 0;                               // First requested plane (RED)
            fPB->inHiPlane = (short)nChans;       // Last requested plane (Blue or transparency)
            
            SetRectMy(&fPB->outRect, 0, 0, xSize, ySize);  // Output buffer (Whole)
            fPB->outLoPlane = 0;
            fPB->outHiPlane = (short)nChans;
            
            SetRectMy(&fPB->maskRect, 0, 0, 0, 0);
        }
        
        if(selector == filterSelectorContinue)
        {
            //********************************************************************************************************
            //    }
            //  if(selector == filterSelectorContinue)
            //  {
            //********************************************************************************************************
            // Data initialization
            //********************************************************************************************************
            double dSum;
            
            unsigned char* cIn = (unsigned char*)fPB->inData;
            unsigned short* sIn = (unsigned short*)fPB->inData;
            float* fIn = (float*)fPB->inData;
            long iRC = fPB->inRowBytes;
            long iRS = fPB->inRowBytes / 2;
            long iRF = fPB->inRowBytes / 4;
            
            unsigned char* cOut = (unsigned char*)fPB->outData;
            unsigned short* sOut = (unsigned short*)fPB->outData;
            float* fOut = (float*)fPB->outData;
            long oRC = fPB->outRowBytes;
            long oRS = fPB->outRowBytes / 2;
            long oRF = fPB->outRowBytes / 4;
            
            double dAmp, dPhz;
            double dRe, dIm;
            double dAmpMx, dAmpMxD2;
            double degMax = 360.0;
            double dLG;
            double dRnd;
            double dRound = 0.5;
            
            long iAmpMx;
            
            int i, j;
            
            fftw_plan p;
            fftw_complex *complex_in = (fftw_complex *)data;
            complex_in = (fftw_complex *)fftw_malloc((xSize + 4) * (ySize + 4) * sizeof(fftw_complex) + 64);
            
            // Init FFTW
            unsigned concurentThreadsSupported = std::thread::hardware_concurrency();
            
            fftw_init_threads();
            fftw_plan_with_nthreads(concurentThreadsSupported);
            //******************************************************************************************************
            // 8 bit images
            //******************************************************************************************************
            if(bitDepth == 8)
            {
                //****************************************************
                // 8 bit Forward
                //****************************************************
                if(Forward == true)
                {
                    iAmpMx = 255;
                    dAmpMx = (double)iAmpMx;
                    dAmpMxD2 = dAmpMx / (double)2.0;
                    dLG = log10(dAmpMx * xSize_X_ySize) / dAmpMx;
                    /*
                     3D
                     indx = x + y * xmx + z * xmx * ymx
                     = x + (y + z * ymx) * xmx
                     x = indx % xmx
                     y = (indx / xmx) % ymx
                     z = indx / (xmx * ymx)
                     
                     2D
                     indx = x + y * xmx
                     x = indx % xmx
                     y = (indx / xmx) % ymx
                     */
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dSum = 0.0001;
                            dSum = dSum + (double)cIn[iRC * j + nPlanes * i + 0] * dSat[0];
                            dSum = dSum + (double)cIn[iRC * j + nPlanes * i + 1] * dSat[1];
                            dSum = dSum + (double)cIn[iRC * j + nPlanes * i + 2] * dSat[2];
                            dRnd = absRoundLimit(dSum, dAmpMx, dRound);
                            cOut[oRC * j + nPlanes * i + 2] = (unsigned char)dRnd;
                            
                            if(((i + j) % 2) == 1) dSum = -dSum;
                            //Copy from data to complex_in by using "((i+j)%2==0?1:-1)" to put origin
                            //  (zero frequency in the center) (-1)^(i+j)= pow(-1,i+j) = ((i+j)%2==0?1:-1)
                            
                            c_re(complex_in[xSize * j + i]) = (float)dSum;
                            c_im(complex_in[xSize * j + i]) = (float)0.0;
                        }
                    }
                    //****************************************************
                    // 8 bit Forward   compute forward transform
                    //****************************************************
                    p = fftw_plan_dft_2d(ySize, xSize, complex_in, complex_in, FFTW_FORWARD, FFTW_ESTIMATE);
                    fftw_execute(p);
                    fftw_destroy_plan(p);
                    //****************************************************
                    // 8 bit Forward    compute Spectra
                    //****************************************************
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dAmp = 0.0;
                            dPhz = 0.0;
                            dRe = (double)c_re(complex_in[xSize * j + i]);
                            dIm = (double)c_im(complex_in[xSize * j + i]);
                            dAmp = (double)sqrt(dRe * dRe + dIm * dIm);
                            if(dAmp > 0.0)
                            {
                                dAmp = (double)log10(dAmp) / dLG;
                                dPhz = (double)atan2(dIm, dRe) * Rad2Deg * (dAmpMx / degMax) + dAmpMxD2;
                            }
                            dRnd = absRoundLimit(dAmp, dAmpMx, dRound);
                            cOut[oRC * j + nPlanes * i + 0] = (unsigned char)dRnd;
                            dRnd = absRoundLimit(dPhz, dAmpMx, dRound);
                            cOut[oRC * j + nPlanes * i + 1] = (unsigned char)dRnd;
                        }
                    }
                }
                //****************************************************
                // 8 bit Inverse
                //****************************************************
                if(Inverse == true)
                {
                    iAmpMx = 255;
                    dAmpMx = (double)iAmpMx;
                    dAmpMxD2 = dAmpMx / (double)2.0;
                    dLG = log10(dAmpMx * xSize_X_ySize) / dAmpMx;
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dAmp = 0.0;
                            dPhz = 0.0;
                            dRe = (double)cIn[iRC * j + nPlanes * i + 0];
                            if(dRe > 0.0)
                            {
                                dIm = (double)cIn[iRC * j + nPlanes * i + 1];
                                
                                dAmp = (double)pow(10, dRe * dLG);
                                dPhz = (dIm - dAmpMxD2) / (Rad2Deg * (dAmpMx / degMax));
                            }
                            c_re(complex_in[xSize * j + i]) = dAmp * cos(dPhz);
                            c_im(complex_in[xSize * j + i]) = dAmp * sin(dPhz);
                        }
                    }
                    //****************************************************
                    // 8 bit Inverse    compute inverse transform
                    //****************************************************
                    p = fftw_plan_dft_2d(ySize, xSize, complex_in, complex_in, FFTW_BACKWARD, FFTW_ESTIMATE);
                    fftw_execute(p);
                    fftw_destroy_plan(p);
                    //****************************************************
                    // 8 bit Inverse    compute illumination from SpectrA
                    //****************************************************
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dRe = (double)c_re(complex_in[xSize * j + i]) / xSize_X_ySize;
                            dIm = (double)c_im(complex_in[xSize * j + i]) / xSize_X_ySize;
                            
                            dRe = (double)sqrt(dRe * dRe + dIm * dIm);
                            dRnd = absRoundLimit(dRe, dAmpMx, dRound);
                            cOut[oRC * j + nPlanes * i + 0] = (unsigned char)dRnd;
                            cOut[oRC * j + nPlanes * i + 1] = (unsigned char)dRnd;
                            cOut[oRC * j + nPlanes * i + 2] = (unsigned char)dRnd;
                        }
                    }
                }
            }
            //********************************************************************************************************
            // 16 bit images
            //********************************************************************************************************
            if(bitDepth == 16)
            {
                //****************************************************
                // 16 bit Forward
                //****************************************************
                if(Forward == true)
                {
                    iAmpMx = 32768;
                    dAmpMx = (double)iAmpMx;
                    dAmpMxD2 = dAmpMx / (double)2.0;
                    dLG = log10(dAmpMx * xSize_X_ySize) / dAmpMx;
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dSum = 0.01;
                            dSum = dSum + (double)sIn[iRS * j + nPlanes * i + 0] * dSat[0];
                            dSum = dSum + (double)sIn[iRS * j + nPlanes * i + 1] * dSat[1];
                            dSum = dSum + (double)sIn[iRS * j + nPlanes * i + 2] * dSat[2];
                            dRnd = absRoundLimit(dSum, dAmpMx, dRound);
                            sOut[oRS * j + nPlanes * i + 2] = (unsigned short)dRnd;
                            if(((i + j) % 2) == 1) dSum = -dSum;
                            
                            c_re(complex_in[xSize * j + i]) = (float)dSum;
                            c_im(complex_in[xSize * j + i]) = (float)0.0;
                        }
                    }
                    //****************************************************
                    // 16 bit Forward     compute forward transform
                    //****************************************************
                    p = fftw_plan_dft_2d(ySize, xSize, complex_in, complex_in, FFTW_FORWARD, FFTW_ESTIMATE);
                    fftw_execute(p);
                    fftw_destroy_plan(p);
                    //****************************************************
                    // 16 bit Forward    compute Spectra
                    //****************************************************
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dAmp = 0.0;
                            dPhz = 0.0;
                            dRe = (double)c_re(complex_in[xSize * j + i]);
                            dIm = (double)c_im(complex_in[xSize * j + i]);
                            dAmp = (double)sqrt(dRe * dRe + dIm * dIm);
                            if(dAmp > 0.0)
                            {
                                dAmp = (double)log10(dAmp) / dLG;
                                dPhz = (double)atan2(dIm, dRe) * Rad2Deg * (dAmpMx / degMax) + dAmpMxD2;
                            }
                            dRnd = absRoundLimit(dAmp, dAmpMx, dRound);
                            sOut[oRS * j + nPlanes * i + 0] = (unsigned short)dRnd;
                            dRnd = absRoundLimit(dPhz, dAmpMx, dRound);
                            sOut[oRS * j + nPlanes * i + 1] = (unsigned short)dRnd;
                        }
                    }
                }
                //****************************************************
                // 16 bit Inverse
                //****************************************************
                if(Inverse == true)
                {
                    iAmpMx = 32768;
                    dAmpMx = (double)iAmpMx;
                    dAmpMxD2 = dAmpMx / (double)2.0;
                    dLG = log10(dAmpMx * xSize_X_ySize) / dAmpMx;
                    
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dAmp = 0.0;
                            dPhz = 0.0;
                            dRe = (double)sIn[iRS * j + nPlanes * i + 0];
                            if(dRe > 0.0)
                            {
                                dIm = (double)sIn[iRS * j + nPlanes * i + 1];
                                
                                dAmp = (double)pow(10, dRe * dLG);
                                dPhz = (dIm - dAmpMxD2) / (Rad2Deg * (dAmpMx / degMax));
                            }
                            c_re(complex_in[xSize * j + i]) = dAmp * cos(dPhz);
                            c_im(complex_in[xSize * j + i]) = dAmp * sin(dPhz);
                        }
                    }
                    //****************************************************
                    // 16 bit Inverse    compute inverse transform
                    //****************************************************
                    p = fftw_plan_dft_2d(ySize, xSize, complex_in, complex_in, FFTW_BACKWARD, FFTW_ESTIMATE);
                    fftw_execute(p);
                    fftw_destroy_plan(p);
                    //****************************************************
                    // 16 bit Inverse    compute Spectra
                    //****************************************************
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dRe = (double)c_re(complex_in[xSize * j + i]) / xSize_X_ySize;
                            dIm = (double)c_im(complex_in[xSize * j + i]) / xSize_X_ySize;
                            dRe = (double)sqrt(dRe * dRe + dIm * dIm);
                            dRnd = absRoundLimit(dRe, dAmpMx, dRound);
                            sOut[oRS * j + nPlanes * i + 0] = (unsigned short)dRnd;
                            sOut[oRS * j + nPlanes * i + 1] = (unsigned short)dRnd;
                            sOut[oRS * j + nPlanes * i + 2] = (unsigned short)dRnd;
                        }
                    }
                }
            }
            //********************************************************************************************************
            // 32 bit images
            //********************************************************************************************************
            if(bitDepth == 32)
            {
                //****************************************************
                // 32 bit Forward
                //****************************************************
                if(Forward == true)
                {
                    iAmpMx = 1;
                    dAmpMx = (double)iAmpMx;
                    dAmpMxD2 = dAmpMx / (double)2.0;
                    dLG = log10(dAmpMx * xSize_X_ySize) / dAmpMx;
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dSum = 0.001;
                            dSum = dSum + (double)fIn[iRF * j + nPlanes * i + 0] * dSat[0];
                            dSum = dSum + (double)fIn[iRF * j + nPlanes * i + 1] * dSat[1];
                            dSum = dSum + (double)fIn[iRF * j + nPlanes * i + 2] * dSat[2];
                            fOut[oRF * j + nPlanes * i + 2] = (float)dSum;
                            if(((i + j) % 2) == 1) dSum = -dSum;
                            
                            c_re(complex_in[xSize * j + i]) = (float)dSum;
                            c_im(complex_in[xSize * j + i]) = (float)0.0;
                        }
                    }
                    //****************************************************
                    // 32 bit Forward     compute forward transform
                    //****************************************************
                    p = fftw_plan_dft_2d(ySize, xSize, complex_in, complex_in, FFTW_FORWARD, FFTW_ESTIMATE);
                    fftw_execute(p);
                    fftw_destroy_plan(p);
                    //****************************************************
                    // 32 bit Forward    compute Spectra
                    //****************************************************
                    // range of numbers is - to + dAmpMx
                    // Photoshop only likes 0 and positive numbers
                    //  cIn, sIn, fIn, cOut, sOut, and fOut arrays
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dAmp = 0.0;
                            dPhz = 0.0;
                            dRe = (double)c_re(complex_in[xSize * j + i]);
                            dIm = (double)c_im(complex_in[xSize * j + i]);
                            dAmp = (double)sqrt(dRe * dRe + dIm * dIm);
                            if(dAmp > 0.0)
                            {
                                dAmp = (double)log10(dAmp) / dLG;
                                dPhz = (double)atan2(dIm, dRe) * Rad2Deg * (dAmpMx / degMax) + dAmpMxD2;
                            }
                            fOut[oRF * j + nPlanes * i + 0] = (float)dAmp;
                            fOut[oRF * j + nPlanes * i + 1] = (float)dPhz;
                        }
                    }
                }
                //****************************************************
                // 32 bit Inverse
                //****************************************************
                if(Inverse == true)
                {
                    iAmpMx = 1;
                    dAmpMx = (double)iAmpMx;
                    dAmpMxD2 = dAmpMx / (double)2.0;
                    dLG = log10(dAmpMx * xSize_X_ySize) / dAmpMx;
                    
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dAmp = 0.0;
                            dPhz = 0.0;
                            dRe = (double)fIn[iRF * j + nPlanes * i + 0];
                            if(dRe > 0.0)
                            {
                                dIm = (double)fIn[iRF * j + nPlanes * i + 1];
                                
                                dAmp = (double)pow(10, dRe * dLG);
                                dPhz = (dIm - dAmpMxD2) / (Rad2Deg * (dAmpMx / degMax));
                            }
                            c_re(complex_in[xSize * j + i]) = (float)dAmp * cos(dPhz);
                            c_im(complex_in[xSize * j + i]) = (float)dAmp * sin(dPhz);
                        }
                    }
                    //****************************************************
                    // 32 bit Inverse    compute inverse transform
                    //****************************************************
                    p = fftw_plan_dft_2d(ySize, xSize, complex_in, complex_in, FFTW_BACKWARD, FFTW_ESTIMATE);
                    fftw_execute(p);
                    fftw_destroy_plan(p);
                    //****************************************************
                    // 32 bit Inverse     compute illumination from SpectrA
                    //****************************************************
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dRe = (double)c_re(complex_in[xSize * j + i]) / xSize_X_ySize;
                            dIm = (double)c_im(complex_in[xSize * j + i]) / xSize_X_ySize;
                            dRe = (double)sqrt(dRe * dRe + dIm * dIm);
                            fOut[oRF * j + nPlanes * i + 0] = (float)dRe;
                            fOut[oRF * j + nPlanes * i + 1] = (float)dRe;
                            fOut[oRF * j + nPlanes * i + 2] = (float)dRe;
                        }
                    }
                }
            }
            //********************************************************************************************************
            // Clean up for errors or good run
            //********************************************************************************************************
            fftw_free(complex_in);
            // The end of processing
            SetRectMy(&fPB->inRect, 0, 0, 0, 0); // Do not forget to clear data request (infinite loop)
            SetRectMy(&fPB->outRect, 0, 0, 0, 0);
            SetRectMy(&fPB->maskRect, 0, 0, 0, 0);
        } //if(selector == filterSelectorContinue)
        *result = 0;    // No Errors
        return;
    }
    //********************************************************************************************************
    // End
    //********************************************************************************************************
