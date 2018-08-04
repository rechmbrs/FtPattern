#script PadImage.jsx
#target photoshop
app.bringToFront();

/*
<javascriptresource>
<name>PadImage</name>
<about>Pad Image</about>
<menu>filter</menu>
<category>ScriptsRONC</category>
<enableinfo>PSHOP_ImageMode, RGBMode, RGB48Mode, RGB96Mode</enableinfo>
</javascriptresource>
*/

var doc = app.activeDocument;
rulerUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;

var scriptName = "PadImage_for_Photoshop_by_RONC©2018";
var scriptVerNum = "1.04.95";
var scriptVerNumHelp = "v1";
var scriptVerDate = "10Jul2018";
var scriptVersion = scriptVerNum + " - " + scriptVerDate;
var scriptAuthor = ""; //"Ron Chambers";
var scriptAbstract =
    "PadImage - See Abstract and Copyright information in the HELP file:  ";

// @include '../__REC-Lib/REC-copyright_lib.js'
// @include '../__REC-Lib/REC-global_lib.js'

// Script Expiration
var yx = "2050";
var mx = "01";
var dx = "01";
//@include '../__REC-Lib/REC-expire_lib.js'

var imageWidth = doc.width;
var imageHeight = doc.height;
var imageWidth = Math.round(doc.width.value);
var imageHeight = Math.round(doc.height.value);
//
var decimal = 10;
var paddingPcnt = 10;
var paddingRadius = 5;
var overLap = 2;
var uiPaddingPcnt = 0;
var uiPaddingRadius = 0;
var paddinG;
var imagePadWidth;
var imagePadHeight;
var uiOverlap = 0;
var uiQMark = "  ?";
var uiDone = 0;
var uiHelp = "PAD_IMAGE-HELP" + scriptVerNumHelp + ".pdf";

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

var cb = dlg.openPnl.add("group");
cb.orientation = "row";
cb.alignment = "center";
var dL = cb.add("group");
dL.orientation = "row"; //"column";
dL.alignment = "left"; //"center";
title1 = dL.add("statictext", undefined, "Padding (+) percent (%) / (-) constant (px): ");
title1.alignment = "left";
var dLett = dL.add("edittext", [0, 0, 100, 14], paddingPcnt,
{
    justify: "right"
});
dLett.alignment = "left";
dLett.helpTip = "Padding +percent (%) / -constant (px).";

var dR = cb.add("group");
dR.orientation = "row"; //"column";
dR.alignment = "center";
title1 = dR.add("statictext", undefined, "Padding HiCut (px): ");
title1.alignment = "center";
var dRett = dR.add("edittext", [0, 0, 100, 14], paddingRadius,
{
    justify: "right"
});
dRett.alignment = "center";
dRett.helpTip = "Padding HiCut (px).";

var de = dlg.openPnl.add("group");
de.orientation = "row";
de.alignment = "center";

var dRr = de.add("group");
dRr.orientation = "row"; //"column";
dRr.alignment = "center";
title1 = dRr.add("statictext", undefined, "Frame Overlap (px): ");
title1.alignment = "center";
var dRrett = dRr.add("edittext", [0, 0, 100, 14], overLap,
{
    justify: "right"
});
dRrett.alignment = "center";
dRrett.helpTip = "Frame Overlap (px).";

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
txt2g.foregroundColor = txt2g.newPen(txt2g.PenType.SOLID_COLOR, [1.00, 1.00, 0.00, 1], lineWidth = 2);

dlg.show();

function dobuild()
{
    paddingPcnt = 10;
    uiPaddingPcnt = parseInt(dLett.text, decimal);
    if (uiPaddingPcnt === 0 || uiPaddingPcnt >= 101) uiPaddingPcnt = paddingPcnt;
    //alert(dLett.text + "   " + uiPaddingPcnt);

    paddingRadius = 5;
    uiPaddingRadius = parseInt(dRett.text, decimal);
    if (uiPaddingRadius <= 0 || uiPaddingRadius >= 2501) uiPaddingRadius = paddingRadius;

    overLap = 2;
    uiOverlap = parseInt(dRrett.text, decimal);
    if (uiOverlap <= 0 || uiOverlap >= 10) uiOverlap = overLap;
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

if (uiPaddingPcnt < 0)
{
    paddinG = -uiPaddingPcnt;
    imagePadWidth = imageWidth + Math.round(paddinG) * 2;
    imagePadHeight = imageHeight + Math.round(paddinG) * 2;
}
else
{
    paddinG = uiPaddingPcnt * 0.01;
    imagePadWidth = imageWidth + Math.round(imageWidth * paddinG) * 2;
    imagePadHeight = imageHeight + Math.round(imageHeight * paddinG) * 2;
}
//alert(paddinG + "  " + uiPaddingPcnt + " padding " + imagePadWidth + " " + imagePadHeight + "  " + dLett.text);

var shiftWidth = imageWidth - overLap;
var shiftHeight = imageHeight - overLap;
// @include '../__REC-Lib/REC-loadSymbols.js' 
    
var hideLayerHistory = true;
if (hideLayerHistory == true)
{
    // @include '../__REC-Lib/REC-layers_lib.js' 
    // @include '../__REC-Lib/REC-hasBackgroundLayerAM.jsxinc'// Find if background layer
    hideLayerPalette = true;
    hideHistoryPalette = true;
    if (hideLayerPalette === true) hideLayers();
}

//
//==================== PadImage ==============
//
function PadImage()
{
    // Set
    function step01(enabled, withDialog)
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
        desc1.putInteger(PSKey.LayerID, 191);
        executeAction(PSEvent.Set, desc1, dialogMode);
    }

    // Duplicate
    function step02(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(192);
        desc1.putList(PSKey.ID, list1);
        executeAction(PSEvent.Duplicate, desc1, dialogMode);
    }

    // Canvas Size
    function step03(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putUnitDouble(PSKey.Width, PSUnit.Pixels, imagePadWidth);
        desc1.putUnitDouble(PSKey.Height, PSUnit.Pixels, imagePadHeight);
        desc1.putEnumerated(PSKey.Horizontal, PSType.HorizontalLocation, PSEnum.Center);
        desc1.putEnumerated(PSKey.Vertical, PSType.VerticalLocation, PSEnum.Center);
        executeAction(sTID('canvasSize'), desc1, dialogMode);
    }

    // Duplicate
    function step04(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(193);
        desc1.putList(PSKey.ID, list1);
        executeAction(PSEvent.Duplicate, desc1, dialogMode);
    }

    // Duplicate
    function step05(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(194);
        desc1.putList(PSKey.ID, list1);
        executeAction(PSEvent.Duplicate, desc1, dialogMode);
    }

    // Flip
    function step06(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putEnumerated(PSKey.Axis, PSType.Orientation, PSKey.Horizontal);
        executeAction(PSEvent.Flip, desc1, dialogMode);
    }

    // Duplicate
    function step07(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(195);
        desc1.putList(PSKey.ID, list1);
        executeAction(PSEvent.Duplicate, desc1, dialogMode);
    }

    // Offset
    function step08(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putInteger(PSKey.Horizontal, shiftWidth);
        desc1.putInteger(PSKey.Vertical, 0);
        desc1.putEnumerated(PSKey.Fill, PSType.FillMode, PSEnum.Background);
        executeAction(PSEvent.Offset, desc1, dialogMode);
    }

    // Select
    function step09(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putName(PSClass.Layer, "Layer 0 copy 3");
        desc1.putReference(PSKey.Target, ref1);
        desc1.putBoolean(PSKey.MakeVisible, false);
        var list1 = new ActionList();
        list1.putInteger(194);
        desc1.putList(PSKey.LayerID, list1);
        executeAction(PSEvent.Select, desc1, dialogMode);
    }

    // Offset
    function step10(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putInteger(PSKey.Horizontal, -shiftWidth);
        desc1.putInteger(PSKey.Vertical, 0);
        desc1.putEnumerated(PSKey.Fill, PSType.FillMode, PSEnum.Background);
        executeAction(PSEvent.Offset, desc1, dialogMode);
    }

    // Select
    function step11(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putName(PSClass.Layer, "Layer 0 copy 4");
        desc1.putReference(PSKey.Target, ref1);
        desc1.putEnumerated(PSString.selectionModifier, PSString.selectionModifierType,
            PSString.addToSelection);
        desc1.putBoolean(PSKey.MakeVisible, false);
        var list1 = new ActionList();
        list1.putInteger(194);
        list1.putInteger(195);
        desc1.putList(PSKey.LayerID, list1);
        executeAction(PSEvent.Select, desc1, dialogMode);
    }

    // Select
    function step12(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putName(PSClass.Layer, "Layer 0 copy 2");
        desc1.putReference(PSKey.Target, ref1);
        desc1.putEnumerated(PSString.selectionModifier, PSString.selectionModifierType,
            PSString.addToSelection);
        desc1.putBoolean(PSKey.MakeVisible, false);
        var list1 = new ActionList();
        list1.putInteger(193);
        list1.putInteger(194);
        list1.putInteger(195);
        desc1.putList(PSKey.LayerID, list1);
        executeAction(PSEvent.Select, desc1, dialogMode);
    }

    // Merge Layers
    function step13(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        executeAction(sTID('mergeLayersNew'), desc1, dialogMode);
    }

    // Duplicate
    function step14(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(196);
        desc1.putList(PSKey.ID, list1);
        executeAction(PSEvent.Duplicate, desc1, dialogMode);
    }

    // Flip
    function step15(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putEnumerated(PSKey.Axis, PSType.Orientation, PSKey.Vertical);
        executeAction(PSEvent.Flip, desc1, dialogMode);
    }

    // Duplicate
    function step16(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(197);
        desc1.putList(PSKey.ID, list1);
        executeAction(PSEvent.Duplicate, desc1, dialogMode);
    }

    // Offset
    function step17(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putInteger(PSKey.Horizontal, 0);
        desc1.putInteger(PSKey.Vertical, shiftHeight);
        desc1.putEnumerated(PSKey.Fill, PSType.FillMode, PSEnum.Background);
        executeAction(PSEvent.Offset, desc1, dialogMode);
    }

    // Select
    function step18(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putName(PSClass.Layer, "Layer 0 copy 5");
        desc1.putReference(PSKey.Target, ref1);
        desc1.putBoolean(PSKey.MakeVisible, false);
        var list1 = new ActionList();
        list1.putInteger(196);
        desc1.putList(PSKey.LayerID, list1);
        executeAction(PSEvent.Select, desc1, dialogMode);
    }

    // Offset
    function step19(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putInteger(PSKey.Horizontal, 0);
        desc1.putInteger(PSKey.Vertical, -shiftHeight);
        desc1.putEnumerated(PSKey.Fill, PSType.FillMode, PSEnum.Background);
        executeAction(PSEvent.Offset, desc1, dialogMode);
    }

    // Select
    function step20(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putName(PSClass.Layer, "Layer 0 copy 6");
        desc1.putReference(PSKey.Target, ref1);
        desc1.putEnumerated(PSString.selectionModifier, PSString.selectionModifierType,
            PSString.addToSelection);
        desc1.putBoolean(PSKey.MakeVisible, false);
        var list1 = new ActionList();
        list1.putInteger(196);
        list1.putInteger(197);
        desc1.putList(PSKey.LayerID, list1);
        executeAction(PSEvent.Select, desc1, dialogMode);
    }

    // Select
    function step21(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putName(PSClass.Layer, "Layer 0 copy 4");
        desc1.putReference(PSKey.Target, ref1);
        desc1.putEnumerated(PSString.selectionModifier, PSString.selectionModifierType,
            PSString.addToSelection);
        desc1.putBoolean(PSKey.MakeVisible, false);
        var list1 = new ActionList();
        list1.putInteger(195);
        list1.putInteger(196);
        list1.putInteger(197);
        desc1.putList(PSKey.LayerID, list1);
        executeAction(PSEvent.Select, desc1, dialogMode);
    }

    // Merge Layers
    function step22(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        executeAction(sTID('mergeLayersNew'), desc1, dialogMode);
    }

    // Gaussian Blur
    function step23(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putUnitDouble(PSKey.Radius, PSUnit.Pixels, uiPaddingRadius);
        executeAction(sTID('gaussianBlur'), desc1, dialogMode);
    }

    // Move
    function step24(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putName(PSClass.Layer, "Layer 0 copy");
        desc1.putReference(PSKey.Target, ref1);
        var ref2 = new ActionReference();
        ref2.putIndex(PSClass.Layer, 2);
        desc1.putReference(PSKey.To, ref2);
        desc1.putBoolean(PSKey.Adjustment, false);
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(192);
        desc1.putList(PSKey.LayerID, list1);
        executeAction(PSEvent.Move, desc1, dialogMode);
    }

    // Move
    function step25(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        var ref2 = new ActionReference();
        ref2.putIndex(PSClass.Layer, 2);
        desc1.putReference(PSKey.To, ref2);
        desc1.putBoolean(PSKey.Adjustment, false);
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(192);
        desc1.putList(PSKey.LayerID, list1);
        executeAction(PSEvent.Move, desc1, dialogMode);
    }

    // Move
    function step26(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        var ref2 = new ActionReference();
        ref2.putIndex(PSClass.Layer, 3);
        desc1.putReference(PSKey.To, ref2);
        desc1.putBoolean(PSKey.Adjustment, false);
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(192);
        desc1.putList(PSKey.LayerID, list1);
        executeAction(PSEvent.Move, desc1, dialogMode);
    }

    // Select
    function step27(enabled, withDialog)
    {
        if (enabled !== undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putName(PSClass.Layer, "Layer 0 copy 6");
        desc1.putReference(PSKey.Target, ref1);
        desc1.putEnumerated(PSString.selectionModifier, PSString.selectionModifierType,
            PSString.addToSelection);
        desc1.putBoolean(PSKey.MakeVisible, false);
        var list1 = new ActionList();
        list1.putInteger(197);
        list1.putInteger(192);
        desc1.putList(PSKey.LayerID, list1);
        executeAction(PSEvent.Select, desc1, dialogMode);
    }

    // Flatten Image
    function step28(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        executeAction(sTID('flattenImage'), undefined, dialogMode);
    }

    if (hasBackgroundLayerAM() == true) step01(); // Set
    step02(); // Duplicate
    step03(); // Canvas Size
    step04(); // Duplicate
    step05(); // Duplicate
    step06(); // Flip
    step07(); // Duplicate
    step08(); // Offset
    step09(); // Select
    step10(); // Offset
    step11(); // Select
    step12(); // Select
    step13(); // Merge Layers
    step14(); // Duplicate
    step15(); // Flip
    step16(); // Duplicate
    step17(); // Offset
    step18(); // Select
    step19(); // Offset
    step20(); // Select
    step21(); // Select
    step22(); // Merge Layers
    step23(); // Gaussian Blur
    step24(); // Move
    step25(); // Move
    step26(); // Move
    step27(); // Select
    step28(); // Flatten
}
//========================================
//                    PadImage.main
//=========================================
//
PadImage.main = function ()
{
    PadImage();
};

app.preferences.rulerUnits = rulerUnits;
if (hideLayerHistory == true)
{
    if (hideLayerPalette === true) hideLayers();
    if (hideHistoryPalette === true) app.activeDocument.suspendHistory(scriptName + ' Complete', 'PadImage.main()');
}
else
{
    PadImage.main();
}

"PadImage " + uiDone;
// EOF