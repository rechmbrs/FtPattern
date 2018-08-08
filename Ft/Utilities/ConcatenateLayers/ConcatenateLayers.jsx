#target photoshop
#script ConcatenateLayers.jsx
app.bringToFront();

/*
<javascriptresource>
<name>Concat</name>
<about>ConcatenateLayers_for_Photoshop_by_RONC.</about>
<menu>filter</menu>
<category>RONC 2018</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

var doc = app.activeDocument;
rulerUnits = app.preferences.rulerUnits;
app.preferences.rulerUnits = Units.PIXELS;

var scriptName = "ConcatenateLayers_for_Photoshop_by_RONC©2018";
var scriptVerNumHelp = "v1";
var scriptVerNum = "1.02.08";
var scriptVerDate = "10Jul2018";
var scriptVersion = scriptVerNum + " - " + scriptVerDate;
var scriptAuthor = ""; //"Ron Chambers";
var scriptAbstract =
    "ConcatenateLayers - See Abstract and Copyright information in the HELP file:  ";

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
// Dialog
//
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
//prompt("num", ln + " / " + layerNum);
layerNum = ln;
layerNames.length = ln;
ln = 0;
//prompt("num", ln + " / " + layerNum);
//prompt("Layers Names:", layerNames);
var uiError = layerNum;
if (uiError <= 1)
{
    alert("Number of layers must exceed 1.", layerNum);
}

var uiSelectLayer0 = layerNames[0];
var uiSelectLayer1 = layerNames[1];
var uiWidth = imageWidth * 2;
var uiDone = 0;
var uiHelp = "CONCATENATE_LAYERS-HELP" + scriptVerNumHelp + ".pdf";

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

var de = dlg.openPnl.add("group");
de.orientation = "row";
de.alignment = "center";

var dR = de.add("group");
dR.orientation = "column";
dR.alignment = "center";
title2 = dR.add("statictext", undefined, "Layer Zero: ");
title2.alignment = "left";
ddR = dR.add("dropdownlist", undefined, layerNames);
ddR.alignment = "left";
ddR.helpTip = "Layer Zero";
ddR.selection = 0;
uiSelectLayer0 = ddR.selection.text;

var dG = de.add("group");
dG.orientation = "column";
dG.alignment = "left"; //"center";
title1 = dG.add("statictext", undefined, "Layer One: ");
title1.alignment = "left";
ddG = dG.add("dropdownlist", undefined, layerNames);
ddG.alignment = "left";
ddG.helpTip = "Layer One";
ddG.selection = 1;
uiSelectLayer1 = ddG.selection.text;


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
    dlg.close();
    //alert("here1", uiSelection + " " + ddL.selection);
    uiSelectLayer0 = ddR.selection.text;
    uiSelectLayer1 = ddG.selection.text;
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

// @include '../__REC-Lib/REC-loadSymbols.js'
// @include '../__REC-Lib/REC-layers_lib.js'

hideLayerPalette = true;
hideHistoryPalette = true;
if (hideLayerPalette === true) hideLayers();
//
// Find if background layer
//
// @include '../__REC-Lib/REC-hasBackgroundLayerAM.jsxinc'
//
//==================== ConcatenateLayers ==============
//
function ConcatenateLayers()
{
   // Select
  function step01(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(PSClass.Layer, uiSelectLayer0);
    desc1.putReference(PSKey.Target, ref1);
    desc1.putBoolean(PSKey.MakeVisible, false);
    var list1 = new ActionList();
    list1.putInteger(31);
    desc1.putList(PSKey.LayerID, list1);
    executeAction(PSEvent.Select, desc1, dialogMode);
  };

  // Canvas Size
  function step02(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    desc1.putUnitDouble(PSKey.Width, PSUnit.Pixels, uiWidth);
    desc1.putEnumerated(PSKey.Horizontal, PSType.HorizontalLocation, PSEnum.Left);
    desc1.putEnumerated(PSString.canvasExtensionColorType, PSString.canvasExtensionColorType, PSEnum.Black);
    executeAction(PSEvent.CanvasSize, desc1, dialogMode);
  };

  // Select
  function step03(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(PSClass.Layer, uiSelectLayer1);
    desc1.putReference(PSKey.Target, ref1);
    desc1.putBoolean(PSKey.MakeVisible, false);
    var list1 = new ActionList();
    list1.putInteger(24);
    desc1.putList(PSKey.LayerID, list1);
    executeAction(PSEvent.Select, desc1, dialogMode);
  };

  // Offset
  function step04(enabled, withDialog)
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

  // Select
  function step05(enabled, withDialog)
  {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(PSClass.Layer, uiSelectLayer0);
    desc1.putReference(PSKey.Target, ref1);
    desc1.putBoolean(PSKey.MakeVisible, false);
    var list1 = new ActionList();
    list1.putInteger(31);
    desc1.putList(PSKey.LayerID, list1);
    executeAction(PSEvent.Select, desc1, dialogMode);
  };

  // Flatten Image
  function step06(enabled, withDialog) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    executeAction(sTID('flattenImage'), undefined, dialogMode);
  };

  //alert(hasBackgroundLayerAM());
  if(hasBackgroundLayerAM() == true) step01();      // Select
  step02();      // Canvas Size
  step03();      // Select
  step04();      // Offset
  step05();      // Select
  step06();      // Flatten Image
}
//=========================================
//                    ConcatenateLayers.main
//=========================================
//
ConcatenateLayers.main = function ()
{
    ConcatenateLayers();
};

if (hideLayerPalette === true) hideLayers();
if (hideHistoryPalette === true) app.activeDocument.suspendHistory(scriptName + ' Complete', 'ConcatenateLayers.main()');
app.preferences.rulerUnits = rulerUnits;

"ConcatenateLayers " + uiDone;

// EOF