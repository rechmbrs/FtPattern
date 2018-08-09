// Zero Fill Number
function ZeroFillNum( maxNum, number)
{
  var numDigits = Math.log(maxNum) * Math.LOG10E + 1 | 0; // for positive numbers
  var filledNum = (number + Math.pow(10, numDigits)).toString().slice(-numDigits);
  //alert(" max " + maxNum + "\n num " + number + "\n numDigits " + numDigits + "\n math " + Math.pow(10, numDigits) + "\n fill " + filledNum);
  return filledNum;
};