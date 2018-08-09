//
//   REC-loadSymbols.js   02jul2017
//   Loading up the symbol definitions like this makes it possible
//   to include several of these generated files in one master file
//   provided a prefix is specified other than the default. It also
//   skips the definitions if PSConstants has already been loaded.
//

/*  // @include 'REC-loadSymbols.js' */

cTID = function (c)
{
  return app.charIDToTypeID(c);
};

sTID = function (s)
{
  return app.stringIDToTypeID(s);
};

REC_loadSymbols = function ()
{
  var dbgLevel = $.level;
  $.level = 0;
  try
  {
    PSConstants;
    return; // only if PSConstants is defined
  }
  catch (e)
  {}
  finally
  {
    $.level = dbgLevel;
  }
  var needDefs = true;
  $.level = 0;
  try
  {
    PSClass;
    needDefs = false;
  }
  catch (e)
  {}
  finally
  {
    $.level = dbgLevel;
  }
  if (needDefs)
  {
    PSClass = function () {};
    PSEnum = function () {};
    PSEvent = function () {};
    PSForm = function () {};
    PSKey = function () {};
    PSType = function () {};
    PSUnit = function () {};
    PSString = function () {};
  }

  // We may still end up duplicating some of the following definitions
  // but at least we don't redefine PSClass, etc... and wipe out others
  PSClass.Action = cTID('Actn');
  PSClass.ActionSet = cTID('ASet');
  PSClass.AdjustmentLayer = cTID('AdjL');
  PSClass.CMYKColor = cTID('CMYC');
  PSClass.Channel = cTID('Chnl');
  PSClass.ChannelMatrix = cTID('ChMx');
  PSClass.Color = cTID('Clr ');
  PSClass.ColorSampler = cTID('ClSm');
  PSClass.ColorStop = cTID('Clrt');
  PSClass.CurvesAdjustment = cTID('CrvA');
  PSClass.Document = cTID('Dcmn');
  PSClass.Ellipse = cTID('Elps');
  PSClass.Gradient = cTID('Grdn');
  PSClass.GradientMap = cTID('GdMp');
  PSClass.GrayscaleMode = cTID('Grys');
  PSClass.HSBColor = cTID('HSBC');
  PSClass.HistoryState = cTID('HstS');
  PSClass.HueSatAdjustmentV2 = cTID('Hst2');
  PSClass.HueSaturation = cTID('HStr');
  PSClass.JPEGFormat = cTID('JPEG');
  PSClass.Layer = cTID('Lyr ');
  PSClass.LayerEffects = cTID('Lefx');
  PSClass.LevelsAdjustment = cTID('LvlA');
  PSClass.Mask = cTID('Msk ');
  PSClass.Null = cTID('null');
  PSClass.PhotoshopPDFFormat = cTID('PhtP');
  PSClass.Pixel = cTID('Pxel');
  PSClass.PNGFormat = cTID('PNGF');
  PSClass.Point = cTID('Pnt ');
  PSClass.Polygon = cTID('Plgn');
  PSClass.Property = cTID('Prpr');
  PSClass.Rectangle = cTID('Rctn');
  PSClass.RGBColor = cTID('RGBC');
  PSClass.RGBColorMode = cTID('RGBM');
  PSClass.SingleColumn = cTID('Sngc');
  PSClass.SingleRow = cTID('Sngr');
  PSClass.Snapshot = cTID('SnpS');
  PSClass.TransparencyStop = cTID('TrnS');
  PSClass.Version = cTID('Vrsn');

  PSEnum.All = cTID('Al  ');
  PSEnum.AntiAliasNone = cTID('Anno');
  PSEnum.Background = cTID('Bckg');
  PSEnum.Black = cTID('Blck');
  PSEnum.Center = cTID('Cntr');
  PSEnum.Composite = cTID('Cmps');
  PSEnum.Custom = cTID('Cst ');
  PSEnum.CustomStops = cTID('CstS');
  PSEnum.Difference = cTID('Dfrn');
  PSEnum.First = cTID('Frst');
  PSEnum.ForegroundColor = cTID('FrgC');
  PSEnum.Forward = cTID('Frwr');
  PSEnum.FullDocument = cTID('FllD');
  PSEnum.GaussianDistribution = cTID('Gsn ');
  PSEnum.Gray = cTID('Gry ');
  PSEnum.InnerBevel = cTID('InrB');
  PSEnum.Left = cTID('Left');
  PSEnum.LightPosLeft = cTID('LPLf');
  PSEnum.Luminosity = cTID('Lmns');
  PSEnum.MaskedAreas = cTID('MskA');
  PSEnum.Multiply = cTID('Mltp');
  PSEnum.No = cTID('N   ');
  PSEnum.None = cTID('None');
  PSEnum.Normal = cTID('Nrml');
  PSEnum.Null = cTID('null');
  PSEnum.Overlay = cTID('Ovrl');
  PSEnum.PNGFilterAdaptive = cTID('PGAd');
  PSEnum.PNGInterlaceNone = cTID('PGIN');
  PSEnum.Previous = cTID('Prvs');
  PSEnum.QCSCorner0 = cTID('Qcs0');
  PSEnum.QCSSide0 = cTID('Qcs4');
  PSEnum.QCSSide1 = cTID('Qcs5');
  PSEnum.QCSSide2 = cTID('Qcs6');
  PSEnum.QCSSide3 = cTID('Qcs7');
  PSEnum.RGB = cTID('RGB ');
  PSEnum.Right = cTID('Rght');
  PSEnum.Small = cTID('Sml ');
  PSEnum.Target = cTID('Trgt');
  PSEnum.Top = cTID('Top ');
  PSEnum.Transparency = cTID('Trsp');
  PSEnum.UserStop = cTID('UsrS');
  PSEnum.White = cTID('Wht ');
  PSEnum.Wrap = cTID('Wrp ');

  PSEvent.Add = cTID('Add ');
  PSEvent.CanvasSize = cTID('CnvS');
  PSEvent.Close = cTID('Cls ');
  PSEvent.Clouds = cTID('Clds');
  PSEvent.Copy = cTID('copy');
  PSEvent.CopyToLayer = cTID('CpTL');
  PSEvent.Crop = cTID('Crop');
  PSEvent.Curves = cTID('Crvs');
  PSEvent.Custom = cTID('Cstm');
  PSEvent.Delete = cTID('Dlt ');
  PSEvent.Desaturate = cTID('Dstt');
  PSEvent.Duplicate = cTID('Dplc');
  PSEvent.Filter = cTID('Fltr');
  PSEvent.Feather = cTID('Fthr');
  PSEvent.Fill = cTID('Fl  ');
  PSEvent.Flip = cTID('Flip');
  PSEvent.Hide = cTID('Hd  ');
  PSEvent.HighPass = cTID('HghP');
  PSEvent.Inverse = cTID('Invs');
  PSEvent.Invert = cTID('Invr');
  PSEvent.Levels = cTID('Lvls');
  PSEvent.Median = cTID('Mdn ');
  PSEvent.Make = cTID('Mk  ');
  PSEvent.MergeLayers = cTID('Mrg2');
  PSEvent.Move = cTID('move');
  PSEvent.Null = cTID('null');
  PSEvent.Offset = cTID('Ofst');
  PSEvent.PasteInto = cTID('PstI');
  PSEvent.Plaster = cTID('Plst');
  PSEvent.Play = cTID('Ply ');
  //PSEvent.Rasterize = cTID('Rstr');
  PSEvent.Rasterize = sTID('rasterizeLayer');
  PSEvent.Reset = cTID('Rset');
  PSEvent.Ripple = cTID('Rple');
  PSEvent.Rotate = cTID('Rtte');
  PSEvent.Save = cTID('save');
  PSEvent.Select = cTID('slct');
  PSEvent.Set = cTID('setd');
  PSEvent.Show = cTID('Shw ');
  PSEvent.Stop = cTID('Stop');
  PSEvent.Subtract = cTID('Sbtr');
  PSEvent.Threshold = cTID('Thrs');
  PSEvent.Transform = cTID('Trnf');
  PSEvent.UnsharpMask = cTID('UnsM');

  PSKey.Adjustment = cTID('Adjs');
  PSKey.Amount = cTID('Amnt');
  PSKey.Angle = cTID('Angl');
  PSKey.AntiAlias = cTID('AntA');
  PSKey.As = cTID('As  ');
  PSKey.Axis = cTID('Axis');
  PSKey.BevelEmboss = cTID('ebbl');
  PSKey.BevelStyle = cTID('bvlS');
  PSKey.Black = cTID('Blck');
  PSKey.Blue = cTID('Bl  ');
  PSKey.Blur = cTID('blur');
  PSKey.Bottom = cTID('Btom');
  PSKey.Brightness = cTID('Brgh');
  PSKey.Color = cTID('Clr ');
  PSKey.ColorIndicates = cTID('ClrI');
  PSKey.Colorize = cTID('Clrz');
  PSKey.Colors = cTID('Clrs');
  PSKey.Continue = cTID('Cntn');
  PSKey.Compression = cTID('Cmpr');
  PSKey.ConstrainProportions = cTID('CnsP');
  PSKey.Copy = cTID('Cpy ');
  PSKey.CurrentHistoryState = cTID('CrnH');
  PSKey.Curve = cTID('Crv ');
  PSKey.Cyan = cTID('Cyn ');
  PSKey.Depth = cTID('Dpth');
  PSKey.Distance = cTID('Dstn');
  PSKey.Distribution = cTID('Dstr');
  PSKey.DocumentID = cTID('DocI');
  PSKey.Duplicate = cTID('Dplc');
  PSKey.Enabled = cTID('enab');
  PSKey.Exposure = cTID('Exps');
  PSKey.ExtendedQuality = cTID('EQlt');
  PSKey.Fill = cTID('Fl  ');
  PSKey.FreeTransformCenterState = cTID('FTcs');
  PSKey.From = cTID('From');
  PSKey.Gamma = cTID('Gmm ');
  PSKey.GlobalLightingAngle = cTID('gagl');
  PSKey.Gradient = cTID('Grad');
  PSKey.Green = cTID('Grn ');
  PSKey.Group = cTID('Grup');
  PSKey.Height = cTID('Hght');
  PSKey.HighlightLevels = cTID('HghL');
  PSKey.HighlightOpacity = cTID('hglO');
  PSKey.Horizontal = cTID('Hrzn');
  PSKey.Hue = cTID('H   ');
  PSKey.ID = cTID('Idnt');
  PSKey.ImageBalance = cTID('ImgB');
  PSKey.In = cTID('In  ');
  PSKey.InnerShadow = cTID('IrSh');
  PSKey.Input = cTID('Inpt');
  PSKey.Interpolation = cTID('Intr');
  PSKey.LayerID = cTID('LyrI');
  PSKey.Left = cTID('Left');
  PSKey.Level = cTID('Lvl ');
  PSKey.LightPosition = cTID('LghP');
  PSKey.Lightness = cTID('Lght');
  PSKey.Location = cTID('Lctn');
  PSKey.LowerCase = cTID('LwCs');
  PSKey.Magenta = cTID('Mgnt');
  PSKey.MakeVisible = cTID('MkVs');
  PSKey.Matrix = cTID('Mtrx');
  PSKey.MatteColor = cTID('MttC');
  PSKey.Merge = cTID('Mrge');
  PSKey.Message = cTID('Msge');
  PSKey.Midpoint = cTID('Mdpn');
  PSKey.MidtoneLevels = cTID('MdtL');
  PSKey.Mode = cTID('Md  ');
  PSKey.Monochromatic = cTID('Mnch');
  PSKey.Method = cTID('Mthd');
  PSKey.Name = cTID('Nm  ');
  PSKey.New = cTID('Nw  ');
  PSKey.Null = cTID('null');
  PSKey.Offset = cTID('Ofst');
  PSKey.Opacity = cTID('Opct');
  PSKey.PNGFilter = cTID('PNGf');
  PSKey.PNGInterlaceType = cTID('PGIT');
  PSKey.Points = cTID('Pts ');
  PSKey.Position = cTID('Pstn');
  PSKey.PreserveLuminosity = cTID('PrsL');
  PSKey.PreserveTransparency = cTID('PrsT');
  PSKey.Radius = cTID('Rds ');
  PSKey.Red = cTID('Rd  ');
  PSKey.Relative = cTID('Rltv');
  PSKey.Right = cTID('Rght');
  PSKey.RippleSize = cTID('RplS');
  PSKey.Saving = cTID('Svng');
  PSKey.Scale = cTID('Scl ');
  PSKey.Sharpness = cTID('Shrp');
  PSKey.ShadowLevels = cTID('ShdL');
  PSKey.ShadowOpacity = cTID('sdwO');
  PSKey.Smoothness = cTID('Smth');
  PSKey.Start = cTID('Strt');
  PSKey.Strength = cTID('srgh');
  PSKey.Target = cTID('null');
  PSKey.Threshold = cTID('Thsh');
  PSKey.To = cTID('T   ');
  PSKey.ToggleOthers = cTID('TglO');
  PSKey.Tolerance = cTID('Tlrn');
  PSKey.Top = cTID('Top ');
  PSKey.Transparency = cTID('Trns');
  PSKey.Type = cTID('Type');
  PSKey.Using = cTID('Usng');
  PSKey.Vertical = cTID('Vrtc');
  PSKey.What = cTID('What');
  PSKey.Width = cTID('Wdth');
  PSKey.With = cTID('With');
  PSKey.Yellow = cTID('Ylw ');

  PSString.addToSelection = sTID('addToSelection');
  PSString.addToSelectionContinuous = sTID('addToSelectionContinuous');
  PSString.automaticInterpolation = sTID('automaticInterpolation');
  PSString.blendDivide = sTID('blendDivide');
  PSString.blendSubtraction = sTID('blendSubtraction');
  PSString.canvasExtensionColorType = sTID('canvasExtensionColorType');
  PSString.canvasSize = sTID('canvasSize');
  PSString.contentLayer = sTID('contentLayer');
  PSString.copy = sTID('copy');
  PSString.copyToLayer = sTID('copyToLayer');
  PSString.description = sTID('description');
  PSString.documentID = sTID('documentID');
  PSString.exposure = sTID('exposure');
  PSString.fillOpacity = sTID('fillOpacity');
  PSString.forceNotify = sTID('forceNotify');
  PSString.gammaCorrection = sTID('gammaCorrection');
  PSString.highPass = sTID('highPass');
  PSString.imageStackPlugin = sTID('imageStackPlugin');
  PSString.layerLocking = sTID('layerLocking');
  PSString.layerSection = sTID('layerSection');
  PSString.layerStyle = sTID('layerStyle');
  PSString.linearDodge = sTID('linearDodge');
  PSString.mergeLayers = sTID('mergeLayersNew');
  PSString.null = sTID('null');
  PSString.pasteInto = sTID('pasteInto');
  PSString.patternFill = sTID('patternFill');
  PSString.pdfCompressionType = sTID('pdfCompressionType');
  PSString.pdfDownsampleResolution = sTID('pdfDownsampleResolution');
  PSString.pdfPresetFilename = sTID('pdfPresetFilename');
  PSString.pdfRegistryName = sTID('pdfRegistryName');
  PSString.pdfThresholdResolution = sTID('pdfThresholdResolution');
  PSString.phase = sTID('phase');
  PSString.PNGFilter = sTID('PNGFilter');
  PSString.PNGFormat = sTID('PNGFormat');
  PSString.present = sTID('present');
  PSString.presetKind = sTID('presetKind');
  PSString.presetKindCustom = sTID('presetKindCustom');
  PSString.presetKindDefault = sTID('presetKindDefault');
  PSString.presetKindType = sTID('presetKindType');
  PSString.protectAll = sTID('protectAll');
  PSString.rasterize = sTID('rasterize');
  PSString.rasterizeItem = sTID('rasterizeItem');
  PSString.removeFromSelection = sTID('removeFromSelection');
  PSString.scaleStyles = sTID('scaleStyles');
  PSString.selection = sTID('selection');
  PSString.selectionModifier = sTID('selectionModifier');
  PSString.selectionModifierType = sTID('selectionModifierType');
  PSString.showInDialog = sTID('showInDialog');
  PSString.unsharpMask = sTID('unsharpMask');
  PSString.useLegacy = sTID('useLegacy');

  PSType.AntiAlias = cTID('Annt');
  PSType.BevelEmbossStyle = cTID('BESl');
  PSType.BlendMode = cTID('BlnM');
  PSType.ColorStopType = cTID('Clry');
  PSType.FillContents = cTID('FlCn');
  PSType.FillMode = cTID('FlMd');
  PSType.GradientForm = cTID('GrdF');
  PSType.HorizontalLocation = cTID('HrzL');
  PSType.Interpolation = cTID('Intp');
  PSType.MaskIndicator = cTID('MskI');
  PSType.Ordinal = cTID('Ordn');
  PSType.Orientation = cTID('Ornt');
  PSType.QuadCenterState = cTID('QCSt');
  PSType.VerticalLocation = cTID('VrtL');
  PSType.YesNo = cTID('YsN ');

  PSUnit.Angle = cTID('#Ang');
  PSUnit.Density = cTID('#Rsl');
  PSUnit.Distance = cTID('#Rlt');
  PSUnit.Percent = cTID('#Prc');
  PSUnit.Pixels = cTID('#Pxl');
};

REC_loadSymbols(); // load up our symbols
//