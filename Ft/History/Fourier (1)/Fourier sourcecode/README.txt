Adobe FFT/iFFT plugin

8 April 2005

Setup instructions:

1. Extract files from archive.
2.  Copy  files  *.8bf  from  bin  folder  to "Plugins" folder such as
“C:\...\Paint Shop\Plugins”.
3. Restart Adobe Photoshop or Jacs PaintShop.
4. Installed plugins FFT, FFT simple and iFFT should appear in plugins
list under the category "Fourier Transform".


How to use instructions:

1. Open an image or create a new one.
2.  Select “Fourier Transform ->FFT”, from menu. This will produce FFT
image  where complex phase information is stored in hue channel, while
complex amplitude is stored in lightness channel.
3. Split channel to HSL (or HSV) in order to access and edit different
channels separately.
4. Combine channels together before computing inverse FFT.
5. Select “Fourier Transform ->iFFT” from the menu.



Preprocessing of Images 

Before  processing computing FFT of image, channel information in each
pixel  is  averaged,  thus  FFT  is  computed  of  ImageData         =
(Red+Green+Blue)/3.

FFT  of  the 8bit greyscale images can be computed be increasing image
color depth to 24bit.

The  difference  between  "FFT"  and "FFT Simple" is that later filter
does  not  store  phase  information  in hue channel so reverse FFT is
impossible.



Acknowledgments:

I  would like to acknowledge Maciej Bartkowiak for the idea to use hue
to  represent  the  phase  (which  is  great  because  it's  naturally
circular).

Maciej Bartkowiak, PhD
Institute of Electronics and Telecommunications, Poznan University of Technology
e-mail: mbartkow@et.put.poznan.pl

FFTW  is  a  C  subroutine  library for computing the discrete Fourier
transform  (DFT)  in  one or more dimensions, of arbitrary input size,
and  of  both real and complex data (as well as of even/odd data, i.e.
the discrete cosine/sine transforms or DCT/DST).

  
Thank you, 
Alex Chirokov
chirokov@drexel.edu
 
