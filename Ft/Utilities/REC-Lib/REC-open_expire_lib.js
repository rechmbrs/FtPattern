//  REC-open_lib.js
//
// Opening script
//   

/*  Sample for testing routine by itself
    var scriptName = 'PIXEL SHIFT De-COMPOSITOR (PSDC)';
    var scriptVersion = 'Version: 0.979  -  11Jan2017';
    var scriptAuthor = 'Ron Chambers  -  Property and Copyright 2017';
    var scriptAbstract = 'PSDC';
//
// license info
//
    var goLiveMonth = "08" // Month you want your content to start displaying. Two digits.
    var goLiveDay = "08" // Day you want your content to start displaying. Two digits.
    var goLiveYear = "2008" // Year you want your content to start displaying. Four digits.

    var expireMonth = "05" // Month you want your content to stop displaying. Two digits.
    var expireDay = "30" // Day you want your content to stop displaying. Two digits.
    var expireYear = "2023" // Year you want your content to stop displaying. Four digits.

// Includes an external .js file
// @include 'REC-open_lib.js' 
*/

//var docRef = app.activeDocument;

//var good2go = autoExpire();
//if (good2go == 1 ) doabort ();

var dlg = new Window('dialog', scriptName);
dlg.alignment = "center";
dlg.openPnl = dlg.add('panel', undefined, scriptAuthor);
var bga = dlg.openPnl.add ("group");
bga.orientation = "column";
bga.alignment = "center";
txt1 = bga.add('statictext', undefined, scriptVersion);
txt2 = bga.add('statictext', undefined, scriptAbstract);
var bg = dlg.openPnl.add ("group");
bg.orientation = "row";
bg.alignment = "center";
bg1 = bg.add ("button", undefined, "OK");
bg1.onClick = dobuild; 
bg2 = bg.add ("button", undefined, "Cancel");
bg2.onClick = doabort;
bg3 = bg.add ("button", undefined, "Help");
bg3.onClick = dohelp;
dlg.show();
//if (good2go == 2 ) doabort ();

function dobuild() {
   // alert("Congratulations - it all worked!");
    good2go = 0;
    dlg.close();
}

function doabort() {
   // alert("De-Congratulations - it all didn't worked!");
    good2go = 1;
    dlg.close();
    close();
}

function dohelp() {
    alert("Congratulations - need help");
    openURL("REC-help.html");
    dlg.close();
}

function openURL(url) {
  var fname = "shortcut.url";
  var shortcut = new File(Folder.temp + '/' + fname);
  shortcut.open('w');
  shortcut.writeln('[InternetShortcut]');
  shortcut.writeln('URL=' + url);
  shortcut.writeln();
  shortcut.close();
  shortcut.execute();
  shortcut.remove();
};

//
// license info
//
/* Note that we are setting all the dates and date parts to strings to do our comparisons. */

function autoExpire() {


    /* This is where you put your content. Make sure you escape any quotation marks with a backslash. Make sure you do not delete the opening and closing quotes. */
    var myContent = "This text will display, <strong>beginning and ending</strong> on the dates you have set."

    /* Don't edit below this line. Don */

    var goLiveDate = goLiveYear + goLiveMonth + goLiveDay; // puts START year, month, and day together.
    var expireDate = expireYear + expireMonth + expireDay; // puts EXPIRE year, month, and day together.

    var nowDate = new Date();
    var day = nowDate.getUTCDate();
    var month = nowDate.getUTCMonth();
    var correctedMonth = month + 1; //month - JavaScript starts at "0" for January, so we add "1"

    if (correctedMonth < 10) { /* if less than "10", put a "0" in front of the number. */
        correctedMonth = "0" + correctedMonth;
    }

    if (day < 10) { /* if less than "10", put a "0" in front of the number. */
        day = "0" + day;
    }

    var year = nowDate.getYear(); /* Get the year. Firefox and Netscape might use century bit, and two-digit year. */
    if (year < 1900) {
        year = year + 1900; /*This is to make sure Netscape AND FireFox doesn't show the year as "107" for "2007." */
    }

    var GMTdate = year + "" + correctedMonth + "" + day; //corrected month GMT date.

    var good2go = 0;
    if ((GMTdate <= expireDate) && (GMTdate >= goLiveDate)) {
        //document.write(myContent)
        good2go = 1;
    }
    return good2go;
}
