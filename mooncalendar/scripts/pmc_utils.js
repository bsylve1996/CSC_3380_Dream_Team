"use strict";

function PMC_Utils()
{
   var svgns = "http://www.w3.org/2000/svg";
   var daycellInfo = [];
   var daycellLength = 42;
   var baseWidth = 8.0;
   var minimumPerigee = 356371.0;

   var baseRadius = 0.72;
   window.preferences = calendar_preferences.getInstance();
   var kilosToMiles = 0.621371;
   var numerics = {
                     "en":      [],
                     "de":      [],
                     "es":      [],
                     "he":      [],
                     "hi-IN":   [],
                     "ja":      [],
                     "zh-CN":   [],
                     "el":      [],
                     "ar":      [],
                     "default": []
                  };

   // Copied from http://stackoverflow.com/a/1985471/905566
   Array.prototype.rotate = (function()
   {
      var unshift = Array.prototype.unshift,
          splice = Array.prototype.splice;

      return function(count)
      {
         var len = this.length >>> 0,
             count = count >> 0;

         unshift.apply(this, splice.call(this, count % len, len));
         return this;
      };
   })();
   
   this.getBaseWidth = getBaseWidth;
   function getBaseWidth()
   {
      return baseWidth;
   }
   

   this.isHandheld = isHandheld;
   function isHandheld()
   {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf("android") > -1 ||
          ua.indexOf("mobile") > -1 ||
          ua.indexOf("iphone") > -1 ||
          ua.indexOf("ipod") > -1)
         return true;
      else
         return false;
   }
   
   this.detectIE = detectIE;
   function detectIE()
   {
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf('MSIE ');
      var trident = ua.indexOf('Trident/');

      if (msie > 0) {

          return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
      }
      
      if (!!navigator.userAgent.match(/Trident.*rv\:11\./))
         return true;

      if (trident > 0) {

          var rv = ua.indexOf('rv:');
          return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
      }

      return false;
   }
   
   this.fixIE = fixIE;
   function fixIE(evt)
   {
      if (detectIE())
      {
         var fixedWidth = "8in";
         var fixedHeight = "7.2in";

         var cal = document.getElementById("svg_calendar");
         cal.setAttribute("width", fixedWidth);
         cal.setAttribute("height", fixedHeight);
      }
   }
   

   function replaceDigits(inputStr)
   {
      for (var i = 0; i < 10; i++)
      {
         var re = new RegExp(i.toString(), "g");
         
         var replacement = numerics[window.preferences.values["language"]][i];
         inputStr = inputStr.replace(re, replacement);
      }
      
      return inputStr;
   }
   

   function infoString(phase, fraction, distance, julianDate)
   {
      var result = "";
      
      if (phase === NEW_MOON)
         result = "New Moon";
      else if (phase === FIRST_QUARTER)
         result = "First Quarter";
      else if (phase === FULL_MOON)
         result = "Full Moon";
      else if (phase === LAST_QUARTER)
         result = "Last Quarter";
      else if (phase === WANING_CRESCENT)
         result = "Waning Crescent";
      else if (phase === WAXING_CRESCENT)
         result = "Waxing Crescent";
      else if (phase === WANING_GIBBOUS)
         result = "Waning Gibbous";
      else if (phase === WAXING_GIBBOUS)
         result = "Waxing Gibbous";
         
      var jdCorrection = 0;
      if (phase !== NEW_MOON && phase !== FIRST_QUARTER && phase != LAST_QUARTER && phase !== FULL_MOON)
         jdCorrection += timezoneOffset();
         
      var percent = fraction * 100.0;
      
      result += " \u2022 " + percent.toFixed(1) + "% Illuminated";
      
      result += "<br />" + distance.toFixed(0) + " km \u2022 " +
                (distance * kilosToMiles).toFixed(0) + " mi";
      
      var tzo = timezoneOffset();
            
      var cal = getCalendarFromJD(julianDate + tzo);
         
      var format = cal.local.dateFormat;
      
      format = format.replace("mm", "MM");
      format = format.replace(/\//g, " ");
      format = format.replace(/\./g, " ");
      format = format.replace(/-/g, " ");
      format = format.replace(/,/g, " ");

      format += " \u2022 ";
           
      result += "<br />" + cal.name + " Calendar \u2022 ";
      result += (julianDate + jdCorrection).toFixed(1) + " JD";
      

      var tzs = astro_utils.timestringFromOffset(-tzo);
      var ho = ("0" + tzs.hours).slice(-2);
      var mo = ("0" + tzs.minutes).slice(-2);
      var tzStr = " UTC" + tzs.sign + ho + ":" + mo;
      
      var localWkday = cal.fromJD(julianDate);
      var localStr = cal.formatDate("DD \u2022 " + format, cal.fromJD(julianDate));
      
      var localts = astro_utils.timestringFromJulianDate2(julianDate);
      var timeSuffix = "";
      if (window.preferences.values["timeFormat"] === "12")
      {
         
         if (localts.hours >= 12)
         {
            localts.hours -= 12;
            timeSuffix = " pm";
         }
         else
         {
            timeSuffix = " am";
         }
         
         
         if (localts.hours === 0)
         {
            localts.hours = 12;
         }
            
      }
      
      var localH = ("0" + localts.hours).slice(-2);
      var localM = ("0" + localts.minutes).slice(-2);
      
      var localTimeString = "\u202A" + localH + ":" + localM + timeSuffix + tzStr;

      localStr += localTimeString;

      result += "<br />" + localStr;
      
      var utcStr = cal.formatDate("DD \u2022 " + format, cal.fromJD(julianDate + tzo));
      var utcts = astro_utils.timestringFromJulianDate2(julianDate + tzo);
      var utcH = ("0" + utcts.hours).slice(-2);
      var utcM = ("0" + utcts.minutes).slice(-2);
      utcStr += "\u202A" + utcH + ":" + utcM + " UTC";

      result += "<br />" + utcStr;
      
      result = replaceDigits(result);
           
      return result;
   }
   
   this.updateGrid = updateGrid;
   function updateGrid()
   {

      var ang = 0.0;
      
      var northUp = true;
      if (preferences.values["northUp"] === "false")
         northUp = false;
      
      if (northUp === false)
         ang = 180.0;
         
      var q1_phase2 = document.getElementById("q1_phase2");
      var q2_phase2 = document.getElementById("q2_phase2");
         
      q1_phase2.setAttribute("transform", "rotate(" + (ang + 180.0) + ", 12, 30)");
      q2_phase2.setAttribute("transform", "rotate(" + ang + ", 12, 60)");
      

      var gcChange = window.preferences.values["gregorianJD1"];
      var dayFirst = daycellInfo[0].julianDate;
      var dayLast = daycellInfo[daycellInfo.length - 2].julianDate;
      var calendarType = "Gregorian Calendar";
      if (gcChange >= dayFirst && gcChange <= dayLast)
         calendarType = "Julian/Gregorian Calendar"
      else if (gcChange < dayFirst)
         calendarType = "Gregorian Calendar";
      else
         calendarType = "Julian Calendar";
         
      
      var typeNode = document.getElementById("calendar_type");
      var content = typeNode.childNodes[0];
      content.nodeValue = calendarType;
     
      for (var i = 0; i < daycellLength; i++)
      {
         var r = daycellInfo[i].row;
         var c = daycellInfo[i].col;
         var phase = daycellInfo[i].phase;
         var fraction = daycellInfo[i].moon_illuminatedFraction;
         var distance = daycellInfo[i].moon_distance;
         var jd = daycellInfo[i].julianDate;
         var idTxt = "r" + r + "c" + c;         
         
         var state = daycellInfo[i].activeMonth;
         var dnode = document.getElementById(idTxt);

         var classStr = "";
         if (state == false)
            classStr = "inactive";
         else
            classStr = "active";
            
         var legend2 = document.getElementById("legend2_" + idTxt);
         legend2.setAttribute("transform", "");
            
         if (phase === NEW_MOON)
            classStr += " canonical new";
         else if (phase === FIRST_QUARTER)
         {
            classStr += " canonical first_quarter";
            legend2.setAttribute("transform", "rotate(" + (ang + 180.0) + ", 13, 88)");
         }
         else if (phase === FULL_MOON)
         {
            classStr += " canonical full";
            if (daycellInfo[i].blueMoon === true)
               classStr += " blue";
         }
         else if (phase === LAST_QUARTER)
         {
            classStr += " canonical last_quarter";
            legend2.setAttribute("transform", "rotate(" + ang + ", 13, 88)");
         }
         
         dnode.setAttribute("class", classStr);
         
         var tooltips = true;
         if (preferences.values["tooltips"] === "false")
            tooltips = false;
         
         // Set title text, for our tooltips. Also set enabled status.
         dnode.setAttribute("title", "");
         $("#" + idTxt).tooltip({show:{delay: 500},
                                 content: infoString(phase, fraction, distance, jd),
                                 track:true,
                                 disabled: !tooltips});
                              
         var tnode = document.getElementById("label_" + idTxt);
         var t = tnode.childNodes[0];
         var dateRep = numerics[window.preferences.values["language"]][daycellInfo[i].dateDisplay]; // New
         //t.nodeValue = daycellInfo[i].dateDisplay;
         t.nodeValue = dateRep;
      }
   }

   function updateRendering()
   {
      for (var i = 0; i < daycellLength; i++)
      {
         var scaling = preferences.values["scaling"];
         
         var scale = minimumPerigee / daycellInfo[i].moon_distance;
         
         if (scaling === "none")
            scale = 1.0;
         else if (scaling === "exaggerated")
            scale = Math.pow(scale, 4.0);
                  
         var row = daycellInfo[i].row;
         var col = daycellInfo[i].col;
         var label = "r"+row+"c"+col;
         
         var circleGroup = document.getElementById("circleGroup_" + label);
         var circ = document.getElementById("circle_" + label);
         var lArc = document.getElementById("leftArc_" + label);
         var rArc = document.getElementById("rightArc_" + label);
         
         var northUp = true;
         if (preferences.values["northUp"] === "false")
            northUp = false;
            
         var positionAngle = true;
         if (preferences.values["positionAngle"] === "false")
            positionAngle = false;
         

         var ang = astro_utils.toDegrees(daycellInfo[i].moon_positionAngle);
         
         if (positionAngle === false)
         {
            if (ang >= 0.0 && ang < 180.0)
               ang = 90.0;
            else
               ang = 270.0;
         }
         
         if (northUp === false)
         {
            ang += 180.0;
         }
         
         ang -= 90.0; ang = -ang;
         
         var frac = daycellInfo[i].moon_illuminatedFraction;
         
         circleGroup.setAttribute("transform", "rotate(" + ang + ") scale(" + scale + ")" );
         
         if (frac == 0.5)
         {
            circleGroup.setAttribute("class", "darkBackground");
            var lStr = "M 0," + (-baseRadius) + " A " + baseRadius + "," + baseRadius + " 0 1,0 0, " + baseRadius + " Z";
            lArc.setAttribute("d", lStr);
            rArc.setAttribute("rx", 0);
 
         }
         else if (frac == 1.0)
         {
            var excess = baseRadius;
            circleGroup.setAttribute("class", "darkBackground");
            var lStr = "M 0," + (-baseRadius) + " A " + baseRadius + "," + baseRadius + " 0 1,0 0, " + baseRadius + " Z";
            lArc.setAttribute("d", lStr);
            rArc.setAttribute("rx", excess);
         }
         else if (frac > 0.5)
         {
            var excess = 2.0 * (frac - 0.5) * baseRadius;
            
            circleGroup.setAttribute("class", "darkBackground");

            var lStr = "M 0," + (-baseRadius) + " A " + baseRadius + "," + baseRadius + " 0 1,0 0, " + baseRadius + " Z";
            lArc.setAttribute("d", lStr);
            rArc.setAttribute("rx", excess); 
         }
         else // frac < 0.5
         {
            var excess = 2.0 * (0.5 - frac) * baseRadius;
            // Less than half illuminated. Use a light background, and draw dark ellipses over it using mirror
            // image of above.
            circleGroup.setAttribute("class", "lightBackground");
            var lStr = "M 0," + (-baseRadius) + " A " + baseRadius + "," + baseRadius + " 0 1,1 0, " + baseRadius + " Z";
            lArc.setAttribute("d", lStr);
            rArc.setAttribute("rx", excess);
         }
      }
   }
   
   this.initGrid = initGrid;
   function initGrid(evt)
   {
      var grid = document.getElementById("calendar_grid");
      
      for (var row = 0; row < 6; row++)
      {
         var wkGroup = document.createElementNS(svgns, "g");
         wkGroup.setAttribute("id", "wk"+row);
         for (var col = 0; col < 7; col++)
         {
            var dayGroup = getDayGroup(row, col, row*7 + col);
            wkGroup.appendChild(dayGroup);
         }
         grid.appendChild(wkGroup);
      }
   }
   
   function getDayGroup(row, col, dayLabel)
   {
      var r = Math.floor(Math.random()*255); var g1 = Math.floor(Math.random()*255); var b1 = Math.floor(Math.random()*255);
      
      var _label = "r"+row+"c"+col;
      
      var dayGroup = document.createElementNS(svgns, "svg");
      dayGroup.setAttribute("id", _label);
      dayGroup.setAttribute("x", col * 100);
      dayGroup.setAttribute("y", row * 100);
      dayGroup.setAttribute("width", 100);
      dayGroup.setAttribute("height", 100);
      dayGroup.setAttribute("viewBox", "0 0 100 100");
      
      
      // Place cells slightly separated from one another.
      var background = document.createElementNS(svgns, "rect");
      background.setAttribute("class", "dateBackground");
      background.setAttribute("width", 99);
      background.setAttribute("height", 99);
      background.setAttribute("x", 0.5);
      background.setAttribute("y", 0.5);
      dayGroup.appendChild(background);
      
      var label = document.createElementNS(svgns, "text");
      label.setAttribute("id", "label_" + _label);
      label.setAttribute("class", "dateLabel");
      label.setAttribute("x", 92);
      label.setAttribute("y", 14);
      // Have to do this here; CSS requires a unit specifier, which we don't want.
      label.setAttribute("font-size", "10"); 
      var txt = document.createTextNode(dayLabel);
      label.appendChild(txt);
      dayGroup.appendChild(label);

      var legend1 = document.createElementNS(svgns, "circle");
      legend1.setAttribute("id", "legend1_" + _label);
      legend1.setAttribute("class", "legend1");
      legend1.setAttribute("cx", 13);
      legend1.setAttribute("cy", 88);
      legend1.setAttribute("r", 5);
      dayGroup.appendChild(legend1);
      
      var legend2 = document.createElementNS(svgns, "path");
      legend2.setAttribute("id", "legend2_" + _label);
      legend2.setAttribute("class", "legend2");
      legend2.setAttribute("transform", "rotate(0, 13, 88)");
      legend2.setAttribute("d", "M 13,93 A 5,5 0 1,0 13,83 Z");

      dayGroup.appendChild(legend2);
      
      // End experiment
      
      var phaseRendering = document.createElementNS(svgns, "svg");
      phaseRendering.setAttribute("class", "circleGroup");
      phaseRendering.setAttribute("x", "0");
      phaseRendering.setAttribute("y", "0");
      phaseRendering.setAttribute("width", "100");
      phaseRendering.setAttribute("height", "100");
      phaseRendering.setAttribute("viewBox", "-1 -1 2 2");
      
      var circleGroup = document.createElementNS(svgns, "g");
      circleGroup.setAttribute("id", "circleGroup_r"+row+"c"+col);
      circleGroup.setAttribute("class", "circleGroup");
      circleGroup.setAttribute("transform", "rotate(23)");
      
      var circ = document.createElementNS(svgns, "circle");
      circ.setAttribute("id", "circle_" + _label);
      circ.setAttribute("class", "circleBack");
      circ.setAttribute("cx", 0);
      circ.setAttribute("cy", 0);
      circ.setAttribute("r", baseRadius);
      circleGroup.appendChild(circ);
      
      var circ = document.createElementNS(svgns, "circle");
      circ.setAttribute("id", "circle_" + _label);
      circ.setAttribute("class", "circleFront");
      circ.setAttribute("cx", 0);
      circ.setAttribute("cy", 0);
      circ.setAttribute("r", baseRadius);
      circleGroup.appendChild(circ);
      
      var leftArc = document.createElementNS(svgns, "path");
      leftArc.setAttribute("id", "leftArc_" + _label);
      leftArc.setAttribute("class", "leftArc");
      leftArc.setAttribute("d", "M 0, " + (-baseRadius) + " A " + baseRadius + "+" + baseRadius + " 0 1,0 0," + baseRadius + " Z");
      circleGroup.appendChild(leftArc);
      
      var rightArc = document.createElementNS(svgns, "ellipse");
      rightArc.setAttribute("id", "rightArc_" + _label);
      rightArc.setAttribute("class", "rightArc");
      rightArc.setAttribute("cx", "0"); rightArc.setAttribute("cy", "0");
      rightArc.setAttribute("rx", "0"); rightArc.setAttribute("ry", baseRadius);
      circleGroup.appendChild(rightArc);
      
 
      phaseRendering.appendChild(circleGroup);
      dayGroup.appendChild(phaseRendering);
      
      return dayGroup;
   }
   
   this.initWeekdayLabels = initWeekdayLabels;
   function initWeekdayLabels(evt)
   {
      var bar = document.getElementById("weekday_bar");
      
      for (var col = 0; col < 7; col++)
      {
         var wkdayGroup = getWkdayGroup(col);
         bar.appendChild(wkdayGroup);
      }
   }
      
   function getWkdayGroup(col)
   {
      var weekdayGroup = document.createElementNS(svgns, "svg");
      weekdayGroup.setAttribute("id", "day"+col);
      weekdayGroup.setAttribute("x", col * 100);
      weekdayGroup.setAttribute("width", "100");
      weekdayGroup.setAttribute("height", "100%");
      weekdayGroup.setAttribute("viewBox", "0 0 100 30");
      
      var background = document.createElementNS(svgns, "rect");
      background.setAttribute("class", "wkdayBackground");
      background.setAttribute("x", 0);
      background.setAttribute("y", 0);
      background.setAttribute("width", "100");
      background.setAttribute("height", "100%");
      weekdayGroup.appendChild(background);
      
      var textnode = document.createElementNS(svgns, "text");
      textnode.setAttribute("id", "dayNode"+col);
      textnode.setAttribute("class", "weekday");
      textnode.setAttribute("x", "50%");
      textnode.setAttribute("y", "50%");
      
      var textspan = document.createElementNS(svgns, "tspan");
      textspan.setAttribute("id", "day"+col+"_txt");
      textspan.setAttribute("font-size", "1");
  
      textspan.setAttribute("dy", "0.4em");
      var weekdayName = document.createTextNode("weekday"+col);
      textspan.appendChild(weekdayName);
         
      textnode.appendChild(textspan);
      
      weekdayGroup.appendChild(textnode);
          
      return weekdayGroup;
   }
   

   this.setWeekdayLabels = setWeekdayLabels;
   function setWeekdayLabels(labels)
   {
  
      var rot = Number(preferences.values['firstDayOfWeek']);
      labels.rotate(rot);
      
      var longestIdx = 0;
      var longestString = 0;
      for (var i = 0; i < labels.length; i++)
      {
         var textspan = document.getElementById("day" + i + "_txt");
         var content = textspan.childNodes[0];
         content.nodeValue = labels[i];
         var s = textspan.getComputedTextLength();
         if (s > longestString)
         {
            longestIdx = i;
            longestString = s;
         }
      }
      
      // Now that we've found the longest string, increment the font size
      // of the element containing it until it just fits the allotted space.
      // Runs quick enough iteratively; if we get bored some day, we could
      // rewrite this to use a binary search-style iteration.
      var longestNode = document.getElementById("day" + longestIdx + "_txt");
      var con =  document.getElementById("dayNode" + longestIdx);
      var fontSize = 1;
      longestNode.setAttribute("font-size", fontSize);
  
      while (con.getBBox().width <= 65 && con.getBBox().height <= 20)
      {
         fontSize += 1;
         longestNode.setAttribute("font-size", fontSize);
      }

      for (var i = 0; i < labels.length; i++)
      {
         var node = document.getElementById("day" + i + "_txt");
         node.setAttribute("font-size", fontSize);
      }
   };
   
   // Compare the passed julianDate with the Gregorian change
   // date in Preferences, and return either a Gregorian or
   // Julian calendar based on result.
   function getCalendarFromJD(julianDate)
   {
      var jd1 = Number(preferences.values["gregorianJD1"]);
      var langStr = preferences.values["language"];
 
      if (julianDate >= jd1) // Return Gregorian calendar instance.
      {
         return $.calendars.instance("gregorian", langStr);
      }
      else // Return Julian calendar instance.
      {
         return $.calendars.instance("julian", langStr);
      }
   };
   
   // Compare the passed date parameters with the Gregorian change
   // date in Preferences, and return either a Gregorian or
   // Julian calendar based on result.
   function getCalendarFromDate(year, month, day)
   {
      var jd1 = Number(preferences.values["gregorianJD1"]);
      var cdate = $.calendars.instance("gregorian").fromJD(jd1);
      var y1 = cdate.year();
      var m1 = cdate.month();
      var d1 = cdate.day();
      var langStr = preferences.values["language"];
      //var langStr = ""; // This should be dredged out of preferences, but
                        // language localizations aren't yet working for Julian
                        // calendars in JQuery Calendars.
      
      if (year < y1)
         return $.calendars.instance("julian", langStr);
      else if (year > y1)
         return $.calendars.instance("gregorian", langStr);
      else
      {
         if (month < m1)
            return $.calendars.instance("julian", langStr);
         else if (month > m1)
            return $.calendars.instance("gregorian", langStr);
         else
         {
            if (day < d1)
               return $.calendars.instance("julian", langStr);
            else
               return $.calendars.instance("gregorian", langStr);
         }
      }
   };
   
   // Walk through the month, skipping the first week, which is always
   // guaranteed to be complete, getting a new Julian or Gregorian
   // calendar for each day, until we walk off the end of the target
   // month. Return the number of days in the target month. This is
   // a replacement for the normal lookup, needed because of the possible
   // switch from one calendar to another when the Gregorian change
   // takes place.
   function getDaysInMonth(startJD, targetMonth)
   {
      // Skip the first week, which can wrap around to previous year
      // and screw up exit conditions, and which we can assume to be
      // constant anyway.
      var i = startJD + 7;
           
      var tCal;
      var cdate;
      var m;
      var targetMonthFound = false;
      
      // Slightly odd loop structure. We have to be careful when we're in January
      // or December, and the month potentially wraps around, making inequality
      // comparisons dicey.
      while (true)
      {
         tCal = getCalendarFromJD(i);
         var cdate = tCal.fromJD(i);
         m = cdate.month();
         
         if (m === targetMonth)
            targetMonthFound = true;
            
         if (targetMonthFound === true && m != targetMonth)
            break;
            
         i++
      }
            
      return (i - startJD);
   };
   
   // Get weeks in month, taking Gregorian changeover into account.
   // Mostly moved from main routine, below. Not yet tested for
   // edge cases, where changeover occurs near beginning of month and
   // potentially spills over it backwards, or for the similar case
   // of the month preceeding such an occurence.
   function getWeeksInMonth(newMonth)
   {
      var targetYear = newMonth.year;
      var targetMonth = newMonth.month + 1;
            
      if (newMonth.epoch == "BC")
         targetYear = -targetYear;
         
      var cal = getCalendarFromDate(targetYear, targetMonth, 1);
               
      var month1JD = cal.toJD(targetYear, targetMonth, 1);
            
      // offset is the length of daycells prior to the first day
      // of the selected month at the beginning of the calendar.
      var firstDayOfWeek = Number(preferences.values['firstDayOfWeek']);
      var weekday = Math.floor(month1JD + 1.5) % 7;
      var offset = (weekday - firstDayOfWeek) % 7;
      if (offset < 0)
         offset += 7;
      var startJD = month1JD - offset;
      
      var daysInMonth = getDaysInMonth(startJD, targetMonth);
      var weeksInMonth = Math.ceil(daysInMonth / 7);
      
      return weeksInMonth;
   }
   
   this.handleMonthChange = handleMonthChange;
   function handleMonthChange(evt, newMonth)
   {      
      var targetYear = newMonth.year;
      var targetMonth = newMonth.month + 1;
      
      if (newMonth.epoch == "BC")
         targetYear = -targetYear;
         
      var cal = getCalendarFromDate(targetYear, targetMonth, 1);
            
      // Handle some i18n settings here.
      setWeekdayLabels(cal.local.dayNames.slice());
      mcds_setMonthStrings(cal.local.monthNames.slice());
      mcds_setDigitStrings(numerics[window.preferences.values["language"]]);
 
      // Note: The above works, but gets confusing because all calendars in JQCalendars
      // use BCE/CE for epochs, EXCEPT the Julian calendar, which uses BC/AD. When the
      // epoch control is switched, this can lead to a jarring change of displayed epoch
      // that is hard to understand, although sensible if you know what's going on. Since
      // it's unlikely anyone will, though, we'll just hard-code values for now.
      mcds_setEpochStrings(["AD", "BC"]);
      
      if (cal.local.isRTL === true)
         $(".mcds li div").css("text-align","right");
      else
         $(".mcds li div").css("text-align","left");
            
      var month1JD = cal.toJD(targetYear, targetMonth, 1);
      
      // offset is the length of daycells prior to the first day
      // of the selected month at the beginning of the calendar.
      var firstDayOfWeek = Number(preferences.values['firstDayOfWeek']);
      var weekday = Math.floor(month1JD + 1.5) % 7;
      var offset = (weekday - firstDayOfWeek) % 7;
      if (offset < 0)
         offset += 7;
      var startJD = month1JD - offset;
            
      var weeksInMonth = getWeeksInMonth(newMonth);
      
      var legend = true;
      if (window.preferences.values["legend"] === "false")
         legend = false;
               
      var captionHeight;
         
      if (legend === true)
      {
         document.getElementById("svg_calendar_legend").setAttribute("display", "block");
         captionHeight = 73;
      }
      else 
      {  
         document.getElementById("svg_calendar_legend").setAttribute("display", "none");
         captionHeight = 33;
      }
         
      var calendar_grid = document.getElementById("calendar_grid");
      var svg_calendar = document.getElementById("svg_calendar");
      var weekdayHeight = 30;
      var gridHeight = weeksInMonth * 100;
      svg_calendar.setAttribute("width", baseWidth.toString() + "in");
      
      
      calendar_grid.setAttribute("viewBox", "0 0 700 " + gridHeight);
      calendar_grid.setAttribute("height", gridHeight);
      var hgt = (weeksInMonth * 100) + weekdayHeight + captionHeight;
      svg_calendar.setAttribute("viewBox", "0 0 700 " + (hgt));
      var h = (hgt / 700) * baseWidth;
      svg_calendar.setAttribute("height", h.toString() + "in");
      document.getElementById("svg_calendar_legend").setAttribute("y", gridHeight + 27);
      
      for (var i = 0; i < 6; i++)
      {
         var wk = document.getElementById("wk" + i);
         if (i < weeksInMonth)
            wk.setAttribute("display", "block");
         else
            wk.setAttribute("display", "none");
      }
      
      var localOffset = 0;
      var utcMidOffset = 0;
      
      if (window.preferences.values["phaseTime"] === "localTime")
      {
         localOffset = localtimeOffset();
      }
      else if (window.preferences.values["phaseTime"] === "utcMidnight")
      {
         utcMidOffset = timezoneOffset();
         if (utcMidOffset >= 0)
            utcMidOffset = 1.0 - utcMidOffset;
         else
            utcMidOffset = -utcMidOffset;
      }
      
      // Run one past nominal number of daycells; array contains an extra
      // element, which is used to compute difference when determining if
      // final displayed date is waxing, waning, etc.
      for (var i = 0; i < daycellLength + 1; i++)
      {

      
         var currentJD = startJD + i;
         
         daycellInfo[i].julianDate = currentJD;
         
         var tCal = getCalendarFromJD(currentJD);
         
         daycellInfo[i].dateDisplay = tCal.fromJD(currentJD).day();
         daycellInfo[i].row = Math.floor(i / 7);
         daycellInfo[i].col = i % 7;
                  
         if (tCal.fromJD(currentJD).month() == targetMonth)
            daycellInfo[i].activeMonth = true;
         else
            daycellInfo[i].activeMonth = false;

         
         currentJD += utcMidOffset;
         currentJD += localOffset;
         
         daycellInfo[i].julianDate = currentJD;
         
         // End experiment
                     
         var lunarInfo = astro_utils.lunarParticulars(currentJD +
                                                      astro_utils.getDeltaT(currentJD)/(24.0 * 60.0 * 60.0) +
                                                      timezoneOffset());
         
         daycellInfo[i].moon_beta                = lunarInfo.moon_beta;
         daycellInfo[i].moon_lambda              = lunarInfo.moon_lambda;
         daycellInfo[i].moon_distance            = lunarInfo.moon_distance;
         daycellInfo[i].moon_positionAngle       = lunarInfo.moon_positionAngle;
         daycellInfo[i].moon_illuminatedFraction = lunarInfo.moon_illuminatedFraction;
         daycellInfo[i].sun_beta                 = lunarInfo.sun_beta;
         daycellInfo[i].sun_lambda               = lunarInfo.sun_lambda;
         daycellInfo[i].sun_distance             = lunarInfo.sun_distance;
      }
      
      // Fetch the canonical phases for the target and bracketing months.
      var canonicalPhases = astro_utils.canonicalPhases(tCal.toJD(targetYear, targetMonth, 15));
      
      // Correct for timezone offset.
      for (var i = 0; i < canonicalPhases.length; i++)
      {
         canonicalPhases[i].julianDate -= timezoneOffset();
      }
         
      for (var i = 0; i < daycellLength + 1; i++)
      {
         daycellInfo[i].phase = UNDEF;
         var targetJD = Math.round(daycellInfo[i].julianDate);
         for (var j = 0; j < canonicalPhases.length; j++)
         {
            var match = Math.round(canonicalPhases[j].julianDate);
            if (match === targetJD)
            {
               var ph = canonicalPhases[j].phase;
               daycellInfo[i].phase = ph;
               
               // Don't fiddle with timezones here; keep phase in UTC.
               daycellInfo[i].julianDate = canonicalPhases[j].julianDate;
               
               if (ph === NEW_MOON)
                  daycellInfo[i].moon_illuminatedFraction = 0.0;
               else if (ph === FULL_MOON)
                  daycellInfo[i].moon_illuminatedFraction = 1.0;
               else if (ph === FIRST_QUARTER || ph === LAST_QUARTER)
                  daycellInfo[i].moon_illuminatedFraction = 0.5;
                  
               // Re-run lunarParticulars call with new julianDate of canonical phase.
               // add back the timezone offset we subtracted off above for the call.
               var lunarInfo = astro_utils.lunarParticulars(daycellInfo[i].julianDate /*+ timezoneOffset()*/);
               daycellInfo[i].moon_beta          = lunarInfo.moon_beta;
               daycellInfo[i].moon_lambda        = lunarInfo.moon_lambda;
               daycellInfo[i].moon_distance      = lunarInfo.moon_distance;
               daycellInfo[i].moon_positionAngle = lunarInfo.moon_positionAngle;
               daycellInfo[i].sun_beta           = lunarInfo.sun_beta;
               daycellInfo[i].sun_lambda         = lunarInfo.sun_lambda;
               daycellInfo[i].sun_distance       = lunarInfo.sun_distance;
               
               break;
            }
         }
      }
      
      // Fill in remaining phase information. Only process up to last minus 1th
      // cell, since this is all that will be displayed.
      var blueMoonFlag = false;
      for (var i = 0; i < daycellLength; i++)
      {
         var d1 = daycellInfo[i].moon_illuminatedFraction;
         var d2 = daycellInfo[i + 1].moon_illuminatedFraction;
         var diff = d2 - d1
         var ph = daycellInfo[i].phase;
         
         // Check for 2nd full moon in a month.
         daycellInfo[i].blueMoon = false;
         if (ph === FULL_MOON && daycellInfo[i].activeMonth === true)
         {
            if (blueMoonFlag === true)
            {
               daycellInfo[i].blueMoon = true;
               blueMoonFlag = false;
            }
            else
               blueMoonFlag = true;
         }
         
         // Determine state of phase if non-canonical.
         if (diff >= 0 && daycellInfo[i].phase === UNDEF) // Waxing
         {
            if (daycellInfo[i].moon_illuminatedFraction >= 0.5) // Gibbous
            {
               daycellInfo[i].phase = WAXING_GIBBOUS;
            }
            else // Crescent
            {
               daycellInfo[i].phase = WAXING_CRESCENT;
            }
         }
         else if (diff < 0 && daycellInfo[i].phase === UNDEF) // Waning
         {
            if (daycellInfo[i].moon_illuminatedFraction >= 0.5) // Gibbous
            {
               daycellInfo[i].phase = WANING_GIBBOUS;
            }
            else // Crescent
            {
               daycellInfo[i].phase = WANING_CRESCENT;
            }
         }
      }
      
      updateGrid();
      updateRendering();
   }
   
   // Get the timezone offset as a fraction of a 24-hour day.
   // For now, we'll just obtain it from a Date object, presumably set to
   // the user's locale. When we have Preferences working, we should do
   // this if the user requests 'auto' and otherwise return a user-selected
   // offset.
   function timezoneOffset()
   {
      //return -4.0 / 24.0;
      var d = new Date();
      return d.getTimezoneOffset() / (60.0 * 24.0);
   }
   
   // Return the local time offset from midnight as a
   // fraction of a 24-hour day.
   function localtimeOffset()
   {
      var d = new Date();
      
      var h = d.getHours();
      var m = d.getMinutes();
      var s = d.getSeconds();
      var ms = d.getMilliseconds();
      
      var offset = h + m/60.0 + s/3600.0 + ms/(3600.0 * 1000.0);
      offset /= 24.0;
      
      return offset;
   }
   
   function daycell()
   {
      this.julianDate = 0;
      this.activeMonth = false;
      this.dateDisplay = 0;
      this.row = 0;
      this.col = 0;
      
      // Lunar/Solar information
      this.moon_beta = 0;
      this.moon_lambda = 0;
      this.moon_distance = 0;
      this.moon_positionAngle = 0;
      this.moon_illuminatedFraction = 0;
      this.sun_beta = 0;
      this.sun_lambda = 0;
      this.sun_distance = 0;
      this.phase = UNDEF;
      this.blueMoon = false;
   }
   
   // Returns true if Intl is supported, false otherwise.
   function intlSupport()
   {
      var number = 0;
      try {
          number.toLocaleString("i");
      } catch (e) {
          return e.name === "RangeError";
      }
      return false;
   }
   
   function initNumerics()
   {
      for (var i = 0; i < 32; i++)
         numerics["default"][i] = i;
      
      // Initialize all languages with default numerals, except those we plan
      // to fill with foreign numerals. (ick.) 
      for (var key in numerics)
      {
         if (intlSupport())
         {
            if (key != "default" && key != "hi-IN" && key != "zh-CN" && key != "ar")
               numerics[key] = numerics["default"];
         }
         else // Assign everyone default numerics.
         {
            if (key != "default")
               numerics[key] = numerics["default"];
         }
         
      }
     
      // If there's no Intl support, we're done.         
      if (!intlSupport())
         return;
         
      // Otherwise, replace some select numerals with translated counterparts.
      for (var i = 0; i < numerics["default"].length; i++)
      {
         numerics["hi-IN"][i] = numerics["default"][i].toLocaleString("hi-IN-u-nu-deva");
         numerics["zh-CN"][i] = numerics["default"][i].toLocaleString("zh-CN-u-nu-hanidec");
         numerics["ar"][i] = numerics["default"][i].toLocaleString("ar-u-nu-arabext");
      }
   }
   
   function init()
   {
      //preferences.loadPreferences();
      
      initNumerics();
      
      // Note: initialize with one additional daycell, for use
      // when computing named phase states; need one additional
      // day for computing difference.
      for (var i = 0; i < daycellLength + 1; i++)
      {
         daycellInfo.push(new daycell());
      }
      
      var w = screen.availWidth;
      var h = screen.availHeight;
      //alert("w:" + w + " h:" + h);
      var dim = Math.min(w, h);
      
      // Handheld devices sometimes return weirdly small dimensions,
      // but display properly if we let the width go large.
      if (dim < 1000 && !isHandheld())
         baseWidth = 6.0;
      else
         baseWidth = 8.0;
   }
   
   this.setToCurrentDate = setToCurrentDate;
   function setToCurrentDate()
   {
      // Note: this needs a little more work. We're just defaulting to the
      // base gregorian calendar here; really need to do i18n to do this
      // the right way.
      //var cal = $.calendars.instance();
      var cal = $.calendars.instance();
      var today = cal.today();
      
      
      var month = today.month() - 1;
      var year = Math.abs(today.year());
      var epoch = today.epoch();
      if (epoch == "BCE")
         epoch = "BC";
      if (epoch == "CE")
         epoch = "AD";
                  
      mcds_setDate(month, year, epoch);
      
      triggerRedraw();
   }
   
   this.triggerRedraw = triggerRedraw;
   function triggerRedraw()
   {
      $(document).trigger('month_changed_event', {month: Number(mcds_getMonth()),
                                                  year: Number(mcds_getYear()),
                                                  epoch:mcds_getEpoch()});
   }
   
   
   // Preferences
   /*********************************************************************/
   
   this.setControls = setControls;
   function setControls()
   {
      // Weird bug. 'language' cookie is not being set for some reason. Force it
      // to 'en' if found to be unset. Not a great solution, but seems to be
      // working for now.
      var t = preferences.values["language"];
      if (t === undefined || t === "")
      {
         console.log("Ack! Language cookie not set; forcing to 'en'.");
         preferences.values["language"] = "en"
      }
      
      if (preferences.values["tooltips"] === "true")
      {
         $("#prefs_tooltips").prop("checked", true);
         $("#prefs_tooltips").button("option", "icons", {primary: "ui-icon-check"});
      }
      else
      {
         $("#prefs_tooltips").prop("checked", false);
         $("#prefs_tooltips").button("option", "icons", {primary: "ui-icon-blank"});
      }
         
      if (preferences.values["northUp"] === "true")
      {
         $("#prefs_northUp").button("option", "label", "North Up");
      }
      else
      {
         $("#prefs_northUp").button("option", "label", "South Up");
      }
         
      if (preferences.values["positionAngle"] === "true")
      {
         $("#prefs_positionAngle").prop("checked", true);
         $("#prefs_positionAngle").button("option", "icons", {primary: "ui-icon-check"});
      }
      else
      {
         $("#prefs_positionAngle").prop("checked", false);
         $("#prefs_positionAngle").button("option", "icons", {primary: "ui-icon-blank"});
      }
      
      if (preferences.values["legend"] === "true")
      {
         $("#prefs_legend").prop("checked", true);
         $("#prefs_legend").button("option", "icons", {primary: "ui-icon-check"});
      }
      else
      {
         $("#prefs_legend").prop("checked", false);
         $("#prefs_legend").button("option", "icons", {primary: "ui-icon-blank"});
      }
      
      if (preferences.values["timeFormat"] === "12")
      {
         $("#prefs_timeFormat").button("option", "label", "12 Hour Time Format");
      }
      else
      {
         $("#prefs_timeFormat").button("option", "label", "24 Hour Time Format");
      }
         
      $("#prefs_tooltips").button("refresh");
      $("#prefs_northUp").button("refresh");
      $("#prefs_positionAngle").button("refresh");
      $("#prefs_legend").button("refresh");
      $("#prefs_timeFormat").button("refresh");
      
      $("#prefs_firstDayOfWeek").val(preferences.values["firstDayOfWeek"]);
      $("#prefs_firstDayOfWeek").selectmenu("refresh");
      
      $("#prefs_language").val(preferences.values["language"]);
      $("#prefs_language").selectmenu("refresh");
      
      $("#prefs_scaling").val(preferences.values["scaling"]);
      $("#prefs_scaling").selectmenu("refresh");
      
      $("#prefs_phaseTime").val(preferences.values["phaseTime"]);
      $("#prefs_phaseTime").selectmenu("refresh");
      
      var cal = $.calendars.instance("gregorian");
      var cdate = cal.fromJD(Number(preferences.values["gregorianJD1"]));
      var dateStr = cdate.formatDate(); // Use default formatting of calendar.
      $("#prefs_gregorianJD1").val(dateStr);
      
   }
   
   var restoreFromBackup = true;
   var prefs_copy = {};
   
   this.getPreferencesDialog = getPreferencesDialog;
   function getPreferencesDialog()
   {
      var prefs = $("#preferences").dialog({
         autoOpen: false,
         title: "Moon Calendar Settings",
         height: "auto",
         width: "auto",
         closeOnEscape: true,
         dialogClass: "hideable", 
         buttons: [{
                      text: "Cancel",
                      click: function()
                             {
                                restoreFromBackup = true;
                                $(this).dialog("close");
                             }
                   },
                   {
                      text: "Ok",
                      click: function()
                             {
                                restoreFromBackup = false;
                                $(this).dialog("close");
                             }
                   }],
         close: function(evt, ui)
                {
                   if (restoreFromBackup === true)
                   {
                      for (key in prefs_copy)
                         preferences.values[key] = prefs_copy[key];
                   }
                   else
                   {
                      ; //console.log("No restore");
                   }
                   
                   triggerRedraw();
                   preferences.savePreferences();
                   restoreFromBackup = true;
                   
                   console.log("-------------------------------");
                   
                   for (key in preferences.values)
                      console.log(key + " " + preferences.values[key]);
                      
                   console.log("-------------------------------");
                },
         open: function()
         {
            for (key in preferences.values)
               prefs_copy[key] = preferences.values[key];
         
            // Set controls from preference values.
            setControls();
         }
      });
      
      return prefs;
   }
   
   this.getToggleButtonHandler = getToggleButtonHandler;
   function getToggleButtonHandler(uiItem, prefsItem)
   {
      return function(event)
             {
                event.preventDefault();
                if (window.preferences.values[prefsItem] === "24")
                {
                   $(uiItem).button("option", "label", "12 Hour Time Format");
                   window.preferences.values[prefsItem] = "12";
                }
                else
                {
                   $(uiItem).button("option", "label", "24 Hour Time Format");
                   window.preferences.values[prefsItem] = "24";
                }
                
                $(uiItem).button("refresh");
              
                triggerRedraw();
             };
   }
   
   this.getToggleButtonHandler2 = getToggleButtonHandler2;
   function getToggleButtonHandler2(uiItem, prefsItem)
   {
      return function(event)
             {
                event.preventDefault();
                if (window.preferences.values[prefsItem] === "true")
                {
                   $(uiItem).button("option", "label", "South Up");
                   window.preferences.values[prefsItem] = "false";
                }
                else
                {
                   $(uiItem).button("option", "label", "North Up");
                   window.preferences.values[prefsItem] = "true";
                }
                
                $(uiItem).button("refresh");
              
                triggerRedraw();
             };
   }
   
   this.getCheckboxHandler = getCheckboxHandler;
   function getCheckboxHandler(uiItem, prefsItem)
   {
      return function(event)
             {
                if ($(uiItem).is(":checked"))
                {
                   $(uiItem).button("option", "icons", {primary: "ui-icon-check"});
                   window.preferences.values[prefsItem] = "true";
                }
                else
                {
                   $(uiItem).button("option", "icons", {primary: "ui-icon-blank"});
                   window.preferences.values[prefsItem] = "false";
                }
                triggerRedraw();
             };
   }
   
   this.parseDate = parseDate;
   function parseDate(event, ui)
   {
      // Always use a Gregorian calendar here.
      // Note: may want to use getCalendar functions, which
      // return a calendar based on user language. We could
      // also dredge its localized format string out, and
      // add it to dateFormats.
      // NOTE: I'm not entirely sure our date formats will
      // be robust. For example, what about dates like
      // 02 03 2014? March 2? Or February 3? 
      var cal = $.calendars.instance("gregorian");
      var val = $("#prefs_gregorianJD1").val();
      var dateFormats = ['yyyy-mm-dd',
                         'yyyy-mm-d',
                         'yyyy/mm/dd',
                         'yyyy/mm/d',
                         'yyyy mm dd',
                         'yyyy mm d',
                         'dd MM yyyy',
                         'd MM yyyy',
                         'MM d yyyy',
                         'MM d, yyyy',
                         'MM dd yyyy',
                         'MM dd, yyyy',
                         'mm/d/yyyy',
                         'mm/dd/yyyy'
                         ];
                         
      for (var i = 0; i < dateFormats.length; i++)
      {
         var format = dateFormats[i];
         try
         {
            var date = cal.parseDate(format, val);
            var jd = cal.toJD(date);
            if (jd < 2299160.5) // Don't allow dates prior to October 15, 1582
            {
               alert("Date must be October 15, 1582 or later.");
               return;
            }
            window.preferences.values["gregorianJD1"] = jd;
            triggerRedraw();
            return;
         }
         catch (err)
         {}
      }
      
      alert("Unable to parse date. Please try a format like 'yyyy-mm-dd'.");
      setControls();
      
   }
   
   /*********************************************************************/
   /* Experiment */
   /* This shows how to get results from a web service outside our domain,
      using CORS and the Google Time Zone API. Note that we're not registered
      at present and aren't passing a user id, so don't get crazy here. Just
      for testing and demo purposes. Seems to work fine from Firefox on Linux,
      hosted by local Apache server. Not so sure what will happen with IE and
      elsewhere yet.
   */
         
   // Create the XHR object.
   function createCORSRequest(method, url)
   {
      var xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr)
      {
         // XHR for Chrome/Firefox/Opera/Safari.
         xhr.open(method, url, true);
      }
      else if (typeof XDomainRequest != "undefined")
      {
         // XDomainRequest for IE.
         xhr = new XDomainRequest();
         xhr.open(method, url);
      }
      else
      {
         // CORS not supported.
         xhr = null;
      }
      return xhr;
   }

   // Helper method to parse the title tag from the response.
   function getTitle(text)
   {
      return text.match('<title>(.*)?</title>')[1];
   }

   // Make the actual CORS request.
   function makeCorsRequest()
   {
      // All HTML5 Rocks properties support CORS.
      //var url = 'http://updates.html5rocks.com';
      var url = "https://maps.googleapis.com/maps/api/timezone/json?location=39.6034810,-119.6822510&timestamp=1331766000&language=es&sensor=false"
      var xhr = createCORSRequest('GET', url);
      if (!xhr)
      {
         alert('CORS not supported');
         return;
      }

      // Response handlers.
      xhr.onload = function()
      {
         var text = xhr.responseText;
         //var title = getTitle(text);
         var title = text;
         var obj = JSON.parse(text);
         console.log(obj.dstOffset);
         console.log(obj.rawOffset);
         console.log(obj.status);
         console.log(obj.timeZoneId);
         console.log(obj.timeZoneName);
         alert('Response from CORS request to ' + url + ': ' + title);
      };

      xhr.onerror = function()
      {
         alert('Woops, there was an error making the request.');
      };

      xhr.send();
   }
   
   //makeCorsRequest();      
   /* End Experiment. */
   /*********************************************************************/
   
   init();
}

window.pmc_utils = new PMC_Utils();


