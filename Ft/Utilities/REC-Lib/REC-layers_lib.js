/*   Hide layer pallette
    
// Includes an external .js file
// @include 'REC-layers_lib.js' 

*/
function hideLayers() {
    cTID = function(s) { return app.charIDToTypeID(s); };    
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Mn  '), cTID('MnIt'), cTID('Tgly'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('slct'), desc1, DialogModes.NO);
};