// Script Expiration

// var yx = "2050";
// var mx = "01";
// var dx = "01";
// //@include 'REC-expire_lib.js' 

var dte = new Date();
var y = "" + dte.getFullYear();
var m = "" + (dte.getDate() + 1);
var d = "" + dte.getDate();
if (m.length < 2) m = "0" + m;
if (d.length < 2) d = "0" + d;
var today = y + "/" + m + "/" + d;
var expire = yx + "/" + mx + "/" + dx;
if ( today >= expire )  
{ 
  alert("Script has Expired", today + "  " + expire);
  doabort();
}