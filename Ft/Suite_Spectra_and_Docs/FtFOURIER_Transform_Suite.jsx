#script FtFOURIERTransformSuite.jsx
#target PHOTOSHOP
app.bringToFront();

/*
<javascriptresource>
<name>FtFOURIER</name>
<about>Ft_FOURIER_Transform/Utility_Suite</about>
<menu>Filter</menu>
<category>RONC 2018</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/
//
// FtFOURIERTransformSuite.jsx
//

var doc = app.activeDocument;
rulerUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;

var scriptName = "Ft_FOURIER_Transform/Utility_Suite for_Photoshop_by_RONC©2018";
var scriptVerNum = "1.09.11";
var scriptVerNumHelp = "v1";
var scriptVerDate = "29Jun2018";
var scriptVersion = scriptVerNum + " - " + scriptVerDate;
var scriptAuthor = ""; //"Ron Chambers";
var scriptAbstract =
    "Ft_FOURIER_Transform_Suite - See Abstract and Copyright information in the HELP file:  ";

//*************************************************************************************

//@include '../__REC-Lib/REC-copyright_lib.js'
//@include '../__REC-Lib/REC-global_lib.js'

// Script Expiration
var yx = "2050";
var mx = "01";
var dx = "01";
//@include '../__REC-Lib/REC-expire_lib.js'

// @include '../__REC-Lib/REC-loadSymbols.js'

var hideLayerHistory = true;
if (hideLayerHistory == true)
{
	// @include '../__REC-Lib/REC-layers_lib.js'
    // @include '../__REC-Lib/REC-hasBackgroundLayerAM.jsxinc'// Find if background layer
    hideLayerPalette = true;
    hideHistoryPalette = true;
    if (hideLayerPalette == true) hideLayers();
}

var imageWidth = doc.width;
var imageHeight = doc.height;
var imageWidth = Math.round(doc.width.value);
var imageHeight = Math.round(doc.height.value);

var FtTypes = [" SELECT (here)", " Ft     FORWARD", "-   1D Half ", "          Half Analysis ",
    "-   2D Single", "          Half  ", "          Half Analysis ", "          Full ", "-   3D Half ", "          Half Analysis ", "          Full    ",
    "-",
    " iFt    INVERSE ", "-   1D Half ", "-   2D Single", "          Half ", "          Full",
    "-   3D Half ", "          Full     ",
    "-",
    " Ft     UTILITIES", "      PadImage", "      ConcatenateLayers ", " "];
//  "-",
//   " Ft     COMPLEX MATH", "      Cadd    ", "      Csub", "      Cmul   ", "      Cdiv        ", "      Cmag        ",
//   "      Cnjm       ", "      Cnj1       ", "      Cnj2        "];//, "      Czr1        ", "      Czr2       ", "                      "];
// 		char cString[10][5] = {"Cadd", "Csub", "Cmul", "Cdiv","Cmag", "Cnjm", "Cnj1", "Cnj2", "Czr1", "Czr2"};
var FtFilTypes = ["Ft1DH....", "Ft2DS....", "Ft2DH....", "Ft2DF....", "Ft3DH....", "Ft3DF....", "iFt1DH...", "iFt2DS...", "iFt2DH...", "iFt2DF...", "iFt3DH...", "iFt3DF..."];
var FtMap = [-2, -1, 0, 100, 1, 2, 101, 3, 4, 102, 5, -1, -1, 6, 7, 8, 9, 10, 11, -1, -1, 103, 104]; //, -1, -1, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515]; // -2 header, -1  blank, 0->n filter
var FtDir = [1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1]; //1 forward , -1 inverse
var FtWid = [0, 2, 0, 1, 0, 1, 0, 2, 0, 1, 0, 1]; // 0 half, 1 full, 2 single
var uiFtTypeIn;
var uiFtType = -1;
var uiFtTypeMap = -1;
var uiFtTypeText = "";
var mathFn = "/cmath.ini";
var mathType;
var uiFtPad = 0;
var uiFtDirection = 1;
var uiFtWidth = 0;
var SCRIPTS_FOLDER = "";
var SCRIPTS_FILE = "";
var uiScriptTypes = ["Ft1DAnalysis.jsxbin", "Ft2DAnalysis.jsxbin", "Ft3DAnalysis.jsxbin", "PadImage.jsxbin", "ConcatenateLayers.jsxbin"];
var uiHelp = "FtFOURIER_Transform_Suite-HELP" + scriptVerNumHelp + ".pdf";

var dlg = new Window("dialog");
dlgTxt = dlg.add("statictext", undefined, scriptName + cc10 + "Version:  " +
    scriptVersion,
    {
        multiline: true
    });
dlgTxt.justify = "center";
dlgTxt.graphics.font = "Arial-BoldItalic: 18";
dlg.alignment = "center";

dlg.openPnl = dlg.add("panel", undefined, scriptAuthor);
var bga = dlg.openPnl.add("group");
bga.orientation = "column";
bga.alignment = "center";
txt1 = bga.add("statictext", undefined, scriptAbstract + cc10 + uiHelp,
{
    multiline: true
});
txt1.justify = "center";
txt1.graphics.font = "Arial-Bold: 14";
txt1.preferredSize[0] = 600;
txt1.preferredSize[1] = 32;
txt1a = bga.add("panel", [0, 0, 600, 0]);

var bgb = dlg.openPnl.add("group");
bgb.orientation = "row";
bgb.alignment = "center";

var dP = bgb.add("group");
title2 = dP.add("statictext", undefined, "FOURIER Transform type: ");
title2.alignment = "left";
ddP = dP.add("dropdownlist", undefined, FtTypes);
ddP.alignment = "left";
ddP.helpTip = "FOURIER Transform type";
ddP.selection = 0;
//uiFtTypeIn = ddP.selection.text;
//alert(  "dP " + uiFtTypeIn );

var bg = dlg.openPnl.add("group");
bg.orientation = "row";
bg.alignment = "center";
bg1 = bg.add("button", undefined, "OK");
bg1.helpTip = "OK - start execution";
bg1.onClick = dobuild;
bg2 = bg.add("button", undefined, "Cancel");
bg2.helpTip = "Cancel - abort execution";
bg2.onClick = doabort;
bg3 = bg.add("button", undefined, "Help");
bg3.helpTip = "Help - have question?";
bg3.onClick = dohelp;

var bgb = dlg.openPnl.add("group");
bgb.orientation = "column";
bgb.alignment = "center";
txt2 = bgb.add("statictext", undefined,
    "( The ESC key cancels execution of the script while running in Photoshop. )"
);
var txt2g = txt2.graphics;
txt2g.font = ScriptUI.newFont("Arial", "BOLD", 12);
txt2g.foregroundColor = txt2g.newPen(txt2g.PenType.SOLID_COLOR, [1.00, 1.00,
    0.00, 1
], lineWidth = 2);

dlg.show();

function dobuild()
{
    uiFtType = parseInt(ddP.selection, 10);
    if (uiFtType < 0)
    {}
    uiFtTypeMap = FtMap[uiFtType];
    uiFtTypeText = ddP.selection.text;
    //****************************************************
    // Plugins
    //****************************************************
    if (uiFtTypeMap >= 0 && uiFtTypeMap <= 99)
    {
        uiFtTypeIn = FtFilTypes[uiFtTypeMap];
        uiFtDirection = FtDir[uiFtTypeMap];
        uiFtWidth = FtWid[uiFtTypeMap];
        uiFtPad = imageWidth;

        if (uiFtDirection == 1)
        {
            if (uiFtWidth === 0) uiFtPad = imageWidth + 2; // Half width
            if (uiFtWidth == 1) uiFtPad = imageWidth * 2; // Full width
            if (uiFtWidth == 2) uiFtPad = imageWidth; // Single width
        }
        if (uiFtDirection == -1)
        {
            if (uiFtWidth === 0) uiFtPad = imageWidth - 2; // Half width
            if (uiFtWidth == 1) uiFtPad = imageWidth / 2; // Full width
            if (uiFtWidth == 2) uiFtPad = imageWidth; // Single width
        }
        // alert("1a " + uiFtType + " " + uiFtTypeMap + "   " + uiFtTypeIn + " " + uiFtDirection + " " + uiFtWidth + " " + uiFtPad);
    }
    //****************************************************
    // Scripts
    //****************************************************
    if (uiFtTypeMap >= 100 && uiFtTypeMap <= 499)
    {
        //       SCRIPTS_FOLDER = '"' + decodeURIComponent(app.path + localize("/" + "Presets/Scripts/") );//+ "runscript.jsx") + '"'; // "Ft1DAnalysis.jsxbin") + '"';
        //alert("1b " + uiFtType + " " + uiFtTypeMap + "   " + app.path + " " + SCRIPTS_FILE + "  " + SCRIPTS_FOLDER);
        var scriptMap = uiFtTypeMap - 100;
        SCRIPTS_FILE = uiScriptTypes[scriptMap];
        //alert("1bb " + uiFtType + " " + uiFtTypeMap + "   " + SCRIPTS_FILE + "  " + SCRIPTS_FOLDER);
    }
    /*
        //****************************************************
        // Plugin with file setup
        //****************************************************
        if (uiFtTypeMap >= 500)
        {
            mathType = uiFtTypeMap - 500;
            var a = new File(Folder.temp + mathFn);
            a.open('w');
            // a.writeln("Cmath  ");
            a.writeln("Cmath  " + mathType + "  " + uiFtTypeText);
            a.close();
            var diag500 = 0;
            if (diag500 == 1)
            {
                var b = new File(Folder.temp + mathFn);
                b.open('r');
                var str = Folder.temp + mathFn + "\n";
                while (!b.eof)
                    str += b.readln();
                b.close();
                alert(str); //   ~/AppData/Local/Temp/cmath.ini  |Cmath  2        Cmul
            }
        }
    */
    dlg.close();
}

function doabort()
{
    uiDone = 1;
    dlg.close();
    return;
}

function dohelp()
{
    openURL(uiHelp);
    return;
}

function openURL(url)
{
    $.filename = url;
    var path = File($.fileName).parent.fsName + "/" + $.filename;
    var pdf = File(path);
    //prompt("Help", pdf);
    if (pdf.exists)
    {
        pdf.execute();
    }
}
//
//==================== Ft FOURIER Transform Suite ==============
//
function FtFOURIERTransformSuite()
{
    if (uiFtTypeMap >= 0 && uiFtTypeMap <= 99)
    {
        // Set
        function step00(enabled, withDialog)
        {
            if (enabled != undefined && !enabled)
                return;
            var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
            var desc1 = new ActionDescriptor();
            var ref1 = new ActionReference();
            ref1.putProperty(PSClass.Layer, PSEnum.Background);
            desc1.putReference(PSKey.Target, ref1);
            var desc2 = new ActionDescriptor();
            desc2.putUnitDouble(PSKey.Opacity, PSUnit.Percent, 100);
            desc2.putEnumerated(PSKey.Mode, PSType.BlendMode, PSEnum.Normal);
            desc1.putObject(PSKey.To, PSClass.Layer, desc2);
            desc1.putInteger(PSKey.LayerID, 125);
            executeAction(PSEvent.Set, desc1, dialogMode);
        }
        // Canvas Size
        function step01(enabled, withDialog)
        {
            if (enabled !== undefined && !enabled)
                return;
            var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
            var desc1 = new ActionDescriptor();
            desc1.putUnitDouble(PSKey.Width, PSUnit.Pixels, uiFtPad);
            desc1.putEnumerated(PSKey.Horizontal, PSType.HorizontalLocation, PSEnum.Left);
            desc1.putEnumerated(PSString.canvasExtensionColorType, PSString.canvasExtensionColorType, PSEnum.Black);
            executeAction(sTID('canvasSize'), desc1, dialogMode);
        }

        // Filter
        function step02(enabled, withDialog)
        {
            if (enabled !== undefined && !enabled)
                return;
            var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
            var desc1 = new ActionDescriptor();
            desc1.putString(PSKey.Using, uiFtTypeIn);
            executeAction(PSEvent.Filter, desc1, dialogMode);
        }

        // Filter
        function step03(enabled, withDialog)
        {
            if (enabled !== undefined && !enabled)
                return;
            var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
            var desc1 = new ActionDescriptor();
            desc1.putString(PSKey.Using, uiFtTypeIn);
            executeAction(PSEvent.Filter, desc1, dialogMode);
        }

        // Canvas Size
        function step04(enabled, withDialog)
        {
            if (enabled !== undefined && !enabled)
                return;
            var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
            var desc1 = new ActionDescriptor();
            desc1.putUnitDouble(PSKey.Width, PSUnit.Pixels, uiFtPad);
            desc1.putEnumerated(PSKey.Horizontal, PSType.HorizontalLocation, PSEnum.Left);
            desc1.putEnumerated(PSString.canvasExtensionColorType, PSString.canvasExtensionColorType, PSEnum.Black);
            executeAction(sTID('canvasSize'), desc1, dialogMode);
        }

        // Filter
        function step05(enabled, withDialog)
        {
            if (enabled !== undefined && !enabled)
                return;
            var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
            var desc1 = new ActionDescriptor();
            desc1.putString(PSKey.Using, uiFtTypeIn);
            executeAction(PSEvent.Filter, desc1, dialogMode);
        }

        // Flatten Image
        function step06(enabled, withDialog)
        {
            if (enabled != undefined && !enabled)
                return;
            var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
            executeAction(sTID('flattenImage'), undefined, dialogMode);
        }

        if (uiFtWidth != 2)  // Not Single
        {
                if (uiFtDirection == 1) //Forward
                {
                    if(hasBackgroundLayerAM() !== true) step06(); // Set
                    step01(); // Canvas Size
                    step02(); // Filter
                }

                if (uiFtDirection == -1) //Inverse
                {
                    step03(); // Filter
                    step04(); // Canvas Size
                }
        }
        else
        {
            step02(); // Filter
        }
        step06(); // Flatten
    }
    //************************************************************************
    // UTILITIES
    //************************************************************************
    if (uiFtTypeMap >= 100 && uiFtTypeMap <= 499)
    {
        function step100()
        {
            var SCRIPTS_FOLDER = decodeURI(app.path + '/' + localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts/"));
            var Script1 = File(SCRIPTS_FOLDER + "/" + SCRIPTS_FILE);
            //alert("1c " + uiFtType + " " + uiFtTypeMap + "   " + uiFtTypeIn + " " + SCRIPTS_FILE + "  " + SCRIPTS_FOLDER + " " + Script1);
            $.evalFile(Script1);
        }
        step100();
    }
    /*
      //************************************************************************
      // COMPLEX MATH
      //************************************************************************
      if (uiFtTypeMap >= 500 && uiFtTypeMap <= 999)
      {
          // Filter
          function step500(enabled, withDialog)
          {
              if (enabled !== undefined && !enabled)
                  return;
              var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
              var desc1 = new ActionDescriptor();
              desc1.putString(PSKey.Using, "CMath....");
              executeAction(PSEvent.Filter, desc1, dialogMode);
          }

          step500(); // Filter
          alert("1d " + uiFtType + " " + uiFtTypeMap + "   " + uiFtTypeText + " " + mathType);
      }
      */
    /*
    //docRef = activeDocument;
    //rulerUnits = app.preferences.rulerUnits;
    //app.preferences.rulerUnits = Units.PIXELS;

    // If this is a landscape picture...
    if ( doc.height.value < doc.width.value ) {
        // EDIT HERE
        app.doAction("YOUR LANDSCAPE ACTION NAME", "YOUR ACTION SET");
    } else {
        // EDIT HERE
        app.doAction("YOUR PORTRAIT ACTION NAME", "YOUR ACTION SET");
    }
    */

    /*  script execute from plugin
    var id4 = stringIDToTypeID( "AdobeScriptAutomation Scripts" );
        var desc2 = new ActionDescriptor();
        var id5 = charIDToTypeID( "jsCt" );
        desc2.putPath( id5, new File( "C:\\Users\\tr\\JavaScripts\\HelloAlert.jsx" ) );
        var id6 = charIDToTypeID( "jsMs" );
        desc2.putString( id6, "hello" );
    var a = executeAction( id4, desc2, DialogModes.NO );


    Execute a script that's already in your Scripts folder, by simply using its name.

function executeScript(NameOfYourScript) {
var idAdobeScriptAutomationScripts = stringIDToTypeID( "AdobeScriptAutomation Scripts" );
var desc320 = new ActionDescriptor();
var idjsNm = charIDToTypeID( "jsNm" );
desc320.putString( idjsNm, NameOfYourScript );
var idjsMs = charIDToTypeID( "jsMs" );
desc320.putString( idjsMs, "0" );
executeAction( idAdobeScriptAutomationScripts, desc320, DialogModes.NO );
}

Or, execute a script from a path

function executeScript(PathToYourScript) {
var idAdobeScriptAutomationScripts = stringIDToTypeID( "AdobeScriptAutomation Scripts" );
var desc321 = new ActionDescriptor();
var idjsCt = charIDToTypeID( "jsCt" );
desc321.putPath( idjsCt, new File( PathToYourScript ) );
var idjsMs = charIDToTypeID( "jsMs" );
desc321.putString( idjsMs, "0" );
executeAction( idAdobeScriptAutomationScripts, desc321, DialogModes.NO );
    */
    /*
    var SCRIPTS_FOLDER =  decodeURI(app.path + '/' + localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts/"));
    var Script1 = File(SCRIPTS_FOLDER + "Script1.jsx");
    $.evalFile (Script1);
    */
}

//=========================================
//                    FtFOURIERTransformSuite.main
//=========================================
//
FtFOURIERTransformSuite.main = function ()
{
    FtFOURIERTransformSuite();
};

app.preferences.rulerUnits = rulerUnits;
if (hideLayerHistory == true)
{
    if (hideLayerPalette == true) hideLayers();
    if (hideHistoryPalette == true) app.activeDocument.suspendHistory(scriptName + ' Complete', 'FtFOURIERTransformSuite.main()');
}
else
{
    FtFOURIERTransformSuite.main();
}
//EOF