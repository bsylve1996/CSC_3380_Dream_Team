"use strict";

var timeout    = 500;
var closetimer = 0;
var ddmenuitem = 0;

function mcds_open(event)
{
   mcds_canceltimer();
   mcds_close();
   var submenu = $(this).find('ul');
   if(submenu)
   {
      ddmenuitem = submenu.css('visibility', 'visible');
      return false;
   }
   return true;
}

function mcds_setMonthStrings(monthStringArray)
{
   for (var i = 0; i < monthStringArray.length; i++)
   {
      $(document).find('div#month' + i).text(monthStringArray[i]);
   }
   
   mcds_setDate(mcds_getMonth(), mcds_getYear(), mcds_getEpoch());
}


function mcds_setDigitStrings(digitStringArray)
{
   for (var i = 0; i < 4; i++)
   {
      $(document).find('div#millenium' + i).text(digitStringArray[i]);
   }
   
   for (var i = 0; i < 10; i++)
   {
      $(document).find('div#century' + i).text(digitStringArray[i]);
      $(document).find('div#decade' + i).text(digitStringArray[i]);
      $(document).find('div#year' + i).text(digitStringArray[i]);
   }
   
   mcds_setDate(mcds_getMonth(), mcds_getYear(), mcds_getEpoch());
}


function mcds_setEpochStrings(epochStringArray)
{
   $(document).find('div#epochAD').text(epochStringArray[0]);
   $(document).find('div#epochBC').text(epochStringArray[1]);
   
   mcds_setDate(mcds_getMonth(), mcds_getYear(), mcds_getEpoch());
}


function mcds_eventHandler(event)
{

   var v = $(this).find('span.val').html();

   var txt = $(this).find('div').html();
   
   var x = $(this).parent().parent().find('div');
   var a = x.attr('id');
   var p = $(this).parent().parent().find('div#' + a);
   $(p).text(txt);
   
   var valNode = $(this).parent().parent().find('span#' + a + "Val");
   $(valNode).text(v);
   
   mcds_setDate(mcds_getMonth(), mcds_getYear(), mcds_getEpoch());
   
   // Fire custom event.
   jQuery(document).trigger('month_changed_event', {month: Number(mcds_getMonth()),
                                                    year: Number(mcds_getYear()),
                                                    epoch:mcds_getEpoch()});
}


function mcds_getDate(root)
{
   var m = $(root).find('div#month').html();
   var ym = $(root).find('div#millenium').html();
   var yc = $(root).find('div#century').html();
   var yd = $(root).find('div#decade').html();
   var y = $(root).find('div#year').html();
   var e = $(root).find('div#epoch').html();
   
   var month = $(document).find('span#monthVal').html();
   var millenium = $(document).find('span#milleniumVal').html();
   var century = $(document).find('span#centuryVal').html();
   var decade = $(document).find('span#decadeVal').html();
   var year = $(document).find('span#yearVal').html();
   var epoch = $(document).find('span#epochVal').html();
   
   //return m + ym+yc+yd+y + e;
   return month + millenium + century + decade + year + epoch;
}

// A 'private' function (too bad there is no such thing in Javascript)
// that sets the string in the DateDisplay based on what the
// DateSelector is displaying.
function mcds_setDateDisplay()
{
   var titleStr = mcds_getMonthString();
   titleStr += " " + mcds_getYearString();
   titleStr += " " + mcds_getEpochString();
   $(document).find('div#DateDisplay').text(titleStr);
}

function mcds_getMonth()
{
   var month = $(document).find('span#monthVal').html();
   return month;
}

function mcds_getYear()
{
   var millenium = $(document).find('span#milleniumVal').html();
   var century = $(document).find('span#centuryVal').html();
   var decade = $(document).find('span#decadeVal').html();
   var year = $(document).find('span#yearVal').html();
   
   return (millenium * 1000) +
          (century * 100) +
          (decade * 10) +
          (year * 1);
}

function mcds_getEpoch()
{
   var epoch = $(document).find('span#epochVal').html();
   return epoch;
}

function mcds_getMonthString()
{
   var month = $(document).find('div#month').html();
   return month;
}

function mcds_getYearString()
{
   var yearArray = new Array();
   yearArray[0] = $(document).find('div#millenium').html();
   yearArray[1] = $(document).find('div#century').html();
   yearArray[2] = $(document).find('div#decade').html();
   yearArray[3] = $(document).find('div#year').html();
   
   var startIdx = 0;
   while(yearArray[startIdx] == 0 ||
         yearArray[startIdx] == "\u0966" ||
         yearArray[startIdx] == "\u3007" ||
         yearArray[startIdx] == "\u06f0")
   {
      startIdx++;
   }
      
   var yearStr = "";
   for (var i = startIdx; i < yearArray.length; i++)
   {
      yearStr += yearArray[i];
   }
   
   return yearStr;
}

function mcds_getEpochString()
{
   var epoch = $(document).find('div#epoch').html();
   return epoch;
}

function mcds_setDate(month, year, epoch)
{

   if (year == 0)
      year = 1;
      
   // Set month.
   $(document).find('span#monthVal').text(month);
   var monthStr = $(document).find('div#month' + month).html();
   $(document).find('div#month').text(monthStr);
   
   // Set year components.
   var milleniumVal = Math.floor(year / 1000);
   $(document).find('span#milleniumVal').text(milleniumVal);
   var milleniumStr = $(document).find('div#millenium' + milleniumVal).html();
   $(document).find('div#millenium').text(milleniumStr);
   
   
   var centuryVal = Math.floor((year % 1000) / 100);
   $(document).find('span#centuryVal').text(centuryVal);
   var centuryStr = $(document).find('div#century' + centuryVal).html();
   $(document).find('div#century').text(centuryStr);
   
   var decadeVal = Math.floor((year % 100) / 10);
   $(document).find('span#decadeVal').text(decadeVal);
   var decadeStr = $(document).find('div#decade' + decadeVal).html();
   $(document).find('div#decade').text(decadeStr);
   
   var yearVal = Math.floor((year % 10));
   $(document).find('span#yearVal').text(yearVal);
   var yearStr = $(document).find('div#year' + yearVal).html();
   $(document).find('div#year').text(yearStr);
   
   // Set epoch.
   $(document).find('span#epochVal').text(epoch);
   var epochStr = $(document).find('div#epoch' + epoch).html();
   $(document).find('div#epoch').text(epochStr);
   
   mcds_setDateDisplay();
}

function mcds_close()
{  if(ddmenuitem) ddmenuitem.css('visibility', 'hidden');}

function mcds_timer()
{  closetimer = window.setTimeout(mcds_close, timeout);}

function mcds_canceltimer()
{  if(closetimer)
   {  window.clearTimeout(closetimer);
      closetimer = null;}}

$(document).ready(function()
{  $('.mcds li').bind('click', mcds_open);
   $('.mcds li ul li').bind('click', mcds_eventHandler);
   $('.mcds > li').bind('mouseout',  mcds_timer);
   $('.mcds > li').bind('mouseover', mcds_canceltimer);
});

document.onclick = mcds_close;