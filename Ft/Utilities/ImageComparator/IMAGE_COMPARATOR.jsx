#script IMAGE_COMPARATOR.jsx
#target photoshop
app.bringToFront();

/*
<javascriptresource>
<name>IMAGE_COMP</name>
<about>IMAGE_COMPARATOR_for_Photoshop_by_RONC.</about>
<menu>filter</menu>
<category>RONC 2018</category>
<enableinfo>true</enableinfo>
</javascriptresource>
*/

var doc = app.activeDocument;

var scriptName = "IMAGE_COMPARATOR_for_Photoshop_by_RONC©2018";
var scriptVerNum = "2.00.05";
var scriptVerNumHelp = "v2";
var scriptVerDate = "08Jul2018";
var scriptVersion = scriptVerNum + " - " + scriptVerDate;
var scriptAuthor = ""; //"Ron Chambers";
var scriptAbstract =
    "IMAGE COMPARATOR - See Abstract and Copyright information in the HELP file:  ";

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
var layerNumSv = layerNum;
var layerNames = [];
//prompt("Layers number:", layerNum);
ln = 0;
for (var i = 0; i < layerNum; i++)
{
    if (doc.layers[layerNum - i - 1].visible == true)
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
var uiError = layerNum - 2;
if (uiError < 0)
{
    alert("Number of layers must be two or more.", layerNum);
}

var uiFoldername = "~/desktop"; //Folder.temp;
var uiSelection = 0;
var uiSelectionL = layerNames[0];
var uiSelectionR = layerNames[1];
var uiFilename = "ImageComparator";
var uiFilenameL = "ImageComparatorLeft";
var uiFilenameR = "ImageComparatorRight";
var uiFiletypeIn = ".png";
var uiFilecomp = 0;
var uiFilenamePNG_JPG;
var uiFiletype = ".png";
var fileTypes = [".png -  0", ".png -  6", ".png -  9", ".jpg -  1",
  ".jpg -  2",
  ".jpg -  3", ".jpg -  4", ".jpg -  5", ".jpg -  6", ".jpg -  7", ".jpg -  8",
  ".jpg -  9", ".jpg - 10", ".jpg - 11", ".jpg - 12"];
var uiFiletypeIn = ".png";
var uiHorVer = "Horizontal";
var uiCommentsL = "LEFT/TOP Image comments: ";
var uiCommentsR = "RIGHT/BOTTOM Image comments: ";
var uiCommentsC = "COMMON Image comments:";
var uiDone = 0;
var uiArrowOpacity = 0.075;
var uiArrowSize = 16;
var uiArrowSpace = uiArrowSize;
var uiHelp = "IMAGE_COMPARATOR-HELP" + scriptVerNumHelp + ".pdf";

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
txt2 = bgb.add("statictext", undefined, "Foldername:");
var ett1 = bgb.add("edittext", undefined, uiFoldername);
ett1.characters = 20;
ett1.helpTip = "Location of web page: " + uiFoldername;
uiFoldername = ett1.text;

txt2a = bgb.add("statictext", undefined, "Filename:");
var ett2 = bgb.add("edittext", undefined, uiFilename);
ett2.characters = 20;
ett2.helpTip = "Filename of web page: " + uiFilename;
uiFilename = ett2.text;

var dP = bgb.add("group");
title2 = dP.add("statictext", undefined, "File type/compression: ");
title2.alignment = "left";
ddP = dP.add("dropdownlist", undefined, fileTypes);
ddP.alignment = "left";
ddP.helpTip = "File type";
ddP.selection = 0;
uiFiletype = ddP.selection.text;

var dc = dlg.openPnl.add("group");
dc.orientation = "column";
dc.alignment = "center";
txt3a = dc.add("panel", [0, 0, 600, 0]);


var dd = dlg.openPnl.add("group");
dd.orientation = "row";
dd.alignment = "center";
rb = dd.add("statictext", undefined, "Image Scroll: ");
rb1 = dd.add("radiobutton", undefined, "Horizontal");
rb2 = dd.add("radiobutton", undefined, "Vertical");
rb1.value = true;
rb2.value = false;
rb2.helpTip = rb1.helpTip = "Scroll - Horizontal/Vertical";

var de = dlg.openPnl.add("group");
de.orientation = "row";
de.alignment = "center";

var dL = de.add("group");
dL.orientation = "column";
dL.alignment = "left"; //"center";
title1 = dL.add("statictext", undefined, "Layer to display on left/top: ");
title1.alignment = "left";
ddL = dL.add("dropdownlist", undefined, layerNames);
ddL.alignment = "left";
ddL.helpTip = "Layer to display on left/top";
ddL.selection = 0;
uiSelectionL = ddL.selection.text;
var dLett = dL.add("edittext", [0, 0, 240, 70], uiCommentsL,
{
    multiline: true
});
dLett.helpTip = "Left comments.";
uiCommentsL = dLett.text;

var dR = de.add("group");
dR.orientation = "column";
dR.alignment = "center";
title2 = dR.add("statictext", undefined, "Layer to display on right/bottom: ");
title2.alignment = "left";
ddR = dR.add("dropdownlist", undefined, layerNames);
ddR.alignment = "left";
ddR.helpTip = "Layer to display on right/bottom";
ddR.selection = 1;
uiSelectionR = ddR.selection.text;
var dRett = dR.add("edittext", [0, 0, 240, 70], uiCommentsR,
{
    multiline: true
});
dRett.helpTip = "Right comments.";
uiCommentsR = dRett.text;

var dda = dlg.openPnl.add("group");
dda.orientation = "column";
dda.alignment = "center";
var dCett = dda.add("edittext", [0, 0, 490, 70], uiCommentsC,
{
    multiline: true
});
dCett.helpTip = "Common comments.";
uiCommentsC = dCett.text;
txt4 = dda.add("statictext", undefined,
    "( For forced line changes within the comments fields, use only the\n CTRL+J key combination.  Do not use Enter or CTRL+Enter key combination. )",
    {
        multiline: true
    });
txt4.justify = "center";
var txt4g = txt4.graphics;
txt4g.font = ScriptUI.newFont("Arial", "BOLD", 12);
txt4.preferredSize[0] = 500;
txt4.preferredSize[1] = 30;
txt4g.foregroundColor = txt4g.newPen(txt4g.PenType.SOLID_COLOR, [1.00, 1.00,
  0.00, 1], lineWidth = 2);
txt4a = dda.add("panel", [0, 0, 600, 0]);


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
txt2g.foregroundColor = txt4g.newPen(txt4g.PenType.SOLID_COLOR, [1.00, 1.00,
  0.00, 1], lineWidth = 2);

dlg.show();

function dobuild()
{
    // alert("Congratulations - it all worked!");
    dlg.close();
    //alert("here1", uiSelection + " " + ddL.selection);
    uiSelectionL = ddL.selection.text;
    uiSelectionR = ddR.selection.text;
    uiFoldername = ett1.text;
    uiFilename = ett2.text;
    uiFiletype = ddP.selection;
    if (uiFiletype <= 2)
    {
        uiFiletypeIn = ".png";
        if (uiFiletype == 0) uiFilecomp = 0;
        if (uiFiletype == 1) uiFilecomp = 6;
        if (uiFiletype == 2) uiFilecomp = 9;
    }
    else
    {
        uiFiletypeIn = ".jpg";
        uiFilecomp = ddP.selection - 2;
    }

    //alert(uiFiletypeIn + "   " + uiFilecomp);
    if (rb1.value == true) uiHorVer = "horizontal";
    if (rb1.value == false) uiHorVer = "vertical";
    uiCommentsL = dLett.text + "\nLayer: " + uiSelectionL;
    uiCommentsR = dRett.text + "\nLayer: " + uiSelectionR;
    uiCommentsC = dCett.text;
    //alert("comment", uiCommentsL) ;
    //alert("comment", uiCommentsR) ;
    //alert("comment", uiCommentsC) ;
    //alert("here2", uiSelection + " " + ddL.selection);
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
};

// @include '../__REC-Lib/REC-loadSymbols.js'
var hideLayerHistory = true;
if (hideLayerHistory == true)
{
    // @include '../__REC-Lib/REC-layers_lib.js'
    hideLayerPalette = true;
    hideHistoryPalette = true;
    if (hideLayerPalette == true) hideLayers();
}

// Select
function step01(enabled, withDialog)
{
    if (enabled != undefined && !enabled)
        return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(PSClass.Layer, uiSelection);
    desc1.putReference(PSKey.Target, ref1);
    desc1.putBoolean(PSKey.MakeVisible, false);
    var list1 = new ActionList();
    list1.putInteger(25);
    desc1.putList(PSKey.LayerID, list1);
    executeAction(PSEvent.Select, desc1, dialogMode);
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
    list1.putInteger(381);
    desc1.putList(PSKey.ID, list1);
    executeAction(PSEvent.Duplicate, desc1, dialogMode);
};

// Move
function step03(enabled, withDialog)
{
    if (enabled != undefined && !enabled)
        return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
    desc1.putReference(PSKey.Target, ref1);
    var ref2 = new ActionReference();
    ref2.putIndex(PSClass.Layer, layerNumSv + 1);
    desc1.putReference(PSKey.To, ref2);
    desc1.putBoolean(PSKey.Adjustment, false);
    desc1.putInteger(PSClass.Version, 5);
    var list1 = new ActionList();
    list1.putInteger(381);
    desc1.putList(PSKey.LayerID, list1);
    executeAction(PSEvent.Move, desc1, dialogMode);
};

// Save
function step04(enabled, withDialog)
{
    if (uiFiletypeIn == ".png")
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var desc2 = new ActionDescriptor();
        desc2.putEnumerated(PSKey.PNGInterlaceType, PSKey.PNGInterlaceType, PSEnum.PNGInterlaceNone);
        desc2.putEnumerated(PSKey.PNGFilter, PSKey.PNGFilter, PSEnum.PNGFilterAdaptive);
        desc2.putInteger(PSKey.Compression, uiFilecomp);
        desc1.putObject(PSKey.As, PSClass.PNGFormat, desc2);
        desc1.putPath(PSKey.In, new File(uiFoldername + "/" + uiFilenamePNG_JPG));
        desc1.putInteger(PSKey.DocumentID, 476);
        desc1.putBoolean(PSKey.Copy, true);
    }
    else
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var desc2 = new ActionDescriptor();
        desc2.putInteger(PSKey.ExtendedQuality, uiFilecomp);
        desc2.putEnumerated(PSKey.MatteColor, PSKey.MatteColor, PSEnum.None);
        desc1.putObject(PSKey.As, PSClass.JPEGFormat, desc2);
        desc1.putPath(PSKey.In, new File(uiFoldername + "/" + uiFilenamePNG_JPG));
        desc1.putInteger(PSKey.DocumentID, 474);
        desc1.putBoolean(PSKey.Copy, true);
    }
    executeAction(PSEvent.Save, desc1, dialogMode);
};

// Delete
function step05(enabled, withDialog)
{
    if (enabled != undefined && !enabled)
        return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
    desc1.putReference(PSKey.Target, ref1);
    var list1 = new ActionList();
    list1.putInteger(384);
    desc1.putList(PSKey.LayerID, list1);
    executeAction(PSEvent.Delete, desc1, dialogMode);
};

/*
// Save
function step03(enabled, withDialog)
{
  if (enabled != undefined && !enabled)
    return;
  //pngOpts.PNG8 = false;
  //pngOpts.transparency = true;
  //pngOpts.interlaced = false;
  //pngOpts.quality = 100;
  var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
  var desc1 = new ActionDescriptor();
  var desc2 = new ActionDescriptor();
  desc2.putEnumerated(PSKey.PNGInterlaceType, PSKey.PNGInterlaceType, PSEnum.PNGInterlaceNone);
  desc2.putEnumerated(PSKey.PNGFilter, PSKey.PNGFilter, PSEnum.PNGFilterAdaptive);
  desc2.putInteger(PSKey.Compression, 100);
  desc1.putObject(PSKey.As, PSClass.PNGFormat, desc2);
  desc1.putPath(PSKey.In, new File(Folder.temp + "/SelectLayerView.png"));
  desc1.putInteger(PSKey.DocumentID, 476);
  desc1.putBoolean(PSKey.Copy, true);
  executeAction(PSEvent.Save, desc1, dialogMode);
};
*/

function SelectLayerPNG_JPG()
{
    for (sel = 0; sel < 2; sel = sel + 1)
    {
        if (sel == 0)
        {
            uiSelection = uiSelectionL;
            //alert("here3a", uiSelection + "/" + uiSelectionL);
            uiFilenamePNG_JPG = uiFilename + "Left";
            uiFilenameL = uiFilenamePNG_JPG;
        }
        if (sel == 1)
        {
            uiSelection = uiSelectionR;
            // alert("here3b", uiSelection + "/" + uiSelectionR);
            uiFilenamePNG_JPG = uiFilename + "Right";
            uiFilenameR = uiFilenamePNG_JPG;
        }
        //alert("here3c\n", uiSelection + "\n" +  uiFilenamePNG_JPG);
        step01(); // Select
        step02(); // Duplicate
        step03(); // Move
        step04(); // Save
        //alert(uiFoldername + "\n" + uiFilenamePNG_JPG + "\n" + uiFiletype, + "\n" + uiFilecomp);
        step05(); // Delete
    }
}

function BuildWriteHTML()
{
    //  alert("commentL", uiCommentsL);
    var HTMLcode = "";
    HTMLcode = HTMLcode +
        "<html>\n" +
        "  <head>\n" +
        "  <TITLE>IMAGE COMPARATOR   for Photoshop    by RONC</TITLE>\n" +
        '  <link rel="stylesheet" \n' +
        '     type = "text/css"\n' +
        '     href="https://cdn.knightlab.com/libs/juxtapose/latest/css/juxtapose.css">\n' +
        '<style>\n' +
        '  .modal {\n' +
        '    display: none;\n' +
        '    position: fixed;\n' +
        '    z-index: 25;\n' +
        '    padding-top: 100px;\n' +
        '    left: 0;\n' +
        '    top: 0;\n' +
        '    width: 100%;\n' +
        '    height: 100%;\n' +
        '    overflow: auto;\n' +
        '    background-color: rgb(0, 0, 0);\n' +
        '    background-color: rgba(0, 0, 0, 0.25);\n' +
        '  }\n' +

        '  .modal-content {\n' +
        '    background-color: #242424;\n' +
        '    margin: auto;\n' +
        '    padding: 2px 28px;\n' +
        //'    border: 1px solid #404040;\n' +
        '    width: 30%;\n' +
        '    color: #ffffff;\n' +
        '  }\n' +

        '  .close {\n' +
        '    color: #ff0000;\n' +
        '    float: right;\n' +
        '    font-size: 20px;\n' +
        '    font-weight: bold;\n' +
        '  }\n' +

        '  .close:hover,\n' +
        '  .close:focus {\n' +
        '    color: #ffffff;\n' +
        '    text-decoration: none;\n' +
        '    cursor: pointer;\n' +
        '  }\n' +

        '  .button {\n' +
        '    background-color: #242424;\n' +
        '    border: 2px solid #505050;\n' +
        '    color: white;\n' +
        '    padding: 3px 1px;\n' +
        '    text-align: center;\n' +
        '    text-decoration: none;\n' +
        '    display: inline-block;\n' +
        '    font-size: 14px;\n' +
        '    margin: 2px 2px;\n' +
        '    cursor: pointer;\n' +
        '  }\n' +

        '</style>\n' +
        "<style>\n" +
        "  body\n" +
        "  {  \n" +
        "    background-color:#242424;\n" +
        "    color:white;\n" +
        "    font-family: Arial, san-serif;\n" +
        "  }\n" +

        "   :link {        color: #ffffff;      }\n" +

        "  table\n" +
        "  {\n" +
        "    display: table;\n" +
        "    border-spacing: 0;\n" +
        "    border-color: #404040;\n" +
        "  }\n" +

        "  pre\n" +
        "  {\n" +
        "    white-space: pre-wrap !important;\n" +
        "  }\n" +

        "  .ICstyle\n" +
        "  {\n" +
        "    vertical-align: top;\n" +
        "    word-wrap: break-word;\n" +
        "    font-size: 10px;\n" +
        "    font-weight: 550;\n" +
        "  }\n" +

        "  div.scrollable {\n" +
        "    width: 100%;\n" +
        "    height: 100%;\n" +
        "    margin: 0;\n" +
        "    padding: 0;\n" +
        "    overflow: auto;\n" +
        "  }\n" +

        "  div.jx-control {\n" +
        "    height: 100%;\n" +
        "    margin-right: auto;\n" +
        "    margin-left: auto;\n" +
        "    width: 1px;\n" +
        "    background-color: #ffffff;\n" +
        "    box-shadow: 1px 0 0 #000000, -1px 0 0 #000000;\n" +
        "    -moz-box-shadow: 1px 0 0 #000000, -1px 0 0 #000000;\n" +
        "    -webkit-box-shadow: 1px 0 0 #000000, -1px 0 0 #000000;\n" +
        "    opacity: 0.75;\n" +
        "  }\n" +

        "  .vertical div.jx-control {\n" +
        "    height: 1px;\n" +
        "    width: 100%;\n" +
        "    background-color: #ffffff;\n" +
        "    box-shadow: 0 1px 0 #000000, 0 -1px 0 #000000;\n" +
        "    -moz-box-shadow: 0 1px 0 #000000, 0 -1px 0 #000000;\n" +
        "    -webkit-box-shadow: 0 1px 0 #000000, 0 -1px 0 #000000;\n" +
        "    opacity: 0.75;\n" +
        "    position: relative;\n" +
        "    top: 50%;\n" +
        "    transform: translateY(-50%);\n" +
        "  }\n" +

        "  div.jx-arrow.jx-left {\n" +
        "    left: -" + uiArrowSpace + "px;\n" +
        "    border-style: solid;\n" +
        "    border-width: " + uiArrowSize + "px " + uiArrowSize + "px " +
        uiArrowSize + "px 0;\n" +
        "    border-color: transparent #ffffff transparent transparent;\n" +
        "    opacity: " + uiArrowOpacity + ";\n" +
        "  }\n" +

        "  div.jx-arrow.jx-right {\n" +
        "    right: -" + uiArrowSpace + "px;\n" +
        "    border-style: solid;\n" +
        "    border-width: " + uiArrowSize + "px 0 " + uiArrowSize + "px " +
        uiArrowSize + "px;\n" +
        "    border-color: transparent transparent transparent #ffffff ;\n" +
        "    opacity: " + uiArrowOpacity + ";\n" +
        "  }\n" +

        "  .vertical div.jx-arrow.jx-left {\n" +
        "    left: 0;\n" +
        "    top: -" + uiArrowSpace + "px;\n" +
        "    border-style: solid;\n" +
        "    border-width: 0 " + uiArrowSize + "px " + uiArrowSize + "px " +
        uiArrowSize + "px;\n" +
        "    border-color: transparent transparent #ffffff transparent;\n" +
        "    opacity: " + uiArrowOpacity + ";\n" +
        "  }\n" +

        "  .vertical div.jx-arrow.jx-right {\n" +
        "    right: 0;\n" +
        "    top: initial;\n" +
        "    bottom: -" + uiArrowSpace + "px;\n" +
        "    border-style: solid;\n" +
        "    border-width: " + uiArrowSize + "px " + uiArrowSize + "px 0 " +
        uiArrowSize + "px;\n" +
        "    border-color: #ffffff transparent transparent transparent;\n" +
        "    opacity: " + uiArrowOpacity + ";\n" +
        "  }\n" +

        "  div.jx-controller {\n" +
        "    position: absolute;\n" +
        "    margin: auto;\n" +
        "    top: 0;\n" +
        "    bottom: 0;\n" +
        "    height: 60px;\n" +
        "    width: 9px;\n" +
        "    margin-left: -3px;\n" +
        "    background-color: #000000;\n" +
        "    opacity: 0.001;\n" +
        "  }\n" +

        "  .vertical div.jx-controller {\n" +
        "    height: 9px;\n" +
        "    width: 100px;\n" +
        "    margin-left: auto;\n" +
        "	   margin-right: auto;\n" +
        "    top: -3px;\n" +
        "	   position: relative;\n" +
        "    opacity: 0.001;\n" +
        "  }\n" +
        "</style>\n" +

        "</head>\n" +

        "<body>\n" +
        "  <center>\n" +
        "  <table border='2'>\n" +
        "    <tr>\n" +
        "      <td colspan='3'>\n" +
        "        <center>\n" +
        "          <div style='font-size: 24px; font-weight: bold; font-style: italic;'>IMAGE COMPARATOR &nbsp;&nbsp;for Photoshop&nbsp;&nbsp;by RONC</div>\n" +
        scriptVersion + "\n" +
        /*   '         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="mailto:rechmbrs@gmail.com?Subject=IC2.00" target="_top">(  E-MAIL  )</a>\n' + */
        '         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n' +
        '<button class="button" id="myBtn">DIRECTIONS</button>\n' +
        '</center>\n' +
        '       <div id="myModal" class="modal">\n' +
        '         <div class="modal-content">\n' +
        '           <span class="close">&times;</span>\n' +
        '           <p style="font-size: 14px;">DIRECTIONS:<br>&nbsp;&nbsp;&nbsp;&nbsp;To move the location of the image splice, touch the tip of your cursor or finger to the black and white line separating the two images.<br>OR\n' +
        '             <br>&nbsp;&nbsp;&nbsp;&nbsp;You can also touch the tip of your cursor or finger to any location within the two images and the splice location will move to that point.</p>\n' +
        '         </div>\n' +
        '       </div>\n' +

        '       <script>\n' +
        '         var modal = document.getElementById("myModal");\n' +
        '         var btn = document.getElementById("myBtn");\n' +
        '         var span = document.getElementsByClassName("close")[0];\n' +

        '         btn.onclick = function ()\n' +
        '         { \n' +
        '           modal.style.display = "block";\n' +
        '         }\n' +

        '         span.onclick = function ()\n' +
        '         { \n' +
        '           modal.style.display = "none";\n' +
        '         }\n' +

        '         window.onclick = function (event)\n' +
        '         { \n' +
        '           if (event.target == modal)\n' +
        '           {\n' +
        '             modal.style.display = "none";\n' +
        '           }\n' +
        '         }\n' +

        '       </script>\n' +
        "     </td>\n" +
        "  </tr>\n" +

        "  <tr>\n" +
        "    <td  rowspan = '3' align='center' width = 'imageWidth'  height ='imageHeight'>\n" +
        "      <table width = 'imageWidth'  height ='imageHeight'>\n" +
        "        <tr>\n" +
        "          <td>\n" +

        '            <div class=scrollable>\n' +
        '              <div class="juxtapose" data-startingposition="50%" data-showlabels="true" data-showcredits="false" data-animate="true" data-mode="' +
        uiHorVer + '">\n' +
        '<img class="left" src="' + uiFilenameL + uiFiletypeIn + '" data-label="' +
        uiSelectionL + '" alt="LEFT-TOP" data-credit=""/>\n' +
        '<img class="right" src="' + uiFilenameR + uiFiletypeIn + '" data-label="' +
        uiSelectionR + '" alt="RIGHT-BOTTOM" data-credit=""/>\n' +
        '              </div>\n' +
        '            </div>\n' +

        '            <script src="https://cdn.knightlab.com/libs/juxtapose/latest/js/juxtapose.min.js"></script>\n' +

        "          </td>\n" +
        "        </tr>\n" +
        "      </table>\n" +
        "      </td>\n" +
        "      <td class='ICstyle'>\n" +
        "<pre>\n" +
        uiCommentsL + "&nbsp;&nbsp;\n" +
        "Location:&nbsp;" + uiFoldername + "<br>/" + uiFilenameL + uiFiletypeIn +
        "&nbsp;&nbsp;\n" +
        "</pre>\n" +
        "      </td>\n" +
        "    </tr>\n" +

        "    <tr>\n" +
        "      <td class='ICstyle'>\n" +
        "<pre>\n" +
        uiCommentsR + "&nbsp;&nbsp;\n" +
        "Location:&nbsp;" + uiFoldername + "<br>/" + uiFilenameR + uiFiletypeIn +
        "&nbsp;&nbsp;\n" +
        "</pre>\n" +
        "      </td>\n" +
        "    </tr>\n" +

        "    <tr>\n" +
        "      <td class='ICstyle'>\n" +
        "<pre>\n" +
        uiCommentsC + "&nbsp;&nbsp;\n" +
        "Location:&nbsp;" + uiFoldername + "<br>/" + uiFilename + ".html" +
        "&nbsp;&nbsp;\n" +
        "</pre>\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </table>\n" +
        "  </center>\n" +
        "</body>\n" +
        "</html>";
    //alert("here", HTMLcode);
    try
    {
        var HTML = new File(uiFoldername + "/" + uiFilename + ".html");
        HTML.open("w");
        HTML.writeln(HTMLcode);
        HTML.close();
        HTML.execute();
    }
    catch (e)
    {
        alert("Error, Can Not Open " + uiFoldername + "/" + uiFilename + ".html" +
            " in folder");
    };
}

main = function ()
{
    if (uiDone == 1) return;
    SelectLayerPNG_JPG();
    //alert("commentL", uiCommentsL);
    BuildWriteHTML();
    return;
};

if (hideLayerHistory == true)
{
    if (hideLayerPalette == true) hideLayers();
    if (hideHistoryPalette == true) app.activeDocument.suspendHistory(scriptName +
        ' Complete', 'main()');
}
else
{
    main()
}

"Image Comparator  " + uiDone
// EOF