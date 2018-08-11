#script Ft3DAnalysis.jsx
#target photoshop
app.bringToFront();

/*
<javascriptresource>
<name>Ft3DHA</name>
<about>Fourier_3D_Analysis_for_Photoshop_by_RONC.</about>
<menu>filter</menu>
<category>RONC 2018</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

var doc = app.activeDocument;
rulerUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;

var scriptName = "Fourier_3D_Analysis_for_Photoshop_by_RONC©2018";
var scriptVerNum = "1.00.09";
var scriptVerDate = "29Jun2018";
var scriptVersion = scriptVerNum + " - " + scriptVerDate;
var scriptAuthor = ""; //"Ron Chambers";
var scriptAbstract =
    "Fourier_Analysis - See Abstract and Copyright information in the HELP file:  ";

//*************************************************************************************
var Ft3DH_plugin = "Ft3DH...."; // Must be changed to match plugin if plugin is changed.

// @include '../__REC-Lib/REC-copyright_lib.js'
// @include '../__REC-Lib/REC-global_lib.js'

// Script Expiration
var yx = "2050";
var mx = "01";
var dx = "01";
//@include '../__REC-Lib/REC-expire_lib.js'

// @include '../__REC-Lib/REC-loadSymbols.js'
// @include '../__REC-Lib/REC-layers_lib.js'

hideLayerPalette = true;
hideHistoryPalette = true;
if (hideLayerPalette == true) hideLayers();

var imageWidth = doc.width;
var imageHeight = doc.height;
var imageWidth = Math.round(doc.width.value);
var imageHeight = Math.round(doc.height.value);
//
// Find if background layer
//
// @include '../__REC-Lib/REC-hasBackgroundLayerAM.jsxinc'
//==================== Ft3D Analysis ==============
//
function Ft3DAnalysis()
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
        desc1.putInteger(PSKey.LayerID, 25);
        executeAction(PSEvent.Set, desc1, dialogMode);
    };

    // Duplicate
    function step02(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(26);
        desc1.putList(PSKey.ID, list1);
        executeAction(PSEvent.Duplicate, desc1, dialogMode);
    };

    // Filter
    function step03(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putString(PSKey.Using, "Ft3DH....");
        executeAction(PSEvent.Filter, desc1, dialogMode);
    };

    // Canvas Size
    function step04(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putBoolean(PSKey.Relative, true);
        desc1.putUnitDouble(PSKey.Width, PSUnit.Pixels, imageWidth / 2);
        desc1.putEnumerated(PSKey.Horizontal, PSType.HorizontalLocation, PSEnum.Left);
        executeAction(sTID('canvasSize'), desc1, dialogMode);
    };

    // Offset
    function step05(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putInteger(PSKey.Horizontal, imageWidth);
        desc1.putInteger(PSKey.Vertical, 0);
        desc1.putEnumerated(PSKey.Fill, PSType.FillMode, PSEnum.Wrap);
        executeAction(PSEvent.Offset, desc1, dialogMode);
    };

    // Move
    function step06(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        var ref2 = new ActionReference();
        ref2.putIndex(PSClass.Layer, 0);
        desc1.putReference(PSKey.To, ref2);
        desc1.putBoolean(PSKey.Adjustment, false);
        desc1.putInteger(PSClass.Version, 5);
        var list1 = new ActionList();
        list1.putInteger(26);
        desc1.putList(PSKey.LayerID, list1);
        executeAction(PSEvent.Move, desc1, dialogMode);
    };

    // Select
    function step07(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putName(PSClass.Layer, "Layer 0");
        desc1.putReference(PSKey.Target, ref1);
        desc1.putEnumerated(PSString.selectionModifier, PSString.selectionModifierType, PSString.addToSelection);
        desc1.putBoolean(PSKey.MakeVisible, false);
        var list1 = new ActionList();
        list1.putInteger(26);
        list1.putInteger(25);
        desc1.putList(PSKey.LayerID, list1);
        executeAction(PSEvent.Select, desc1, dialogMode);
    };

    // Merge Visible
    function step08(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        executeAction(sTID('mergeVisible'), undefined, dialogMode);
    };
    //alert(" bg " + " AM" + hasBackgroundLayerAM ());
    if(hasBackgroundLayerAM () == true) step01(); // Set
    step02(); // Duplicate
    step03(); // Filter
    step04(); // Canvas Size
    step05(); // Offset
    step06(); // Move
    step07(); // Select
    step08(); // Merge Visible
};

//=========================================
//                    Ft3DAnalysis.main
//=========================================
//
Ft3DAnalysis.main = function ()
{
    Ft3DAnalysis();
};

if (hideLayerPalette == true) hideLayers();
if (hideHistoryPalette == true) app.activeDocument.suspendHistory(scriptName +
    ' Complete', 'Ft3DAnalysis.main()');

app.preferences.rulerUnits = rulerUnits;

"Ft3DAnalysis.jsx"
// EOF