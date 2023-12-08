//-------------------------------------------------------------------------------
//    Definitions -- Required by include files.
//-------------------------------------------------------------------------------

// The About box and resources are created in PIUtilities.r.
// You can easily override them, if you like.

#define plugInName            "Ft1DH."
#define plugInCopyrightYear    "2018"
#define    plugInDescription \
"An FFT plug-in for Adobe Photoshop®."

//-------------------------------------------------------------------------------
//    Definitions -- Required by other resources in this rez file.
//-------------------------------------------------------------------------------

// Dictionary (aete) resources:

#define vendorName            "RONC 2018"
#define plugInAETEComment     "Ft1DH plug-in"

#define plugInSuiteID        'sdK1'
#define plugInClassID        plugInSuiteID
#define plugInEventID        plugInClassID

//-------------------------------------------------------------------------------
//    Set up included files for Macintosh and Windows.
//-------------------------------------------------------------------------------

#include "PIDefines.h"

#ifdef __PIMac__
#include "PIGeneral.r"
#include "PIUtilities.r"
#elif defined(__PIWin__)
#define Rez
#include "PIGeneral.h"
#include "PIUtilities.r"
#endif

#include "PITerminology.h"
#include "PIActions.h"

#include "Ft1DHTerminology.h"    // Terminology for this plug-in.

//-------------------------------------------------------------------------------
//    PiPL resource
//-------------------------------------------------------------------------------

resource 'PiPL' (ResourceID, plugInName " PiPL", purgeable)
{
    {
        Kind { Filter },
        Name { plugInName "..." },
        Category { vendorName },
        Version { (latestFilterVersion << 16) | latestFilterSubVersion },
        
        Component { ComponentNumber, plugInName },
        
        #ifdef __PIMac__
        CodeMacARM64 { "PluginMain" },
        CodeMacIntel64 { "PluginMain" },
        #else
        #if defined(_WIN64)
        CodeWin64X86 { "PluginMain" },
        #else
        CodeWin32X86 { "PluginMain" },
        #endif
        #endif
        
        HasTerminology
        {
            plugInClassID,                    // Class ID
            plugInEventID,                    // Event ID
            ResourceID,                        // AETE ID
            // Unique string or empty for AppleScript compliant:
            "98b5a608-46ce-11d3-bd6b-0060b0a13dc4"
        },
        
        SupportedModes
        {
            noBitmap, noGrayScale,
            noIndexedColor, doesSupportRGBColor,
            noCMYKColor, noHSLColor,
            noHSBColor, noMultichannel,
            noDuotone, noLABColor
        },
        
        EnableInfo { "in (PSHOP_ImageMode, RGBMode, RGB48Mode, RGB96Mode)" },
        
        WantsScrap { },
        
        // PlugInMaxSize { 2000000, 2000000 },
        
        FilterCaseInfo
        {
            {
                /* Flat data, no selection */
                inWhiteMat, outWhiteMat,
                doNotWriteOutsideSelection,
                filtersLayerMasks, worksWithBlankData,
                doNotCopySourceToDestination,
                
                /* Flat data with selection */
                inWhiteMat, outWhiteMat,
                writeOutsideSelection,
                filtersLayerMasks, worksWithBlankData,
                doNotCopySourceToDestination,
                
                /* Floating selection */
                inWhiteMat, outWhiteMat,
                writeOutsideSelection,
                filtersLayerMasks, worksWithBlankData,
                doNotCopySourceToDestination,
                
                /* Editable transparency, no selection */
                inWhiteMat, outWhiteMat,
                doNotWriteOutsideSelection,
                filtersLayerMasks, worksWithBlankData,
                doNotCopySourceToDestination,
                
                /* Editable transparency, with selection */
                inWhiteMat, outWhiteMat,
                writeOutsideSelection,
                filtersLayerMasks, worksWithBlankData,
                doNotCopySourceToDestination,
                
                /* Preserved transparency, no selection */
                inWhiteMat, outWhiteMat,
                doNotWriteOutsideSelection,
                filtersLayerMasks, worksWithBlankData,
                doNotCopySourceToDestination,
                
                /* Preserved transparency, with selection */
                inWhiteMat, outWhiteMat,
                writeOutsideSelection,
                filtersLayerMasks, worksWithBlankData,
                doNotCopySourceToDestination
            }
        }
    }
};



//-------------------------------------------------------------------------------
//    PiMI resource (Photoshop 2.5 and other older hosts)
//-------------------------------------------------------------------------------

resource 'PiMI' (ResourceID, plugInName " PiMI", purgeable)
{
    latestFilterVersion,
    latestFilterSubVersion,
    0,
    supportsGrayScale +
    supportsRGBColor +
    supportsCMYKColor +
    supportsHSLColor +
    supportsHSBColor +
    supportsMultichannel +
    supportsDuotone +
    supportsLABColor,
    '    ', /* No required host */
    {},
};

//-------------------------------------------------------------------------------
//    Dictionary (scripting) resource
//-------------------------------------------------------------------------------

resource 'aete' (ResourceID, plugInName " dictionary", purgeable)
{
    1, 0, english, roman,                                    /* aete version and language specifiers */
    {
        vendorName,                                            /* vendor suite name */
        "Adobe example plug-ins",                            /* optional description */
        plugInSuiteID,                                        /* suite ID */
        1,                                                    /* suite code, must be 1 */
        1,                                                    /* suite level, must be 1 */
        {                                                    /* structure for filters */
            plugInName,                                        /* unique filter name */
            plugInAETEComment,                                /* optional description */
            plugInClassID,                                    /* class ID, must be unique or Suite ID */
            plugInEventID,                                    /* event ID, must be unique to class ID */
            
            NO_REPLY,                                        /* never a reply */
            IMAGE_DIRECT_PARAMETER,                            /* direct parameter, used by Photoshop */
            {                                                /* parameters here, if any */
                "Horizontal",                                /* parameter name */
                keyHorizontal,                                /* parameter key ID */
                typeInteger,                                /* parameter type ID */
                "horizontal position",                        /* optional description */
                flagsSingleParameter,                        /* parameter flags */
                
                "Vertical",                                    // second parameter
                keyVertical,                                // parameter key ID
                typeInteger,                                // parameter type ID
                "vertical position",                        // optional description
                flagsSingleParameter,                        // parameter flags
                
                "Size",                                        // third parameter
                keyXFactor,                                    // parameter key ID
                typeInteger,                                // parameter type ID
                "font size",                                // optional description
                flagsSingleParameter,                        // parameter flags
                
                "Gaussian Blur",                        // fourth parameter
                keyGaussianBlurData,                        // key ID
                typeBoolean,                                // type
                "Gaussian Blur",                            // optional desc
                flagsSingleParameter                        // parameter flags
                
            }
        },
        {                                                    /* non-filter plug-in class here */
        },
        {                                                    /* comparison ops (not supported) */
        },
        {                                                    /* any enumerations */
        }
    }
};


//-------------------------------------------------------------------------------
//    FltD -- Animation resource for use in Premiere
//-------------------------------------------------------------------------------

resource 'FltD' (ResourceID, plugInName " Premiere FltD", purgeable)
{
    {
        pdShort, 0,        // Interpolate the dissolve amount
    };
};
