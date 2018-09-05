I was given the FFT software (including the source code) a little while ago, and it worked well.  BUT, it was not set up
to run on 64 bit Photoshop, nor to process 16 bit images.  Since I use both of those things,
I decided to add those features.

In the process I found that the library that actually does the maths has been updated,
and that it is available now in dll form.  This version of the FFT software uses those dlls.

To install:

*******************
For 32 bit Photoshop:

from the \bin\x86 folder:

copy FFT_RGB.8bf and IFFT_RGB.8bf to the 32 bit plugin folder.
copy libfftw3-3.dll to the photoshop folder OR the windows system folder.

You will probably already have the msvc*.dll files already installed.
Try the filter, and if it does not run, copy the enclosed files to the system folder.

**********************
For 64 bit photoshop:

from the \bin\x64 folder:

copy FFT_RGB.8bf and IFFT_8bf to the 64 bit plugin folder.
copy libfftwx64_3-3.dll to the 64 bit photoshop folder, OR the windows system folder.


You will probably already have the msvc*.dll files already installed.
Try the filter, and if it does not run, copy the enclosed files to the system folder.

*******************

Note:  You can just create shortcuts in the photoshop plugin folder, putting the actual plugin files wherever you like.

Phil Thornton
25th April 2011
