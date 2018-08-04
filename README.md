# Pattern Suppressor
Fourier Transformation plugins and actions for Adobe Photoshop.

_By Jonas M. Rogne (Chain), Ronald Chambers (Ronc) and Francesco Pierfederici._


## What is this? 
This is a set of plugins and actions for Adobe Photoshop that will let you easily remove regular repeating patterns from images that cannot conveniently be removed by traditional means.


## Files included
* libfftwx64_3-3.dll – FFTW library. Required by the Windows plugins.
* Ft2DS.8bf – Windows plugin for doing a Fourier transformation (channels averaged).
* Ft2DH.8bf – Windows plugin for doing a Fourier transformation (per channel).
* Ft3DH.8bf – Windows plugin for doing a Fourier transformation (in 3D space).
* iFt2DS.8bf – Windows plugin for doing the inverse of Ft2DS.
* iFt2DH.8bf – Windows plugin for doing the inverse of Ft2DH.
* iFt3DH.8bf – Windows plugin for doing the inverse of Ft3DH.
* Ft2DS.plugin – Mac plugin for doing a Fourier transformation (channels averaged).
* Ft2DH.plugin – Mac plugin for doing a Fourier transformation (per channel).
* Ft3DH.plugin – Mac plugin for doing a Fourier transformation (in 3D space).
* iFt2DS.plugin – Mac plugin for doing the inverse of Ft2DS.
* iFt2DH.plugin – Mac plugin for doing the inverse of Ft2DH.
* iFt3DH.plugin – Mac plugin for doing the inverse of Ft3DH.
* Pattern Suppressor v2.atn – Photoshop Actions for doing pattern suppression.
* README.md – This file.


## Requirements and compatibility
* Requires Adobe Photoshop (64-bit) for Windows or macOS.
* Tested with CS6–CC 2018 on Windows 10 and CC 2015–18 on macOS 10.12–10.13
But will likely work on more versions.
* Requires basic knowledge of how to use the Brush Tool, Layers and the Actions Panel.


## New in v2.5
   * Added Mac-compatible plugins. Thanks to Francesco Pierfederici. 
Please contact us if you experience any issues with the new files.
   * The pattern suppressor is now also available on Adobe Exchange.
   * Video tutorial not updated with new installation instructions yet (will be in v3).


## New in v2
 * Major update of actions and new plugins.
 * Now has actions/plugins for processing color images.
 * Improved method for generating the suppression layer. It is more accurate, and subtracts the central “glow” to give much better results close to the central star.


## Installation (Windows)
 1. Copy libfftwx64_3-3.dll to your Photoshop installation folder. By default this is 
C:\Program Files\Adobe\Adobe Photoshop [version]\
 2. Copy the 8bf-files to the Photoshop Plug-ins-folder. By default this is
C:\Program Files\Adobe\Adobe Photoshop [version]\Plug-ins\
 3. Restart Photoshop if it was running.
 4. Double-click Pattern Suppressor v2.atn to install the actions.
(You can also choose “Load Actions…” in your Actions Panel Menu).

The action set will be shown in your Actions Panel (can be found under Window > Actions).
The Plug-ins will be available under Filter > RONC 2018 if you want to run them manually.


## Installation (Mac)
 1. Copy the plugin-files to the Photoshop Plug-ins-folder. By default this is
/Applications/Adobe Photoshop [version]/Plug-Ins
 2. Restart Photoshop if it was running.
 3. Double-click Pattern Suppressor v2.atn to install the actions.
(You can also choose “Load Actions…” in your Actions Panel Menu).

The action set will be shown in your Actions Panel (can be found under Window > Actions).
The Plug-ins will be available under Filter > RONC 2018 if you want to run them manually.


## How to use

Please see the included [documentation](http://htmlpreview.github.com/?https://github.com/rechmbrs/FtPattern/blob/master/Ft/doc/index.html) for a tutorial on how to use the plugins and actions.


## How to build

The plugins are known to compile on macOS (using Xcode 9.x) and Windows (using Visual Studio Community Edition 2017). Either way, you will need 

 1. The [Adobe Photoshop® SDK](https://www.adobe.com/devnet/photoshop/sdk/eula.html) for your OS.
 2. [FFTW](http://www.fftw.org) 3.3.x. For convenience macOS and Windows FFTW pre-built libraries are included in this repository (see the Ft_lib directory).

### Windows
 
Extract the Adobe Photoshop® SDK to the root of your C drive. Clone this repository wherever you like and then open each one of the Visual Studio project files and build each plugin.
 
 
### macOS

For macOS, extract the Adobe Photoshop® SDK wherever you like, navigate to ```pluginsdk/samplecode/filter``` and clone this repository there. Open each XCode project file and build the plugins one by one.


## License

Please see the [LICENSE](LICENSE) text file included in this repository for copyright and license information.
