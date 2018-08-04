// Ft3DFv1.01
#define PLUGIN "iFt3DF Forward FOURIER Transform"
#define AUTHOR "RONC"
#define VER       "1.01<>"

//********************************************************************************************************
//
//********************************************************************************************************
// this file should be same as one for forward transform but with these interchanged
// both contain same code but one executes forward and the other inverse
#define FORWARD_Transform  false   //FORWARD Ft3DF.8bf
#define INVERSE_Transform  true  //INVERSE iFt3DF.8bf
//********************************************************************************************************
//********************************************************************************************************

/*
 Ron Chambers, rechmbrs@gmail.com  Ft3DF_iFt3DF
 
 Photoshop CC 2018 / VisualStudio 2017 Community
 
 February 2018
 */
//********************************************************************************************************
//********************************************************************************************************
//********************************************************************************************************

#ifdef _WIN32
#include <windows.h>
#include "..\..\Ft_lib\fftw3.h"
#include "C:\adobe_photoshop_sdk_cc_2017_win\pluginsdk\photoshopapi\photoshop\PIFilter.h"
#include "..\..\Ft_lib\Ft_lib.h"
#elif __APPLE__
#include "../../Ft_lib/fftw3.h"
#include "../../Ft_lib/Ft_lib.h"
#include <PIFilter.h>
#include <PIUtilities.h>
#include <DialogUtilities.h>
#endif
#include <math.h>
#include <string>
#include <thread>

#include "Ft3DF_resource.h"


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

bool Forward = FORWARD_Transform;//FORWARD Ft3DF.8bf
bool Inverse = INVERSE_Transform;//INVERSE iFt3DF.8bf

// Entry point, executed when user starting this plugin
// Executed several times (3 times minimum) with different "selector" values

DLLExport MACPASCAL void PluginMain(const int16        selector,  // TYPE of action required
                                    FilterRecordPtr    fPB,       // Pointer to the information about image
                                    intptr_t        *data,       // Never use this one, keep everything in registry
                                    int16            *result)   // Error code should be assigned to this variable  before return
{
#ifdef _WIN32
    HWND HWnd = NULL;
    PlatformData *platform;
    
    platform = (PlatformData *)(fPB->platformData);
    
    if(platform != NULL)HWnd = (HWND)platform->hwnd;            // Descriptor of parent window
#endif
    
    int xSize = fPB->imageSize.h / 2; //Row Size
    int xSizeF = fPB->imageSize.h;
    int ySize = fPB->imageSize.v; //Col Size
    int zSize = 3;
    double xSize_X_ySize_X_zSize = (double)(xSize * ySize * zSize);
    
    int bitDepth = fPB->depth;    //Bit Depth/Channel
    int nPlanes = fPB->planes;    //Number planes
    int nChans = nPlanes - 1;     //Number channels
    
    double PI = (double)3.141592653589793238462102433832795;
    double Rad2Deg = (double)180.0000000 / PI;
    
    if(selector == filterSelectorPrepare)
    {
#undef _DEBUG
#ifdef _DEBUG
        //Debug window with some information about initialization
        sprintf_s(zString, "Prepare Ft3DF_iFt3DF: \n Ver: %s\n Mode: %d inCol %d byteDepth %d\n Size_xy( %d %d) bpr (in out)= (%d %d) planes %d ", VERSION, fPB->imageMode, fPB->inColumnBytes, byteDepth, xSize, ySize, fPB->inRowBytes, fPB->outRowBytes, nPlanes);
        MultiByteToWideChar(CP_ACP, 0, zString, -1, wString, u_zLen);
        MultiByteToWideChar(CP_ACP, 0, "Ft3DF_iFt3DF Info", -1, vString, u_zLen);
        MessageBox(NULL, wString, vString, MB_OK | MB_APPLMODAL);
        
        *result = 0;    // No Errors
        return;
#endif
    }
    
    if(selector == filterSelectorStart)        // Request pointers to data arrays
    {
        SetRectMy(&fPB->inRect, 0, 0, xSizeF, ySize);   // Input buffer (Whole)
        fPB->inLoPlane = 0;                               // First requested plane (RED)
        fPB->inHiPlane = (short)nChans;       // Last requested plane (Blue or transparency)
        
        SetRectMy(&fPB->outRect, 0, 0, xSizeF, ySize);  // Output buffer (Whole)
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
        
        int i, j, k;
        
        fftw_plan p;
        fftw_complex *complex_in = (fftw_complex *)data;
        complex_in = (fftw_complex *)fftw_malloc((xSize + 4) * (ySize + 4) * (zSize + 1) * sizeof(fftw_complex) + 64);
        fftw_complex *complex_ou = (fftw_complex *)data;
        complex_ou = (fftw_complex *)fftw_malloc((xSize + 4) * (ySize + 4) * (zSize + 1) * sizeof(fftw_complex) + 64);
        
        int ifDiag = 1;
        if(ifDiag == 0)
        {
#ifdef _WIN32
            sprintf_s(static_cast<void>(zString), static_cast<void>("Ft3DF_iFt3DF:  ver %s\n Image:\n   in %d\n   ou %d "), static_cast<void>(VERSION), static_cast<void>(iRC), oRC);
            MultiByteToWideChar(CP_ACP, 0, zString, -1, wString, u_zLen);
            MultiByteToWideChar(CP_ACP, 0, "Ft3DF_iFt3DF Image Info", -1, vString, u_zLen);
            iERR = MessageBox(NULL, wString, vString, MB_OKCANCEL | MB_APPLMODAL | MB_SYSTEMMODAL);
            if(iERR == IDCANCEL)
            {
                ErrorCode = userCanceledErr;
                goto ERROR_Ft3DF_iFt3DF;
            }
#elifdef __APPLE__
            // iERR = MessageBox(NULL, zString, "Ft3DF_iFt3DF Image Info", MB_OKCANCEL | MB_APPLMODAL | MB_SYSTEMMODAL);
#endif
        }
        
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
                dLG = log10(dAmpMx * xSize_X_ySize_X_zSize) / dAmpMx;
                for(k = 0; k < zSize; k++)
                {
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dSum = (double)cIn[iRC * j + nPlanes * i + k];
                            if(((i + j) % 2) == 1) dSum = -dSum;
                            //if(((i + k) % 2) == 1) dSum = -dSum;
                            //if(((k + j) % 2) == 1) dSum = -dSum;
                            c_re(complex_in[i + j * xSize + k * ySize * xSize]) = (double)dSum;    //    i + j * xSize + k * ySize * xSize
                            c_im(complex_in[i + j * xSize + k * ySize * xSize]) = (double)0.0;
                        }
                    }
                }
                //****************************************************
                // 8 bit Forward   compute forward transform
                //****************************************************
                p = fftw_plan_dft_3d(zSize, ySize, xSize, complex_in, complex_ou, FFTW_FORWARD, FFTW_ESTIMATE);
                fftw_execute(p);
                fftw_destroy_plan(p);
                //****************************************************
                // 8 bit Forward    compute Spectra
                //****************************************************
                for(k = 0; k < zSize; k++)
                {
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dAmp = 0.0;
                            dPhz = 0.0;
                            
                            //n3 + N3 * (n2 + N2 * n1)
                            dRe = (double)c_re(complex_ou[i + j * xSize + k * ySize * xSize]);
                            dIm = (double)c_im(complex_ou[i + j * xSize + k * ySize * xSize]);
                            dAmp = (double)sqrt(dRe * dRe + dIm * dIm);
                            if(dAmp > 0.0)
                            {
                                dAmp = (double)log10(dAmp) / dLG;
                                dPhz = (double)atan2(dIm, dRe) * Rad2Deg * (dAmpMx / degMax) + dAmpMxD2;
                            }
                            dRnd = absRoundLimit(dAmp, dAmpMx, dRound);
                            cOut[oRC * j + nPlanes * i + k] = (unsigned char)dRnd;
                            dRnd = absRoundLimit(dPhz, dAmpMx, dRound);
                            cOut[oRC * j + nPlanes * (i + xSize) + k] = (unsigned char)dRnd;
                        }
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
                dLG = log10(dAmpMx * xSize_X_ySize_X_zSize) / dAmpMx;
                for(k = 0; k < zSize; k++)
                {
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dRe = (double)cIn[iRC * j + nPlanes * i + k];
                            if(dRe > 0.0)
                            {
                                dIm = (double)cIn[iRC * j + nPlanes * (i + xSize) + k];
                                
                                dAmp = (double)pow(10, dRe * dLG);
                                dPhz = (dIm - dAmpMxD2) / (Rad2Deg * (dAmpMx / degMax));
                            }
                            c_re(complex_in[i + j * xSize + k * ySize * xSize]) = (float)(dAmp * cos(dPhz));
                            c_im(complex_in[i + j * xSize + k * ySize * xSize]) = (float)(dAmp * sin(dPhz));
                        }
                    }
                }
                //****************************************************
                // 8 bit Inverse    compute inverse transform
                //****************************************************
                p = fftw_plan_dft_3d(zSize, ySize, xSize, complex_in, complex_ou, FFTW_BACKWARD, FFTW_ESTIMATE);
                fftw_execute(p);
                fftw_destroy_plan(p);
                //****************************************************
                // 8 bit Inverse    compute illumination from spectra
                //****************************************************
                for(k = 0; k < zSize; k++)
                {
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dRe = (double)c_re(complex_ou[i + j * xSize + k * ySize * xSize]) / xSize_X_ySize_X_zSize;
                            dRnd = absRoundLimit(dRe, dAmpMx, dRound);
                            cOut[oRC * j + nPlanes * i + k] = (unsigned char)dRnd;
                            cOut[oRC * j + nPlanes * (i + xSize) + k] = (unsigned char)0.0;
                        }
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
                dLG = log10(dAmpMx * xSize_X_ySize_X_zSize) / dAmpMx;
                for(k = 0; k < zSize; k++)
                {
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dSum = (double)sIn[iRS * j + nPlanes * i + k];
                            if(((i + j) % 2) == 1) dSum = -dSum;
                            //if(((i + k) % 2) == 1) dSum = -dSum;
                            //if(((k + j) % 2) == 1) dSum = -dSum;
                            c_re(complex_in[i + j * xSize + k * ySize * xSize]) = (double)dSum;    //    i + j * xSize + k * ySize * xSize
                            c_im(complex_in[i + j * xSize + k * ySize * xSize]) = (double)0.0;
                        }
                    }
                }
                //****************************************************
                // 16 bit Forward     compute forward transform
                //****************************************************
                p = fftw_plan_dft_3d(zSize, ySize, xSize, complex_in, complex_ou, FFTW_FORWARD, FFTW_ESTIMATE);
                fftw_execute(p);
                fftw_destroy_plan(p);
                //****************************************************
                // 16 bit Forward    compute spectra
                //****************************************************
                for(k = 0; k < zSize; k++)
                {
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dAmp = 0.0;
                            dPhz = 0.0;
                            
                            //n3 + N3 * (n2 + N2 * n1)
                            dRe = (double)c_re(complex_ou[i + j * xSize + k * ySize * xSize]);
                            dIm = (double)c_im(complex_ou[i + j * xSize + k * ySize * xSize]);
                            dAmp = (double)sqrt(dRe * dRe + dIm * dIm);
                            if(dAmp > 0.0)
                            {
                                dAmp = (double)log10(dAmp) / dLG;
                                dPhz = (double)atan2(dIm, dRe) * Rad2Deg * (dAmpMx / degMax) + dAmpMxD2;
                            }
                            dRnd = absRoundLimit(dAmp, dAmpMx, dRound);
                            sOut[oRS * j + nPlanes * i + k] = (unsigned short)dRnd;
                            dRnd = absRoundLimit(dPhz, dAmpMx, dRound);
                            sOut[oRS * j + nPlanes * (i + xSize) + k] = (unsigned short)dRnd;
                        }
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
                dLG = log10(dAmpMx * xSize_X_ySize_X_zSize) / dAmpMx;
                for(k = 0; k < zSize; k++)
                {
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dRe = (double)sIn[iRS * j + nPlanes * i + k];
                            if(dRe > 0.0)
                            {
                                dIm = (double)sIn[iRS * j + nPlanes * (i + xSize) + k];
                                
                                dAmp = (double)pow(10, dRe * dLG);
                                dPhz = (dIm - dAmpMxD2) / (Rad2Deg * (dAmpMx / degMax));
                            }
                            c_re(complex_in[i + j * xSize + k * ySize * xSize]) = (float)(dAmp * cos(dPhz));
                            c_im(complex_in[i + j * xSize + k * ySize * xSize]) = (float)(dAmp * sin(dPhz));
                        }
                    }
                }
                //****************************************************
                // 16 bit Inverse    compute inverse transform
                //****************************************************
                p = fftw_plan_dft_3d(zSize, ySize, xSize, complex_in, complex_ou, FFTW_BACKWARD, FFTW_ESTIMATE);
                fftw_execute(p);
                fftw_destroy_plan(p);
                //****************************************************
                // 16 bit Inverse    compute illumination from spectra
                //****************************************************
                for(k = 0; k < zSize; k++)
                {
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dRe = (double)c_re(complex_ou[i + j * xSize + k * ySize * xSize]) / xSize_X_ySize_X_zSize;
                            dRnd = absRoundLimit(dRe, dAmpMx, dRound);
                            sOut[oRS * j + nPlanes * i + k] = (unsigned short)dRnd;
                            
                            dRnd = absRoundLimit(dPhz, dAmpMx, dRound);
                            sOut[oRS * j + nPlanes * (i + xSize) + k] = (unsigned char)dRnd;
                        }
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
                dLG = log10(dAmpMx * xSize_X_ySize_X_zSize) / dAmpMx;
                for(k = 0; k < zSize; k++)
                {
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dSum = (double)fIn[iRF * j + nPlanes * i + k];
                            if(((i + j) % 2) == 1) dSum = -dSum;
                            //if(((i + k) % 2) == 1) dSum = -dSum;
                            //if(((k + j) % 2) == 1) dSum = -dSum;
                            c_re(complex_in[i + j * xSize + k * ySize * xSize]) = (double)dSum;    //    i + j * xSize + k * ySize * xSize
                            c_im(complex_in[i + j * xSize + k * ySize * xSize]) = (double)0.0;
                        }
                    }
                }
                //****************************************************
                // 32 bit Forward     compute forward transform
                //****************************************************
                p = fftw_plan_dft_3d(zSize, ySize, xSize, complex_in, complex_ou, FFTW_FORWARD, FFTW_ESTIMATE);
                fftw_execute(p);
                fftw_destroy_plan(p);
                //****************************************************
                // 32 bit Forward    compute spectra
                //****************************************************
                // range of numbers is - to + dAmpMx
                // Photoshop only likes 0 and positive numbers
                //  cIn, sIn, fIn, cOut, sOut, and fOut arrays
                for(k = 0; k < zSize; k++)
                {
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dAmp = 0.0;
                            dPhz = 0.0;
                            
                            dRe = (double)c_re(complex_ou[i + j * xSize + k * ySize * xSize]);
                            dIm = (double)c_im(complex_ou[i + j * xSize + k * ySize * xSize]);
                            dAmp = (double)sqrt(dRe * dRe + dIm * dIm);
                            if(dAmp > 0.0)
                            {
                                dAmp = (double)log10(dAmp) / dLG;
                                dPhz = (double)atan2(dIm, dRe) * Rad2Deg * (dAmpMx / degMax) + dAmpMxD2;
                            }
                            fOut[oRF * j + nPlanes * i + k] = (float)dabs(dAmp);
                            fOut[oRF * j + nPlanes * (i + xSize) + k] = (float)dabs(dPhz);
                        }
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
                dLG = log10(dAmpMx * xSize_X_ySize_X_zSize) / dAmpMx;
                for(k = 0; k < zSize; k++)
                {
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dAmp = 0.0;
                            dPhz = 0.0;
                            dRe = (double)fIn[iRF * j + nPlanes * i + k];
                            if(dRe > 0.0)
                            {
                                dIm = (double)fIn[iRF * j + nPlanes * (i + xSize) + k];
                                
                                dAmp = (double)pow(10, dRe * dLG);
                                dPhz = (dIm - dAmpMxD2) / (Rad2Deg * (dAmpMx / degMax));
                            }
                            c_re(complex_in[i + j * xSize + k * ySize * xSize]) = (float)(dAmp * cos(dPhz));
                            c_im(complex_in[i + j * xSize + k * ySize * xSize]) = (float)(dAmp * sin(dPhz));
                        }
                    }
                }
                //****************************************************
                // 32 bit Inverse    compute inverse transform
                //****************************************************
                p = fftw_plan_dft_3d(zSize, ySize, xSize, complex_in, complex_ou, FFTW_BACKWARD, FFTW_ESTIMATE);
                fftw_execute(p);
                fftw_destroy_plan(p);
                //****************************************************
                // 32 bit Inverse     compute spectra
                //****************************************************
                for(k = 0; k < zSize; k++)
                {
                    for(j = 0; j < ySize; j++)
                    {
                        for(i = 0; i < xSize; i++)
                        {
                            dRe = (double)c_re(complex_ou[i + j * xSize + k * ySize * xSize]) / xSize_X_ySize_X_zSize;
                            fOut[oRF * j + nPlanes * i + k] = (float)dabs(dRe);
                            fOut[oRF * j + nPlanes * (i + xSize) + k] = (float)0.0;
                        }
                    }
                }
            }
        }
        //********************************************************************************************************
        // Clean up for errors or good run
        //********************************************************************************************************
    ERROR_Ft3DF_iFt3DF:
        if(ErrorCode != 0)
        {
#ifdef _WIN32
            sprintf_s(zString, "Ft3DF_iFt3DF Error: Code %d", ErrorCode);
            MultiByteToWideChar(CP_ACP, 0, zString, -1, wString, u_zLen);
            MultiByteToWideChar(CP_ACP, 0, "Ft3DF_iFt3DF Error", -1, vString, u_zLen);
            iERR = MessageBox(NULL, wString, vString, MB_OKCANCEL | MB_APPLMODAL | MB_SYSTEMMODAL);
#elifdef __APPLE__
            // iERR = MessageBox(NULL, zString, "Ft3DF_iFt3DF Error", MB_OKCANCEL | MB_APPLMODAL | MB_SYSTEMMODAL);
#endif
        }
        fftw_free(complex_in);
        fftw_free(complex_ou);
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

