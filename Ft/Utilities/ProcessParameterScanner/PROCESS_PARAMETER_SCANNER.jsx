#script PROCESS_PARAMETER_SCANNER.jsx
#target photoshop
app.bringToFront();

/*
<javascriptresource>
<name>PROCESS_PARAMETER_SCANNER</name>
<about>PROCESS PARAMETER SCANNER</about>
<menu>filter</menu>
<category>ScriptsRONC</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

var scriptName = "PROCESS_PARAMETER_SCANNER_for_Photoshop_by_RONC ©2018";
var scriptVerNum = "1.05.09";
var scriptVerNumHelp = "v1";
var scriptVerDate = "28Jun2018";
var scriptVersion = scriptVerNum + " - " + scriptVerDate;
var scriptAuthor = ""; //"Ron Chambers";
var scriptAbstract =
    "PROCESS_PARAMETER_SCANNER - See Abstract and Copyright information in the HELP file:  ";

var doc = app.activeDocument;
rulerUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;

// Includes an external .js file
// @include '../__REC-Lib/REC-global_lib.js'

// Script Expiration
var yx = "2050";
var mx = "01";
var dx = "01";
// @include '../__REC-Lib/REC-expire_lib.js'

//
// Dialog
//
var uiProcess = 0;

var uiNumScans = 1;
var ns = 1;
var nss = 0;
var scanNum;
var uiMaxParms = 5;
var uiL;
var uiP = new Array();
var uiP_1 = new Array();
var uiP_N = new Array();
var uiP_Interp = new Array();
var uiM = new Array();
var dP = new Array();
var title = new Array();
var dP1 = new Array();
var dPN = new Array();
var dM = new Array();

var uiDone = 0;

var uiProcessList = ["GAUSSIAN BLUR - Radius>P1(S1-SN)M1",
  "HIGHPASS - Radius>P1(S1-SN)M1",
  "MEDIAN - Radius>P1(S1-SN)",
  "UNSHARP MASK - Radius>P1(S1-SN)M1, Percent>P2(S1-SN)M2, Threshold>P3(S1-SN)M3",
  "GAMMA/EXPOSURE - Gamma>P1(S1-SN)M1, Exposure>P2(S1-SN)M2, Offset>P3(S1-SN)M3"
];

var uiProcessParms = new Array(1, 1, 1, 3, 3);
//alert(uiProcessParms[0] + "\n " + uiProcessParms[1] + "\n " + uiProcessParms[2] + "\n " + uiProcessParms[3] + "\n " + uiProcessParms[4]);

for (uiL = 1; uiL <= uiMaxParms; uiL = uiL + 1)
{
    uiP[uiL] = 0.0;
    uiP_1[uiL] = 0.0;
    uiP_N[uiL] = 0.0;
    uiP_Interp[uiL] = 0.0;
    uiM[uiL] = 0.0;
}
var uiHelp = "PROCESS_PARAMETER_SCANNER-HELP" + scriptVerNumHelp + ".pdf";
var uiRecap = "";

var dlg = new Window("dialog");
dlg.alignment = "center";
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
txt2 = bga.add("panel", [0, 0, 600, 0]);

var cb = dlg.openPnl.add("group");
cb.orientation = "row";
cb.alignment = "center";

title1 = cb.add("statictext", undefined, "    PROCESS:");
title1.alignment = "center";
ddL = cb.add("dropdownlist", undefined, uiProcessList);
ddL.alignment = "center";
ddL.helpTip =
    "PROCESS options: GAUSSIAN BLUR, HIGHPASS, MEDIAN, UNSHARP MASK, GAMMA/EXPOSURE";
ddL.selection = 0;
uiSelectionL = ddL.selection.text;

var cb0 = dlg.openPnl.add("group");
cb0.orientation = "row";
cb0.alignment = "center";
title2 = cb0.add("statictext", undefined, "Number of SCANS (N): ");
title2.alignment = "center";
var dScans = cb0.add("edittext", [0, 0, 100, 14], uiNumScans,
{
    justify: "right"
});
dScans.alignment = "center";
dScans.helpTip = "Number of scans.";

var cb1 = dlg.openPnl.add("group");
cb1.orientation = "row";
cb1.alignment = "center";
title1 = cb1.add("statictext", undefined, "PARAMETER/SCAN          ");
title1.alignment = "left";
title2 = cb1.add("statictext", undefined, "SCAN 1                  ");
title2.alignment = "center";
title3 = cb1.add("statictext", undefined, "SCAN N                ");
title3.alignment = "right";
title4 = cb1.add("statictext", undefined, "MODIFIER        ");
title4.alignment = "right";

for (uiL = 1; uiL <= uiMaxParms; uiL = uiL + 1)
{
    dP[uiL] = dlg.openPnl.add("group");
    dP[uiL].orientation = "row";
    dP[uiL].alignment = "center";
    title[uiL] = dP[uiL].add("statictext", undefined, "PARAMETER " + uiL + " ");
    title[uiL].alignment = "left";
    dP1[uiL] = dP[uiL].add("edittext", [0, 0, 100, 14], uiP_1[uiL],
    {
        justify: "right"
    });
    dP1[uiL].alignment = "center";
    dP1[uiL].helpTip = "PARAMETER " + uiL + "/SCAN 1.";
    dPN[uiL] = dP[uiL].add("edittext", [0, 0, 100, 14], uiP_N[uiL],
    {
        justify: "right"
    });
    dPN[uiL].alignment = "right";
    dPN[uiL].helpTip = "PARAMETER " + uiL + "/SCAN N.";

    dM[uiL] = dP[uiL].add("edittext", [0, 0, 100, 14], uiM[uiL],
    {
        justify: "right"
    });
    dM[uiL].alignment = "right";
    dM[uiL].helpTip = "PARAMETER " + uiL + "/MODIFIER.";
}

var dda = dlg.openPnl.add("group");
dda.orientation = "column";
dda.alignment = "center";
txt3 = dda.add("panel", [0, 0, 600, 0]);

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
txt2g.foregroundColor = txt2g.newPen(txt2g.PenType.SOLID_COLOR, [1.00,
  1.00, 0.00, 1], lineWidth = 2);

dlg.show();

function dobuild()
{
    uiProcess = parseInt(ddL.selection, 10);
    uiNumScans = parseInt(dScans.text, 10);
    uiMaxParms = uiProcessParms[uiProcess];
    // alert( uiProcess + "\n " + ddL.selection + "\n " + uiMaxParms + "\n " + uiProcessParms[uiProcess]) ;

    for (uiL = 1; uiL <= uiMaxParms; uiL = uiL + 1)
    {
        uiP_1[uiL] = parseFloat(dP1[uiL].text);
        uiP_N[uiL] = parseFloat(dPN[uiL].text);
        uiM[uiL] = parseFloat(dM[uiL].text);
        if (uiM[uiL] < 0.0) uiM[uiL] = -1.0 / uiM[uiL];
        //alert("h " + uiL);
    }

    //alert(uiProcess + "\n" + uiNumScans + "\n" + uiP1_1 + "\n" + uiP1_N + "\n" + uiP2_1 + "\n" + uiP2_N + "\n" + uiP3_1 + "\n" + uiP3_N + uiP4_1 + "\n" + uiP4_N + "\n" + uiP5_1 + "\n" + uiP5_N);

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
    //uiDone = 1;
    //dlg.close();
    return;
}

function openURL(url)
{
    $.filename = url;
    var path = File($.fileName).parent.fsName + "/" + $.filename;
    var pdf = File(path);
    prompt("Help", pdf);
    if (pdf.exists)
    {
        pdf.execute();
    }
};

var hideLayerHistory = true;
if (hideLayerHistory == true)
{
    // @include '../__REC-Lib/REC-layers_lib.js'
    hideLayerPalette = true;
    hideHistoryPalette = true;
    if (hideLayerPalette == true) hideLayers();
}

// @include '../__REC-Lib/REC-loadSymbols.js'

//
//==================== PROCESS_PARAMETER_SCANNER ==============
//
var imgWidth = Math.round(doc.width.value);
var imgHeight = Math.round(doc.height.value);

function PROCESS_PARAMETER_SCANNER()
{
    // layer names
    var ln;
    var layerNum = doc.layers.length;
    var layerNames = [];
    //prompt("Layers number:", layerNum);
    ln = 0;
    for (var i = 0; i < layerNum; i++)
    {
        if (doc.layers[layerNum - i - 1].visible === true)
        {
            layerNames[ln] = doc.layers[layerNum - i - 1].name;
            ln = ln + 1;
        }
    }

    // Select
    function step01(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putName(PSClass.Layer, layerNames[0]);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putBoolean(PSKey.MakeVisible, false);
        var list1 = new ActionList();
        list1.putInteger(31);
        desc1.putList(PSKey.LayerID, list1);
        executeAction(PSEvent.Select, desc1, dialogMode);
    };

    // Gaussian Blur start
    // Duplicate
    function step12(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putString(PSKey.Name, "Gaussian Blur " + scanNum + "_" + uiP[1].toFixed(
            2));
        desc1.putInteger(PSClass.Version, 5);
        // var list1 = new ActionList();
        // list1.putInteger(track);
        // desc1.putList(PSKey.ID, list1);
        executeAction(PSEvent.Duplicate, desc1, dialogMode);
    };

    // Gaussian Blur
    function step13(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putUnitDouble(PSKey.Radius, PSUnit.Pixels, uiP[1]);
        executeAction(sTID('gaussianBlur'), desc1, dialogMode);
    };
    //Gaussian Blur stop

    //HighPass start
    // Duplicate
    function step22(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putString(PSKey.Name, "Highpass " + scanNum + "_" + uiP[1].toFixed(
            2));
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(5);
        desc1.putList(PSKey.ID, list1);
        executeAction(PSEvent.Duplicate, desc1, dialogMode);
    };

    // High Pass
    function step23(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putUnitDouble(PSKey.Radius, PSUnit.Pixels, uiP[1]);
        executeAction(PSEvent.HighPass, desc1, dialogMode);
    };
    //HighPass stop

    //Median Start
    // Duplicate
    function step32(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putString(PSKey.Name, "Median " + scanNum + "_" + uiP[1].toFixed(0));
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(5);
        desc1.putList(PSKey.ID, list1);
        executeAction(PSEvent.Duplicate, desc1, dialogMode);
    };

    // Median
    function step33(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putUnitDouble(PSKey.Radius, PSUnit.Pixels, uiP[1].toFixed(0));
        executeAction(PSEvent.Median, desc1, dialogMode);
    };
    //Median Stop

    //Unsharp Mask start
    // Duplicate
    function step42(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putString(PSKey.Name, "Unsharp Mask " + scanNum + "_" + uiP[1].toFixed(
            2) + "/" + uiP[2].toFixed(2) + "/" + uiP[3].toFixed(2));
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(5);
        desc1.putList(PSKey.ID, list1);
        executeAction(PSEvent.Duplicate, desc1, dialogMode);
    };

    // Unsharp Mask
    function step43(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putUnitDouble(PSKey.Amount, PSUnit.Percent, uiP[2]);
        desc1.putUnitDouble(PSKey.Radius, PSUnit.Pixels, uiP[1]);
        desc1.putInteger(PSKey.Threshold, uiP[3]);
        executeAction(PSEvent.UnsharpMask, desc1, dialogMode);
    };
    //Unsharp Mask stop


    //Gamma/Exposure Start
    // Duplicate
    function step52(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putString(PSKey.Name, "GAMMA/EXPOSURE " + scanNum + "_" + uiP[1].toFixed(
            2) + "/" + uiP[2].toFixed(2) + "/" + uiP[3].toFixed(4));
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(5);
        desc1.putList(PSKey.ID, list1);
        executeAction(PSEvent.Duplicate, desc1, dialogMode);
    };

    // Exposure
    function step53(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putEnumerated(PSString.presetKind, PSString.presetKindType, PSString.presetKindCustom);
        desc1.putDouble(PSKey.Exposure, uiP[2]);
        desc1.putDouble(PSEvent.Offset, uiP[3]);
        desc1.putDouble(PSString.gammaCorrection, uiP[1]);
        executeAction(sTID('exposure'), desc1, dialogMode);
    };
    //Gamma/Exposure Stop

    // Calculate values for layer

    for (uiL = 1; uiL <= uiMaxParms; uiL = uiL + 1)
    {
        if (uiM[uiL] > 1.0 || uiM[uiL] < 1.0 && uiM[uiL] > 0.0)
        {
            uiP_1[uiL] = Math.pow(uiP_1[uiL], 1.0 / uiM[uiL]);
            uiP_N[uiL] = Math.pow(uiP_N[uiL], 1.0 / uiM[uiL]);
        }
        else if (uiM[uiL] < -1.0 || uiM[uiL] > -1.0 && uiM[uiL] < 0.0)
        {
            uiP_1[uiL] = Math.pow(uiP_1[uiL], uiM[uiL]);
            uiP_N[uiL] = Math.pow(uiP_N[uiL], uiM[uiL]);
        }
    }

    for (uiL = 1; uiL <= uiMaxParms; uiL = uiL + 1)
    {
        uiP_Interp[uiL] = (uiP_N[uiL] - uiP_1[uiL]) * 1.0 / (uiNumScans - 1.0);
    }

    // @include '../__REC-Lib/REC-zeroFillNum.js'
    for (ns = uiNumScans - 1; ns >= 0; ns = ns - 1)
    {
        nss = uiNumScans - ns - 1;
        scanNum = ZeroFillNum(uiNumScans, nss + 1);

        for (uiL = 1; uiL <= uiMaxParms; uiL = uiL + 1)
        {
            uiP[uiL] = uiP_1[uiL] + uiP_Interp[uiL] * nss * 1.0;
        }

        for (uiL = 1; uiL <= uiMaxParms; uiL = uiL + 1)
        {
            if (uiM[uiL] > 0.0)
            {
                uiP[uiL] = Math.pow(uiP[uiL], uiM[uiL]);
            }
            else if (uiM[uiL] < 0.0)
            {
                uiP[uiL] = Math.pow(uiP[uiL], 1.0 / Math.abs(uiM[uiL]));
            }
        }
        //alert(" Pro " + uiProcess + "\n ns " + ns + "\n nss " + nss + "\n p1 " + uiP[1] + "\n p_1 " + uiP_1[1] + "\n p_I " + uiP_Interp[1] + "\n m1 " + uiM[1]);// + "\n p2 " + uiP[2] + "\n p3 " + uiP[3] + "\n p4 " + uiP[4] + "\n p5 " + uiP[5]

        step01(); // Select

        if (uiProcess == 0)
        {
            step12(); // Duplicate    
            step13(); // Gaussian Blur
        }

        if (uiProcess == 1)
        {
            //alert(" HP" + uiProcess + "\n ns " + ns + "\n nss " + nss + "\n p1 " + uiP1 + "\n p2 " + uiP2 + "\n p3 " + uiP3 + "\n p4 " + uiP4 + "\n p5 " + uiP5);
            step22(); // Duplicate
            step23(); // High Pass
        }

        if (uiProcess == 2)
        {
            step32(); // Duplicate
            step33(); // Median
        }

        if (uiProcess == 3)
        {
            step42(); // Duplicate
            step43(); // Unsharp Mask
        }

        if (uiProcess == 4)
        {
            step52(); // Duplicate
            step53(); // Gamma/Exposure
        }
    }
};

//
//=========================================
//      PROCESS_PARAMETER_SCANNER.main
//=========================================
//

PROCESS_PARAMETER_SCANNER.main = function ()
{
    if (uiDone == 1) return;
    PROCESS_PARAMETER_SCANNER();
};

if (hideLayerHistory == true)
{
    if (hideLayerPalette == true) hideLayers();
    if (hideHistoryPalette == true) app.activeDocument.suspendHistory(scriptName +
        " END", "PROCESS_PARAMETER_SCANNER.main()");
}
else
{
    PROCESS_PARAMETER_SCANNER.main();
}

app.preferences.rulerUnits = rulerUnits;
"PROCESS_PARAMETER_SCANNER  " + uiDone
// EOF