#script Ft1DAnalysis.jsx
#target photoshop
app.bringToFront();
/*
<javascriptresource>
<name>Ft1DHA</name>
<about>Fourier_1D_Analysis_for_Photoshop_by_RONC.</about>
<menu>filter</menu>
<category>RONC 2018</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

var doc = app.activeDocument;
rulerUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;

var scriptName = "Fourier_1D_Analysis_for_Photoshop_by_RONC©2018";
var scriptVerNum = "1.00.09";
var scriptVerDate = "29Jun2018";
var scriptVersion = scriptVerNum + " - " + scriptVerDate;
var scriptAuthor = ""; //"Ron Chambers";
var scriptAbstract =
  "Fourier_Analysis - See Abstract and Copyright information in the HELP file:  ";
  
 //************************************************************************************* 
var Ft1DH_plugin = "Ft1DH....";  // Must be changed to match plugin if plugin is changed.


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
function Ft1DAnalysis()
{
    // Set
    function step00(enabled, withDialog) {
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
      desc1.putInteger(PSKey.LayerID, 20);
      executeAction(PSEvent.Set, desc1, dialogMode);
      };

  // Rotate
  function step01(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(PSClass.Document, PSType.Ordinal, PSEnum.First);
    desc1.putReference(PSKey.Target, ref1);
    desc1.putUnitDouble(PSKey.Angle, PSUnit.Angle, -90);
    executeAction(PSEvent.Rotate, desc1, dialogMode);
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
    desc1.putString(PSKey.Name, "Ft1 ");
    desc1.putInteger(PSClass.Version, 5);
    var list1 = new ActionList();
    list1.putInteger(9);
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
    desc1.putString(PSKey.Using, Ft1DH_plugin);
    executeAction(PSEvent.Filter, desc1, dialogMode);
  };

  // Rotate
  function step04(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(PSClass.Document, PSType.Ordinal, PSEnum.First);
    desc1.putReference(PSKey.Target, ref1);
    desc1.putUnitDouble(PSKey.Angle, PSUnit.Angle, 90);
    executeAction(PSEvent.Rotate, desc1, dialogMode);
  };

  // Select
  function step05(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(PSClass.Layer, "Layer 0");
    desc1.putReference(PSKey.Target, ref1);
    desc1.putBoolean(PSKey.MakeVisible, false);
    var list1 = new ActionList();
    list1.putInteger(3);
    desc1.putList(PSKey.LayerID, list1);
    executeAction(PSEvent.Select, desc1, dialogMode);
  };

  // Duplicate
  function step06(enabled, withDialog)
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
    list1.putInteger(10);
    desc1.putList(PSKey.ID, list1);
    executeAction(PSEvent.Duplicate, desc1, dialogMode);
  };

  // Filter
  function step07(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    desc1.putString(PSKey.Using, Ft1DH_plugin);
    executeAction(PSEvent.Filter, desc1, dialogMode);
  };

  // Canvas Size
  function step08(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    desc1.putBoolean(PSKey.Relative, true);
    desc1.putUnitDouble(PSKey.Width, PSUnit.Pixels, imageWidth / 2.0);
    desc1.putUnitDouble(PSKey.Height, PSUnit.Pixels, imageHeight / 2.0);
    desc1.putEnumerated(PSKey.Horizontal, PSType.HorizontalLocation, PSEnum.Left);
    desc1.putEnumerated(PSKey.Vertical, PSType.VerticalLocation, PSEnum.Top);
    executeAction(sTID('canvasSize'), desc1, dialogMode);
  };

  // Select
  function step09(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(PSClass.Layer, "Ft1 ");
    desc1.putReference(PSKey.Target, ref1);
    desc1.putBoolean(PSKey.MakeVisible, false);
    var list1 = new ActionList();
    list1.putInteger(9);
    desc1.putList(PSKey.LayerID, list1);
    executeAction(PSEvent.Select, desc1, dialogMode);
  };

  // Offset
  function step10(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    desc1.putInteger(PSKey.Horizontal, 0);
    desc1.putInteger(PSKey.Vertical, imageHeight);
    desc1.putEnumerated(PSKey.Fill, PSType.FillMode, PSEnum.Wrap);
    executeAction(PSEvent.Offset, desc1, dialogMode);
  };

  // Select
  function step11(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(PSClass.Layer, "Layer 0 copy");
    desc1.putReference(PSKey.Target, ref1);
    desc1.putBoolean(PSKey.MakeVisible, false);
    var list1 = new ActionList();
    list1.putInteger(12);
    desc1.putList(PSKey.LayerID, list1);
    executeAction(PSEvent.Select, desc1, dialogMode);
  };

  // Offset
  function step12(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    desc1.putInteger(PSKey.Horizontal, -(imageWidth + 1) / 2);
    desc1.putInteger(PSKey.Vertical, 0);
    desc1.putEnumerated(PSKey.Fill, PSType.FillMode, PSEnum.Wrap);
    executeAction(PSEvent.Offset, desc1, dialogMode);
  };

  // Move
  function step13(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(PSClass.Layer, "Layer 0");
    desc1.putReference(PSKey.Target, ref1);
    var ref2 = new ActionReference();
    ref2.putIndex(PSClass.Layer, 3);
    desc1.putReference(PSKey.To, ref2);
    desc1.putBoolean(PSKey.Adjustment, false);
    desc1.putInteger(PSClass.Version, 5);
    var list1 = new ActionList();
    list1.putInteger(3);
    desc1.putList(PSKey.LayerID, list1);
    executeAction(PSEvent.Move, desc1, dialogMode);
  };

  // Select
  function step14(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(PSClass.Layer, "Ft1 ");
    desc1.putReference(PSKey.Target, ref1);
    desc1.putEnumerated(PSString.selectionModifier, PSString.selectionModifierType,
      PSString.addToSelection);
    desc1.putBoolean(PSKey.MakeVisible, false);
    var list1 = new ActionList();
    list1.putInteger(11);
    list1.putInteger(3);
    desc1.putList(PSKey.LayerID, list1);
    executeAction(PSEvent.Select, desc1, dialogMode);
  };

  // Select
  function step15(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(PSClass.Layer, "Layer 0 copy");
    desc1.putReference(PSKey.Target, ref1);
    desc1.putEnumerated(PSString.selectionModifier, PSString.selectionModifierType,
      PSString.addToSelection);
    desc1.putBoolean(PSKey.MakeVisible, false);
    var list1 = new ActionList();
    list1.putInteger(12);
    list1.putInteger(11);
    list1.putInteger(3);
    desc1.putList(PSKey.LayerID, list1);
    executeAction(PSEvent.Select, desc1, dialogMode);
  };

  // Make
  function step16(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(PSClass.Layer);
    desc1.putReference(PSKey.Target, ref1);
    desc1.putInteger(PSKey.LayerID, 8);
    executeAction(PSEvent.Make, desc1, dialogMode);
  };

  // Fill
  function step17(enabled, withDialog) 
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    desc1.putEnumerated(PSKey.Using, PSType.FillContents, PSEnum.Black);
    desc1.putUnitDouble(PSKey.Opacity, PSUnit.Percent, 100);
    desc1.putEnumerated(PSKey.Mode, PSType.BlendMode, PSEnum.Normal);
    executeAction(PSKey.Fill, desc1, dialogMode);
  };

  // Move
  function step18(enabled, withDialog)
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
    list1.putInteger(8);
    desc1.putList(PSKey.LayerID, list1);
    executeAction(PSEvent.Move, desc1, dialogMode);
  };

  // Select
  function step19(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(PSClass.Layer, "Layer 0");
    desc1.putReference(PSKey.Target, ref1);
    desc1.putEnumerated(PSString.selectionModifier, PSString.selectionModifierType,
      PSString.addToSelectionContinuous);
    desc1.putBoolean(PSKey.MakeVisible, false);
    var list1 = new ActionList();
    list1.putInteger(13);
    list1.putInteger(12);
    list1.putInteger(11);
    list1.putInteger(10);
    desc1.putList(PSKey.LayerID, list1);
    executeAction(PSEvent.Select, desc1, dialogMode);
  };

  // Merge Layers
  function step20(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    executeAction(sTID('mergeLayersNew'), desc1, dialogMode);
  };
   //alert(" bg " + " AM" + hasBackgroundLayerAM ());
  if(hasBackgroundLayerAM () == true) step00(); // Set
  step01(); // Rotate
  step02(); // Duplicate
  step03(); // Filter
  step04(); // Rotate
  step05(); // Select
  step06(); // Duplicate
  step07(); // Filter
  step08(); // Canvas Size
  step09(); // Select
  step10(); // Offset
  step11(); // Select
  step12(); // Offset
  step13(); // Move
  step14(); // Select
  step15(); // Select
  step16(); // Make
  step17(); // Fill
  step18(); // Move
  step19(); // Select
  step20(); // Merge Layers
};

//=========================================
//                    Ft1DAnalysis.main
//=========================================
//

Ft1DAnalysis.main = function ()
{
  Ft1DAnalysis();
};

if (hideLayerPalette == true) hideLayers();
if (hideHistoryPalette == true) app.activeDocument.suspendHistory(scriptName +
  ' Complete', 'Ft1DAnalysis.main()');

app.preferences.rulerUnits = rulerUnits;

"Ft1DAnalysis.jsx"
// EOF
