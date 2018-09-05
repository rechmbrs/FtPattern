
#ifndef	__FPRECORD__
#define	__FPRECORD__

typedef struct Point
   {
	  short v;
	  short h;
   } Point;

typedef struct Rect
   {
	  short top;
	  short left;
	  short bottom;
	  short right;
   } Rect;

void SetRectMy(Rect *rect,short top,short left,short right,short bottom)
{
	rect->top=top;
	rect->left=left;
	rect->right=right;
	rect->bottom=bottom;
}

typedef BYTE (*TestAbortProc) ();						  // проверка не нажата ли ESC
typedef void (*ProgressProc) (long done, long total);	  // индикатор прогрессии

typedef struct PlatformData 
{
	long hwnd;
} PlatformData;


#pragma pack(push,4)				// Выравниваем четвёрками

typedef struct FilterRecord 		// Указатель на эту структуру передается при вызове 
									// функции ENTRYPOINT  в качестве одного из параметров
{

	long		serialNumber;		/* Host's serial number, to allow
									   copy protected plug-in modules. */

	TestAbortProc	abortProc;		/* The plug-in module may call this no-argument
									   BYTE function (using Pascal calling
									   conventions) several times a second during long
									   operations to allow the user to abort the operation.
									   If it returns TRUE, the operation should be aborted
									   (and a positive error code returned). */

	ProgressProc	progressProc;	/* The plug-in module may call this two-argument
									   procedure periodically to update a progress
									   indicator.  The first parameter is the number
									   of operations completed; the second is the total
									   number of operations. */

	void		*parameters; 		/* A handle, initialized to NIL by Photoshop.
									   This should be used to hold the filter's
									   current parameters. */

	Point		imageSize;			/* Size of image */
	short		planes; 			/* Samples per pixel */
	Rect		filterRect; 		/* Rectangle to filter */

	short		background[3]; 		/* Current background color */
	short		foreground[3]; 		/* Current foreground color */
	long		maxSpace;			/* Maximum possible total of data and buffer space */

	long		bufferSpace;		/* If the plug-in filter needs to allocate
									   large internal buffers, the filterSelectorPrepare
									   routine should set this field to the number
									   of bytes the filterSelectorStart routine is
									   planning to allocate.  Relocatable blocks should
									   be used if possible. */

	Rect		inRect; 			/* Requested input rectangle. Must be a subset of
									   the image's bounding rectangle. */
	short		inLoPlane;			/* First requested input plane */
	short		inHiPlane;			/* Last requested input plane */

	Rect		outRect;			/* Requested output rectangle. Must be a subset of
									   filterRect. */
	short		outLoPlane; 		/* First requested output plane */
	short		outHiPlane; 		/* Last requested output plane */

	BYTE *		inData; 			/* Pointer to input rectangle. If more than one
									   plane was requested, the data is interleaved. */
	long		inRowBytes; 		/* Offset between input rows */
	BYTE *		outData;			/* Pointer to output rectangle. If more than one
									   plane was requested, the data is interleaved. */
	long		outRowBytes;		/* Offset between output rows */

	BYTE 		isFloating; 		/* Set to true if the selection is floating */
	BYTE 		haveMask;			/* Set to true if there is a selection mask */
	BYTE 		autoMask;			/* If there is a mask, and the selection is not
									   floating, the plug-in can change this field to
									   false to turn off auto-masking. */

	Rect		maskRect;			/* Requested mask rectangle.  Must be a subset of
									   filterRect. Should only be used if haveMask is
									   true. */

	BYTE *		maskData;			/* Pointer to (read only) mask data. */
	long		maskRowBytes;		/* Offset between mask rows */

	unsigned long backColor;		/* Background color in native color space */
	unsigned long foreColor;		/* Foreground color in native color space */

	long		hostSig;			/* Creator code for host application */
	void		*hostProc;			/* Host specific callback procedure */

	short		imageMode;			/* Image mode */

	long		imageHRes;			/* Pixels per inch */
	long		imageVRes;			/* Pixels per inch */

	Point		floatCoord; 		/* Top left coordinate of selection */
	Point		wholeSize;			/* Size of image selection is floating over */

	long		monitor[10];		/* Information on current monitor */

	void 		*platformData;		/* Platform specific information. */
//	ResourceProcs * resourceProcs;
	
	}
	FilterRecord;					// Полную версию этой структуры смотри в оригинальной документации

#pragma pack(pop)

#endif