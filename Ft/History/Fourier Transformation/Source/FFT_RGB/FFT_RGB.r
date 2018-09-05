#define vendorName			"Fourier Transform"
#define plugInName			"FFT RGB"
#define ResourceID				16000 

resource 'PiPL' (16000, plugInName " PiPL", purgeable)
	{
		{
		Kind { Filter },
		Name { plugInName "..." },
		Category { vendorName },
		Version { (4 << 16) | 1 },

		#ifdef __PIMac__
			#if (defined(__i386__))
				CodeMacIntel32 { "ENTRYPOINT" },
			#endif
			#if (defined(__ppc__))
				CodeMachOPowerPC { 0, 0, "ENTRYPOINT" },
			#endif
		#else
		    #if defined(_WIN64)
				CodeWin64X86 { "ENTRYPOINT" },
			#else
				CodeWin32X86 { "ENTRYPOINT" },
			#endif
		#endif
		SupportedModes
		{
			noBitmap, noSupportGrayScale,
			noIndexedColor, doesSupportRGBColor,
			noSupportCMYKColor, noSupportHSLColor,
			noSupportHSBColor, doesSupportMultichannel,
			noSupportDuotone, noSupportLABColor
		},
			
		EnableInfo { "in (PSHOP_ImageMode, RGBMode, RGB48Mode)" },
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

