"use strict";

// Declare some global constants here.

window.NEW_MOON        = 0.00;
window.FIRST_QUARTER   = 0.25;
window.FULL_MOON       = 0.50;
window.LAST_QUARTER    = 0.75;

window.WANING_CRESCENT = 2.0;
window.WAXING_CRESCENT = 3.0;
window.WANING_GIBBOUS  = 4.0;
window.WAXING_GIBBOUS  = 5.0;

window.UNDEF           = 999.0;

/*
   Most of the functions here come from "Astronomical Algorithms, 2nd Edition"
   by Jean Meeus.
*/
function Astro_Utils()
{
   
   var moon = new LunarPosition(0);
   var sun = new SolarPosition(0);
   
   this.toRadians = toRadians;
   function toRadians(degrees)
   {
      return degrees * Math.PI / 180;
   };
   
   this.toDegrees = toDegrees;
   function toDegrees(radians)
   {
      return radians * 180 / Math.PI;
   };
   
   // Convert offset, expressed in fractional days, to hh:mm format.
   this.timestringFromOffset = timestringFromOffset;
   function timestringFromOffset(offset)
   {
      //offset *= 24.0 * 60.0;
      
      var sign = "+";
      if (offset < 0)
      {
         sign = "-";
         offset = -offset;
      }
      
      //var hoursFloat = offset / 60.0;
      var hoursFloat = offset * 24.0;
      var hours = Math.floor(hoursFloat);
      
      var minutesFloat = (hoursFloat - hours) * 60.0;
      var minutes = Math.floor(minutesFloat);
      
      return {sign:sign, hours:hours, minutes:minutes};
   }
   
   // Interpret the fractional part of the provided Julian date as the time of day
   // (noting that JDs begin at noon) and return hours, minutes, seconds in 24 hour
   // format. No timezone correction is performed.
   this.timestringFromJulianDate = timestringFromJulianDate;
   function timestringFromJulianDate(julianDate)
   {
      var frac = julianDate - Math.floor(julianDate);
      
      if (frac >= 0.5)
         frac -= 0.5;
      else
         frac += 0.5;
         
      var hoursFloat = frac * 24.0;
      var hours = Math.floor(hoursFloat);
      
      frac = hoursFloat - hours;
      var minutesFloat = frac * 60.0;
      var minutes = Math.floor(minutesFloat);
      
      frac = minutesFloat - minutes;
      var secondsFloat = frac * 60.0;
      var seconds = Math.round(secondsFloat);
      
      // Rounding may bump up seconds to 60-something, and we need to correct that
      // and carry the rounding up as far as needed.
      if (seconds >= 60.0)
      {
         seconds = 0;
         minutes += 1;
      }
      
      if (minutes == 60)
      {
         minutes = 0;
         hours += 1;
      }
      
      if (hours == 24)
      {
         hours = 0;
         // days += 1? Ignore for now; just want time.
      }
      
      return {hours:hours, minutes:minutes, seconds:seconds};
   }
   
   // Interpret the fractional part of the provided Julian date as the time of day
   // (noting that JDs begin at noon) and return hours, minutes, seconds in 24 hour
   // format. No timezone correction is performed.
   this.timestringFromJulianDate2 = timestringFromJulianDate2;
   function timestringFromJulianDate2(julianDate)
   {
      var frac = julianDate - Math.floor(julianDate);
      
      if (frac >= 0.5)
         frac -= 0.5;
      else
         frac += 0.5;
         
      var hoursFloat = frac * 24.0;
      var hours = Math.floor(hoursFloat);
      
      frac = hoursFloat - hours;
      var minutesFloat = frac * 60.0;
      var minutes = Math.round(minutesFloat);
      
      if (minutes == 60)
      {
         minutes = 0;
         hours += 1;
      }
      
      if (hours == 24)
      {
         hours = 0;
         // days += 1? Ignore for now; just want time.
      }
      
      return {hours:hours, minutes:minutes};
   }
   
   /* From Meeus, p. 93.
   
      lambda = ecliptical longitude
      beta = ecliptical latitude
      julianDate = julian date at the desired instant
      
      returns: object with ra = right ascension, dec = declination
               of coordinates.
   */
   this.eclipticToEquatorial = eclipticToEquatorial;
   function eclipticToEquatorial(lambda, beta, julianDate)
   {
      var epsilon = obliquity(julianDate);
      
      var sin_lambda = Math.sin(lambda);
      var sin_epsilon = Math.sin(epsilon);
      var cos_epsilon = Math.cos(epsilon);
      
      var alpha =
         Math.atan2(sin_lambda * cos_epsilon - Math.tan(beta) * sin_epsilon,
                    Math.cos(lambda));
                    
      var delta =
         Math.asin(Math.sin(beta) * cos_epsilon + Math.cos(beta) * sin_epsilon * sin_lambda);
         
      var result = {"alpha": alpha, "delta": delta};
      
      return result;
   };
   
   /* Obliquity of the ecliptic. From Meeus, p. 147.
   */
   this.obliquity = obliquity;
   function obliquity(julianDate)
   {
      var T = (julianDate - 2451545.0) / 36525.0;
      
      var U = T / 100.0;
     
      var e0 =
         23.0 + (1581.448 +
                 U * (-4680.93 +
                 U * (-1.55 +
                 U * (1999.25 +
                 U * (-51.38 +
                 U * (-249.67 +
                 U * (-39.05 +
                 U * (7.12 +
                 U * (27.87 +
                 U * (5.79 +
                 U * 2.45)))))))))) / 3600.0;
                 
      return toRadians(e0);
   };
   
   /* From Meeus, p. 349ff.
   
      K is an integer value derived from the date of interest;
      phase is a fractional value (NEW_MOON, etcetera - see constants,
      above - denoting the phase to calculate.
      
      Returns the julian date nearest K on which the requested phase occurs.
   */
   // No need for this to be public. Make it so just for testing purposes.
   this.canonicalPhase = canonicalPhase;
   function canonicalPhase(K, phase)
   {
      var k  = K + phase;
      var T  = k / 1236.85;
      var T2 = T * T;
      var T3 = T2 * T;
      var T4 = T3 * T;
            
      var JDE = 2451550.09766 + 29.530588861  * k
                              + 0.00015437    * T2
                              - 0.000000150   * T3
                              + 0.00000000073 * T4;
                           
      var E = 1.0 - 0.002516  * T
                  - 0.0000074 * T2;
                           
      var M = 2.5534 + 29.10535670 * k
                     - 0.0000014   * T2
                     - 0.00000011  * T3;
                 
      var Mprime = 201.5643 + 385.81693528  * k
                            + 0.0107582     * T2
                            + 0.00001238    * T3
                            - 0.000000058   * T4;
                         
      var F = 160.7108 + 390.67050284 * k
                       - 0.0016118    * T2
                       - 0.00000227   * T3
                       + 0.000000011  * T4;
                    
      var omega = 124.7746 - 1.56375588 * k
                           + 0.0020672  * T2
                           + 0.00000215 * T3;

      
      var A1  = 299.77 +  0.107408 * k - 0.009173 * T2;
      var A2  = 251.88 +  0.016321 * k;
      var A3  = 251.83 + 26.651886 * k;
      var A4  = 349.42 + 36.412478 * k;
      var A5  =  84.66 + 18.206239 * k;
      var A6  = 141.74 + 53.303771 * k;
      var A7  = 207.14 +  2.453732 * k;
      var A8  = 154.84 +  7.306860 * k;
      var A9  =  34.52 + 27.261239 * k;
      var A10 = 207.19 +  0.121824 * k;
      var A11 = 291.34 +  1.844379 * k;
      var A12 = 161.72 + 24.198154 * k;
      var A13 = 239.56 + 25.513099 * k;
      var A14 = 331.55 +  3.592518 * k;
      
      A1  = 0.000325 * Math.sin(Math.toRadians(A1));
      A2  = 0.000165 * Math.sin(Math.toRadians(A2));
      A3  = 0.000164 * Math.sin(Math.toRadians(A3));
      A4  = 0.000126 * Math.sin(Math.toRadians(A4));
      A5  = 0.000110 * Math.sin(Math.toRadians(A5));
      A6  = 0.000062 * Math.sin(Math.toRadians(A6));
      A7  = 0.000060 * Math.sin(Math.toRadians(A7));
      A8  = 0.000056 * Math.sin(Math.toRadians(A8));
      A9  = 0.000047 * Math.sin(Math.toRadians(A9));
      A10 = 0.000042 * Math.sin(Math.toRadians(A10));
      A11 = 0.000040 * Math.sin(Math.toRadians(A11));
      A12 = 0.000037 * Math.sin(Math.toRadians(A12));
      A13 = 0.000035 * Math.sin(Math.toRadians(A13));
      A14 = 0.000023 * Math.sin(Math.toRadians(A14));
      
      var Asum = A1  + A2  + A3  + A4 + A5  +
                 A6  + A7  + A8  + A9 + A10 +
                 A11 + A12 + A13 + A14;
                    
      M      = Math.toRadians(M);
      Mprime = Math.toRadians(Mprime);
      F      = Math.toRadians(F);
      omega  = Math.toRadians(omega);
      
      // Precompute some common mulitples. The remaining ones
      // don't save us much, if anything, so leave them as
      // in-place computations.
      var _2_Mprime = 2.0 * Mprime;
      var _2_F = 2.0 * F;
      
      var corr = 0.0;
      
      if (phase == NEW_MOON)
      {
         corr = -0.40720       * Math.sin(Mprime) +
                 0.17241 * E   * Math.sin(M) +
                 0.01608       * Math.sin(_2_Mprime) +
                 0.01039       * Math.sin(_2_F) +
                 0.00739 * E   * Math.sin(Mprime - M) +
                -0.00514 * E   * Math.sin(Mprime + M) +
                 0.00208 * E*E * Math.sin(2.0 * M) +
                -0.00111       * Math.sin(Mprime - _2_F) +
                -0.00057       * Math.sin(Mprime + _2_F) +
                 0.00056 * E   * Math.sin(_2_Mprime + M) +
                -0.00042       * Math.sin(3.0 * Mprime) +
                 0.00042 * E   * Math.sin(M + _2_F) +
                 0.00038 * E   * Math.sin(M - _2_F) +
                -0.00024 * E   * Math.sin(_2_Mprime - M) +
                -0.00017       * Math.sin(omega) +
                -0.00007       * Math.sin(Mprime + 2.0 * M) +
                 0.00004       * Math.sin(_2_Mprime - _2_F) +
                 0.00004       * Math.sin(3.0 * M) +
                 0.00003       * Math.sin(Mprime + M - _2_F) +
                 0.00003       * Math.sin(_2_Mprime + _2_F) +
                -0.00003       * Math.sin(Mprime + M + _2_F) +
                 0.00003       * Math.sin(Mprime - M + _2_F) +
                -0.00002       * Math.sin(Mprime - M - _2_F) +
                -0.00002       * Math.sin(3.0 * Mprime + M) +
                 0.00002       * Math.sin(4.0 * Mprime);
      }
      else if (phase == FULL_MOON)
      {
         corr = -0.40614       * Math.sin(Mprime) +
                 0.17302 * E   * Math.sin(M) +
                 0.01614       * Math.sin(_2_Mprime) +
                 0.01043       * Math.sin(_2_F) +
                 0.00734 * E   * Math.sin(Mprime - M) +
                -0.00515 * E   * Math.sin(Mprime + M) +
                 0.00209 * E*E * Math.sin(2.0 * M) +
                -0.00111       * Math.sin(Mprime - _2_F) +
                -0.00057       * Math.sin(Mprime + _2_F) +
                 0.00056 * E   * Math.sin(_2_Mprime + M) +
                -0.00042       * Math.sin(3.0 * Mprime) +
                 0.00042 * E   * Math.sin(M + _2_F) +
                 0.00038 * E   * Math.sin(M - _2_F) +
                -0.00024 * E   * Math.sin(_2_Mprime - M) +
                -0.00017       * Math.sin(omega) +
                -0.00007       * Math.sin(Mprime + 2.0 * M) +
                 0.00004       * Math.sin(_2_Mprime - _2_F) +
                 0.00004       * Math.sin(3.0 * M) +
                 0.00003       * Math.sin(Mprime + M - _2_F) +
                 0.00003       * Math.sin(_2_Mprime + _2_F) +
                -0.00003       * Math.sin(Mprime + M + _2_F) +
                 0.00003       * Math.sin(Mprime - M + _2_F) +
                -0.00002       * Math.sin(Mprime - M - _2_F) +
                -0.00002       * Math.sin(3.0 * Mprime + M) +
                 0.00002       * Math.sin(4.0 * Mprime);
      }
      else // FIRST_QUARTER or LAST_QUARTER
      {
         corr = -0.62801       * Math.sin(Mprime) +
                 0.17172 * E   * Math.sin(M) +
                -0.01183 * E   * Math.sin(Mprime + M) +
                 0.00862       * Math.sin(_2_Mprime) +
                 0.00804       * Math.sin(_2_F) +
                 0.00454 * E   * Math.sin(Mprime - M) +
                 0.00204 * E*E * Math.sin(2.0 * M) +
                -0.00180       * Math.sin(Mprime - _2_F) +
                -0.00070       * Math.sin(Mprime + _2_F) +
                -0.00040       * Math.sin(3.0 * Mprime) +
                -0.00034 * E   * Math.sin(_2_Mprime - M) +
                 0.00032 * E   * Math.sin(M + _2_F) +
                 0.00032 * E   * Math.sin(M - _2_F) +
                -0.00028 * E*E * Math.sin(Mprime + 2.0 * M) +
                 0.00027 * E   * Math.sin(_2_Mprime + M) +
                -0.00017       * Math.sin(omega) +
                -0.00005       * Math.sin(Mprime - M - _2_F) +
                 0.00004       * Math.sin(_2_Mprime + _2_F) +
                -0.00004       * Math.sin(Mprime + M + _2_F) +
                 0.00004       * Math.sin(Mprime - 2.0 * M) +
                 0.00003       * Math.sin(Mprime + M - _2_F) +
                 0.00003       * Math.sin(3.0 * M) +
                 0.00002       * Math.sin(_2_Mprime - _2_F) +
                 0.00002       * Math.sin(Mprime - M + _2_F) +
                -0.00002       * Math.sin(3.0 * Mprime + M);
                
         var W = 0.00306 - 0.00038 * E * Math.cos(M) +
                 0.00026 * Math.cos(Mprime) -
                 0.00002 * Math.cos(Mprime - M) +
                 0.00002 * Math.cos(Mprime + M) +
                 0.00002 * Math.cos(_2_F);
         
         if (phase == LAST_QUARTER)
            W = -W;
                        
         corr = corr + W;
      }
            
      return JDE + corr + Asum;
   };
   
   /* Return a list of canonical phase dates for the month the
      month of the julian date specified. The value of k is
      calculated for the month in question, but at least 20
      values are returned, as k is allowed to range from k-2 to
      k+2 to allow for bits of preceding/following months displayed
      on calendar. Returns a list of Julian dates and associated phases,
      with the date time-extended and corrected to be in UTC.
   */
   this.canonicalPhases = canonicalPhases;
   function canonicalPhases(julianDate)
   {
      var result = new Array();
      
      // Get a calendar instance. Note, again, that this uses only
      // the Gregorian calendar, and will need to be adjusted when
      // we eventually support Julian calendars.
      var cal = $.calendars.instance();
      var cdate = cal.fromJD(julianDate);
      
      // Calendar numbers months starting with 1; we want a zero-base
      // enumeration, so subtract 1.
      var month = cdate.month() - 1;
      var year = cdate.year();
      
      // Calendar has no year zero, and uses negative numbers to
      // indicate dates BC. Our code prefers 1 BC == Year 0, 2 BC
      // == Year -1, etc.
      if (cdate.epoch() == 'BC' || cdate.epoch() == 'BCE')
         year = year + 1;
               
      year = year + month / 12.0;
      
      var k = Math.round((year - 2000.0) * 12.3685);
      
      var deltaT;
      var divisT = 24.0 * 60.0 * 60.0;
      var jd;
      // Calculations return results using Dynamical Time; we apply
      // Delta T to convert to Universal Time.
      // NOTE: Backed off DeltaT application for now, just to confirm
      // that some wonkiness with preceding, subsequent phases far
      // from the present was due to it not being applied to ordinary
      // phase calculations, which is the case.
      for (var i = k - 2; i < k + 3; i++)
      {
         jd = canonicalPhase(i, NEW_MOON);
         deltaT = getDeltaT(jd) / divisT;
         jd -= deltaT;
         result.push({julianDate: jd, phase: NEW_MOON});
         
         jd = canonicalPhase(i, FIRST_QUARTER);
         deltaT = getDeltaT(jd) / divisT;
         jd -= deltaT;
         result.push({julianDate: jd, phase: FIRST_QUARTER});
         
         jd = canonicalPhase(i, FULL_MOON);
         deltaT = getDeltaT(jd) / divisT;
         jd -= deltaT;
         result.push({julianDate: jd, phase: FULL_MOON});
         
         jd = canonicalPhase(i, LAST_QUARTER);
         deltaT = getDeltaT(jd) / divisT;
         jd -= deltaT;
         result.push({julianDate: jd, phase: LAST_QUARTER});
      }
      
      return result;
   }
   
   /* Compute a number of pieces of information about the moon's appearance
      on a particular date.
   */
   this.lunarParticulars = lunarParticulars;
   function lunarParticulars(julianDate)
   {
      var beta;   // Moon's latitude.
      var lambda; // Moon's longitude.
      var alpha;  // Moon's right ascension.
      var delta;  // Moon's declination.

      var beta_0;   // Sun's latitude;
      var lambda_0; // Sun's longitude;
      var alpha_0;  // Sun's right ascension.
      var delta_0;  // Sun's declination.
      
      moon.setDate(julianDate);
      sun.setDate(julianDate);
      
      var lunarDistance = moon.getDistance();
      var solarDistance = sun.getDistance();
      
      beta = moon.getLatitude();
      lambda = moon.getLongitude();
      
      beta_0 = sun.getLatitude();
      lambda_0 = sun.getLongitude();
            
      var solarEquatorial = eclipticToEquatorial(lambda, beta, julianDate);
      var alpha = solarEquatorial.alpha;
      var delta = solarEquatorial.delta;
      
      var lunarEquatorial = eclipticToEquatorial(lambda_0, beta_0, julianDate);
      var alpha_0 = lunarEquatorial.alpha;
      var delta_0 = lunarEquatorial.delta;
      
      // Calculate illuminated fraction of moon's disk.
      var cos_psi = Math.cos(beta) * Math.cos(lambda - lambda_0);
      var numerator = solarDistance * Math.sin(Math.acos(cos_psi));
      var denominator = lunarDistance - solarDistance * cos_psi;
      var i = Math.atan2(numerator, denominator);
      var illuminatedFraction = (1.0 + Math.cos(i)) / 2.0;
      
      // Calculate position angle of moon's bright limb.
      numerator = Math.cos(delta_0) * Math.sin(alpha_0 - alpha);
      denominator = Math.sin(delta_0) * Math.cos(delta) -
                       Math.cos(delta_0) * Math.sin(delta) * Math.cos(alpha_0 - alpha);
                       
      var positionAngle = Math.atan2(numerator, denominator);
      if (positionAngle < 0.0)
         positionAngle += 2.0 * Math.PI;
               
      return {
         moon_beta: beta,
         moon_lambda: lambda,
         moon_distance: lunarDistance,
         moon_positionAngle: positionAngle,
         moon_illuminatedFraction: illuminatedFraction,
         sun_beta: beta_0,
         sun_lambda: lambda_0,
         sun_distance: solarDistance
      };
   };
   
   /* Return the number of seconds Dynamical Time differs
      from Universal Time at the moment the passed Calendar
      is set for.
      
      Based on Meeus, p.77ff
   */
   this.getDeltaT = getDeltaT;
   function getDeltaT(julianDate)
   {
      var fYear = getFractionalYear(julianDate);
            
      if (fYear >= DTVals[0].year &&
          fYear <= DTVals[DTVals.length - 1].year)
      {
         return searchDTVals(fYear);
      }
      else if (fYear < 948.0)
      {
         var t = (fYear - 2000.0) / 100.0;
         return 2177.0 + t * (497.0 + 44.1 * t);
      }
      else //if (year > DTVals[DTVals.length - 1].getYear()) or 948 < year < DTVals[0].getYear()
      {
         // Note: this is added. We weren't checking range inclusion properly within Java applet.
         var endYear = DTVals[DTVals.length - 1].year;
         var t = (fYear - 2000.0) / 100.0;
         var dt = 102.0 + t * (102.0 + 25.3 * t);
         if (fYear > endYear && fYear <= 2100.0)
            dt = dt + 0.37 * (fYear - 2100.0);
         return dt;
      }
   };
   
   function DeltaT(year, deltaT)
   {
      this.year = year;
      this.deltaT = deltaT
   };
   
   // Search through DTVals for an entry matching year, and
   // return deltaT, interpolating if necessary. Could be
   // improved by using binary search, but DTVals isn't that
   // big, so not critical.
   function searchDTVals(targetYear)
   {
      var idx = 0;
      while(DTVals[idx].year < targetYear)
         idx++;
      
      if (DTVals[idx].year == targetYear)
      {
         return DTVals[idx].deltaT;
      }
      else // Overshot; interpolate between idx and idx - 1
      {
         var x0 = DTVals[idx - 1].year;
         var x1 = DTVals[idx].year;
         var y0 = DTVals[idx - 1].deltaT;
         var y1 = DTVals[idx].deltaT;
         var dt = y0 + (y1 - y0) * ((targetYear - x0) / (x1 - x0));
         return dt;
      }
   };
   
   /* Given a Julian date, return the date the calendar
      is set to as year.frac, where frac is the fractional
      part of the year. Result will be in the range 0.0...1.0.
      We assume the Julian date contains a fractional part
      representing the time of day.
      
      Note: this is probably broken for negative years. We don't
      really care right now, because it is used solely for a small,
      positive range of years when calculating DeltaT, but we
      should be aware of this.
   */
   this.getFractionalYear = getFractionalYear;
   function getFractionalYear(julianDate)
   {
      // Grab the fractional part of the julianDate, so we can
      // use it later to restore the time. The jquery calendar
      // doesn't preserve this, and always returns a Julian date
      // ending in 0.5.
      var fractionalDay = julianDate - Math.floor(julianDate);
      if (fractionalDay >= 0.5)
         fractionalDay -= 0.5;
      else
         fractionalDay += 0.5;
      
      // Note: we'll want to be more thorough here when we incorporate
      // a Julian/Gregorian split, and instantiate a Julian calendar
      // when appropriate. Just accept the default Gregorian calendar
      // for now.
      var cal = $.calendars.instance();
      var cdate = cal.fromJD(julianDate);
      
      var year = cdate.year();
      
      var day = cdate.dayOfYear() - 1.0;
      day += fractionalDay;
         
      var max_day = cdate.daysInYear();
      
      var result = year + day / max_day;
      
      return result;
   };
   
   var DTVals = new Array(
      new DeltaT(1620.0, 124.0),  
      new DeltaT(1621.0, 119.0),  
      new DeltaT(1622.0, 115.0),  
      new DeltaT(1623.0, 110.0),  
      new DeltaT(1624.0, 106.0),  
      new DeltaT(1625.0, 102.0),  
      new DeltaT(1626.0,  98.0),  
      new DeltaT(1627.0,  95.0),  
      new DeltaT(1628.0,  91.0),  
      new DeltaT(1629.0,  88.0),  
      new DeltaT(1630.0,  85.0),  
      new DeltaT(1631.0,  82.0),  
      new DeltaT(1632.0,  79.0),  
      new DeltaT(1633.0,  77.0),  
      new DeltaT(1634.0,  74.0),  
      new DeltaT(1635.0,  72.0),  
      new DeltaT(1636.0,  70.0),  
      new DeltaT(1637.0,  67.0),  
      new DeltaT(1638.0,  65.0),  
      new DeltaT(1639.0,  63.0),  
      new DeltaT(1640.0,  62.0),  
      new DeltaT(1641.0,  60.0),  
      new DeltaT(1642.0,  58.0),  
      new DeltaT(1643.0,  57.0),  
      new DeltaT(1644.0,  55.0),  
      new DeltaT(1645.0,  54.0),  
      new DeltaT(1646.0,  53.0),  
      new DeltaT(1647.0,  51.0),  
      new DeltaT(1648.0,  50.0),  
      new DeltaT(1649.0,  49.0),  
      new DeltaT(1650.0,  48.0),  
      new DeltaT(1651.0,  47.0),  
      new DeltaT(1652.0,  46.0),  
      new DeltaT(1653.0,  45.0),  
      new DeltaT(1654.0,  44.0),  
      new DeltaT(1655.0,  43.0),  
      new DeltaT(1656.0,  42.0),  
      new DeltaT(1657.0,  41.0),  
      new DeltaT(1658.0,  40.0),  
      new DeltaT(1659.0,  38.0),  
      new DeltaT(1660.0,  37.0),  
      new DeltaT(1661.0,  36.0),  
      new DeltaT(1662.0,  35.0),  
      new DeltaT(1663.0,  34.0),  
      new DeltaT(1664.0,  33.0),  
      new DeltaT(1665.0,  32.0),  
      new DeltaT(1666.0,  31.0),  
      new DeltaT(1667.0,  30.0),  
      new DeltaT(1668.0,  28.0),  
      new DeltaT(1669.0,  27.0),  
      new DeltaT(1670.0,  26.0),  
      new DeltaT(1671.0,  25.0),  
      new DeltaT(1672.0,  24.0),  
      new DeltaT(1673.0,  23.0),  
      new DeltaT(1674.0,  22.0),  
      new DeltaT(1675.0,  21.0),  
      new DeltaT(1676.0,  20.0),  
      new DeltaT(1677.0,  19.0),  
      new DeltaT(1678.0,  18.0),  
      new DeltaT(1679.0,  17.0),  
      new DeltaT(1680.0,  16.0),  
      new DeltaT(1681.0,  15.0),  
      new DeltaT(1682.0,  14.0),  
      new DeltaT(1683.0,  14.0),  
      new DeltaT(1684.0,  13.0),  
      new DeltaT(1685.0,  12.0),  
      new DeltaT(1686.0,  12.0),  
      new DeltaT(1687.0,  11.0),  
      new DeltaT(1688.0,  11.0),  
      new DeltaT(1689.0,  10.0),  
      new DeltaT(1690.0,  10.0),  
      new DeltaT(1691.0,  10.0),  
      new DeltaT(1692.0,   9.0),  
      new DeltaT(1693.0,   9.0),  
      new DeltaT(1694.0,   9.0),  
      new DeltaT(1695.0,   9.0),  
      new DeltaT(1696.0,   9.0),  
      new DeltaT(1697.0,   9.0),  
      new DeltaT(1698.0,   9.0),  
      new DeltaT(1699.0,   9.0),  
      new DeltaT(1700.0,   9.0),  
      new DeltaT(1701.0,   9.0),  
      new DeltaT(1702.0,   9.0),  
      new DeltaT(1703.0,   9.0),  
      new DeltaT(1704.0,   9.0),  
      new DeltaT(1705.0,   9.0),  
      new DeltaT(1706.0,   9.0),  
      new DeltaT(1707.0,   9.0),  
      new DeltaT(1708.0,  10.0),  
      new DeltaT(1709.0,  10.0),  
      new DeltaT(1710.0,  10.0),  
      new DeltaT(1711.0,  10.0),  
      new DeltaT(1712.0,  10.0),  
      new DeltaT(1713.0,  10.0),  
      new DeltaT(1714.0,  10.0),  
      new DeltaT(1715.0,  10.0),  
      new DeltaT(1716.0,  10.0),  
      new DeltaT(1717.0,  11.0),  
      new DeltaT(1718.0,  11.0),  
      new DeltaT(1719.0,  11.0),  
      new DeltaT(1720.0,  11.0),  
      new DeltaT(1721.0,  11.0),  
      new DeltaT(1722.0,  11.0),  
      new DeltaT(1723.0,  11.0),  
      new DeltaT(1724.0,  11.0),  
      new DeltaT(1725.0,  11.0),  
      new DeltaT(1726.0,  11.0),  
      new DeltaT(1727.0,  11.0),  
      new DeltaT(1728.0,  11.0),  
      new DeltaT(1729.0,  11.0),  
      new DeltaT(1730.0,  11.0),  
      new DeltaT(1731.0,  11.0),  
      new DeltaT(1732.0,  11.0),  
      new DeltaT(1733.0,  11.0),  
      new DeltaT(1734.0,  12.0),  
      new DeltaT(1735.0,  12.0),  
      new DeltaT(1736.0,  12.0),  
      new DeltaT(1737.0,  12.0),  
      new DeltaT(1738.0,  12.0),  
      new DeltaT(1739.0,  12.0),  
      new DeltaT(1740.0,  12.0),  
      new DeltaT(1741.0,  12.0),  
      new DeltaT(1742.0,  12.0),  
      new DeltaT(1743.0,  12.0),  
      new DeltaT(1744.0,  13.0),  
      new DeltaT(1745.0,  13.0),  
      new DeltaT(1746.0,  13.0),  
      new DeltaT(1747.0,  13.0),  
      new DeltaT(1748.0,  13.0),  
      new DeltaT(1749.0,  13.0),  
      new DeltaT(1750.0,  13.0),  
      new DeltaT(1751.0,  14.0),  
      new DeltaT(1752.0,  14.0),  
      new DeltaT(1753.0,  14.0),  
      new DeltaT(1754.0,  14.0),  
      new DeltaT(1755.0,  14.0),  
      new DeltaT(1756.0,  14.0),  
      new DeltaT(1757.0,  14.0),  
      new DeltaT(1758.0,  15.0),  
      new DeltaT(1759.0,  15.0),  
      new DeltaT(1760.0,  15.0),  
      new DeltaT(1761.0,  15.0),  
      new DeltaT(1762.0,  15.0),  
      new DeltaT(1763.0,  15.0),  
      new DeltaT(1764.0,  15.0),  
      new DeltaT(1765.0,  16.0),  
      new DeltaT(1766.0,  16.0),  
      new DeltaT(1767.0,  16.0),  
      new DeltaT(1768.0,  16.0),  
      new DeltaT(1769.0,  16.0),  
      new DeltaT(1770.0,  16.0),  
      new DeltaT(1771.0,  16.0),  
      new DeltaT(1772.0,  16.0),  
      new DeltaT(1773.0,  16.0),  
      new DeltaT(1774.0,  16.0),  
      new DeltaT(1775.0,  17.0),  
      new DeltaT(1776.0,  17.0),  
      new DeltaT(1777.0,  17.0),  
      new DeltaT(1778.0,  17.0),  
      new DeltaT(1779.0,  17.0),  
      new DeltaT(1780.0,  17.0),  
      new DeltaT(1781.0,  17.0),  
      new DeltaT(1782.0,  17.0),  
      new DeltaT(1783.0,  17.0),  
      new DeltaT(1784.0,  17.0),  
      new DeltaT(1785.0,  17.0),  
      new DeltaT(1786.0,  17.0),  
      new DeltaT(1787.0,  17.0),  
      new DeltaT(1788.0,  17.0),  
      new DeltaT(1789.0,  17.0),  
      new DeltaT(1790.0,  17.0),  
      new DeltaT(1791.0,  17.0),  
      new DeltaT(1792.0,  16.0),  
      new DeltaT(1793.0,  16.0),  
      new DeltaT(1794.0,  16.0),  
      new DeltaT(1795.0,  16.0),  
      new DeltaT(1796.0,  15.0),  
      new DeltaT(1797.0,  15.0),  
      new DeltaT(1798.0,  14.0),  
      new DeltaT(1799.0,  14.0),  
      new DeltaT(1800.0,  13.7),  
      new DeltaT(1801.0,  13.4),  
      new DeltaT(1802.0,  13.1),  
      new DeltaT(1803.0,  12.9),  
      new DeltaT(1804.0,  12.7),  
      new DeltaT(1805.0,  12.6),  
      new DeltaT(1806.0,  12.5),  
      new DeltaT(1807.0,  12.5),  
      new DeltaT(1808.0,  12.5),  
      new DeltaT(1809.0,  12.5),  
      new DeltaT(1810.0,  12.5),  
      new DeltaT(1811.0,  12.5),  
      new DeltaT(1812.0,  12.5),  
      new DeltaT(1813.0,  12.5),  
      new DeltaT(1814.0,  12.5),  
      new DeltaT(1815.0,  12.5),  
      new DeltaT(1816.0,  12.5),  
      new DeltaT(1817.0,  12.4),  
      new DeltaT(1818.0,  12.3),  
      new DeltaT(1819.0,  12.2),  
      new DeltaT(1820.0,  12.0),  
      new DeltaT(1821.0,  11.7),  
      new DeltaT(1822.0,  11.4),  
      new DeltaT(1823.0,  11.1),  
      new DeltaT(1824.0,  10.6),  
      new DeltaT(1825.0,  10.2),  
      new DeltaT(1826.0,   9.6),  
      new DeltaT(1827.0,   9.1),  
      new DeltaT(1828.0,   8.6),  
      new DeltaT(1829.0,   8.0),  
      new DeltaT(1830.0,   7.5),  
      new DeltaT(1831.0,   7.0),  
      new DeltaT(1832.0,   6.6),  
      new DeltaT(1833.0,   6.3),  
      new DeltaT(1834.0,   6.0),  
      new DeltaT(1835.0,   5.8),  
      new DeltaT(1836.0,   5.7),  
      new DeltaT(1837.0,   5.6),  
      new DeltaT(1838.0,   5.6),  
      new DeltaT(1839.0,   5.6),  
      new DeltaT(1840.0,   5.7),  
      new DeltaT(1841.0,   5.8),  
      new DeltaT(1842.0,   5.9),  
      new DeltaT(1843.0,   6.1),  
      new DeltaT(1844.0,   6.2),  
      new DeltaT(1845.0,   6.3),  
      new DeltaT(1846.0,   6.5),  
      new DeltaT(1847.0,   6.6),  
      new DeltaT(1848.0,   6.8),  
      new DeltaT(1849.0,   6.9),  
      new DeltaT(1850.0,   7.1),  
      new DeltaT(1851.0,   7.2),  
      new DeltaT(1852.0,   7.3),  
      new DeltaT(1853.0,   7.4),  
      new DeltaT(1854.0,   7.5),  
      new DeltaT(1855.0,   7.6),  
      new DeltaT(1856.0,   7.7),  
      new DeltaT(1857.0,   7.7),  
      new DeltaT(1858.0,   7.8),  
      new DeltaT(1859.0,   7.8),  
      new DeltaT(1860.0,   7.88), 
      new DeltaT(1861.0,   7.82), 
      new DeltaT(1862.0,   7.54), 
      new DeltaT(1863.0,   6.97), 
      new DeltaT(1864.0,   6.40), 
      new DeltaT(1865.0,   6.02), 
      new DeltaT(1866.0,   5.41), 
      new DeltaT(1867.0,   4.10), 
      new DeltaT(1868.0,   2.92), 
      new DeltaT(1869.0,   1.82), 
      new DeltaT(1870.0,   1.61), 
      new DeltaT(1871.0,   0.10), 
      new DeltaT(1872.0,  -1.02), 
      new DeltaT(1873.0,  -1.28), 
      new DeltaT(1874.0,  -2.69), 
      new DeltaT(1875.0,  -3.24), 
      new DeltaT(1876.0,  -3.64), 
      new DeltaT(1877.0,  -4.54), 
      new DeltaT(1878.0,  -4.71), 
      new DeltaT(1879.0,  -5.11), 
      new DeltaT(1880.0,  -5.40), 
      new DeltaT(1881.0,  -5.42), 
      new DeltaT(1882.0,  -5.20), 
      new DeltaT(1883.0,  -5.46), 
      new DeltaT(1884.0,  -5.46), 
      new DeltaT(1885.0,  -5.79), 
      new DeltaT(1886.0,  -5.63), 
      new DeltaT(1887.0,  -5.64), 
      new DeltaT(1888.0,  -5.80), 
      new DeltaT(1889.0,  -5.66), 
      new DeltaT(1890.0,  -5.87), 
      new DeltaT(1891.0,  -6.01), 
      new DeltaT(1892.0,  -6.19), 
      new DeltaT(1893.0,  -6.64), 
      new DeltaT(1894.0,  -6.44), 
      new DeltaT(1895.0,  -6.47), 
      new DeltaT(1896.0,  -6.09), 
      new DeltaT(1897.0,  -5.76), 
      new DeltaT(1898.0,  -4.66), 
      new DeltaT(1899.0,  -3.74), 
      new DeltaT(1900.0,  -2.72), 
      new DeltaT(1901.0,  -1.54), 
      new DeltaT(1902.0,  -0.02), 
      new DeltaT(1903.0,   1.24), 
      new DeltaT(1904.0,   2.64), 
      new DeltaT(1905.0,   3.86), 
      new DeltaT(1906.0,   5.37), 
      new DeltaT(1907.0,   6.14), 
      new DeltaT(1908.0,   7.75), 
      new DeltaT(1909.0,   9.13), 
      new DeltaT(1910.0,  10.46), 
      new DeltaT(1911.0,  11.53), 
      new DeltaT(1912.0,  13.36), 
      new DeltaT(1913.0,  14.65), 
      new DeltaT(1914.0,  16.01), 
      new DeltaT(1915.0,  17.20), 
      new DeltaT(1916.0,  18.24), 
      new DeltaT(1917.0,  19.06), 
      new DeltaT(1918.0,  20.25), 
      new DeltaT(1919.0,  20.95), 
      new DeltaT(1920.0,  21.16), 
      new DeltaT(1921.0,  22.25), 
      new DeltaT(1922.0,  22.41), 
      new DeltaT(1923.0,  23.03), 
      new DeltaT(1924.0,  23.49), 
      new DeltaT(1925.0,  23.62), 
      new DeltaT(1926.0,  23.86), 
      new DeltaT(1927.0,  24.49), 
      new DeltaT(1928.0,  24.34), 
      new DeltaT(1929.0,  24.08), 
      new DeltaT(1930.0,  24.02), 
      new DeltaT(1931.0,  24.00), 
      new DeltaT(1932.0,  23.87), 
      new DeltaT(1933.0,  23.95), 
      new DeltaT(1934.0,  23.86), 
      new DeltaT(1935.0,  23.93), 
      new DeltaT(1936.0,  23.73), 
      new DeltaT(1937.0,  23.92), 
      new DeltaT(1938.0,  23.96), 
      new DeltaT(1939.0,  24.02), 
      new DeltaT(1940.0,  24.33), 
      new DeltaT(1941.0,  24.83), 
      new DeltaT(1942.0,  25.30), 
      new DeltaT(1943.0,  25.70), 
      new DeltaT(1944.0,  26.24), 
      new DeltaT(1945.0,  26.77), 
      new DeltaT(1946.0,  27.28), 
      new DeltaT(1947.0,  27.78), 
      new DeltaT(1948.0,  28.25), 
      new DeltaT(1949.0,  28.71), 
      new DeltaT(1950.0,  29.15), 
      new DeltaT(1951.0,  29.57), 
      new DeltaT(1952.0,  29.97), 
      new DeltaT(1953.0,  30.36), 
      new DeltaT(1954.0,  30.72), 
      new DeltaT(1955.0,  31.07), 
      new DeltaT(1956.0,  31.35), 
      new DeltaT(1957.0,  31.68), 
      new DeltaT(1958.0,  32.18), 
      new DeltaT(1959.0,  32.68), 
      new DeltaT(1960.0,  33.15), 
      new DeltaT(1961.0,  33.59), 
      new DeltaT(1962.0,  34.00), 
      new DeltaT(1963.0,  34.47), 
      new DeltaT(1964.0,  35.03), 
      new DeltaT(1965.0,  35.73), 
      new DeltaT(1966.0,  36.54), 
      new DeltaT(1967.0,  37.43), 
      new DeltaT(1968.0,  38.29), 
      new DeltaT(1969.0,  39.20), 
      new DeltaT(1970.0,  40.18), 
      new DeltaT(1971.0,  41.17), 
      new DeltaT(1972.0,  42.23), 
      new DeltaT(1973.0,  43.37), 
      new DeltaT(1974.0,  44.49), 
      new DeltaT(1975.0,  45.48), 
      new DeltaT(1976.0,  46.46), 
      new DeltaT(1977.0,  47.52), 
      new DeltaT(1978.0,  48.53), 
      new DeltaT(1979.0,  49.59), 
      new DeltaT(1980.0,  50.54), 
      new DeltaT(1981.0,  51.38), 
      new DeltaT(1982.0,  52.17), 
      new DeltaT(1983.0,  52.96), 
      new DeltaT(1984.0,  53.79), 
      new DeltaT(1985.0,  54.34), 
      new DeltaT(1986.0,  54.87), 
      new DeltaT(1987.0,  55.32), 
      new DeltaT(1988.0,  55.82), 
      new DeltaT(1989.0,  56.30), 
      new DeltaT(1990.0,  56.86), 
      new DeltaT(1991.0,  57.57), 
      new DeltaT(1992.0,  58.31), 
      new DeltaT(1993.0,  59.12), 
      new DeltaT(1994.0,  59.98), 
      new DeltaT(1995.0,  60.78), 
      new DeltaT(1996.0,  61.63), 
      new DeltaT(1997.0,  62.29), 
      new DeltaT(1998.0,  62.97), 
      new DeltaT(1999.0,  63.47), 
      new DeltaT(2000.0,  63.83), 
      new DeltaT(2001.0,  64.09), 
      new DeltaT(2002.0,  64.30), 
      new DeltaT(2003.0,  64.47), 
      new DeltaT(2004.0,  64.57),  
      new DeltaT(2005.0,  64.69),  
      new DeltaT(2006.0,  64.85),  
      new DeltaT(2007.0,  65.15),  
      new DeltaT(2008.0,  68.0),  
      new DeltaT(2009.0,  69.0),  
      new DeltaT(2010.0,  70.0),  
      new DeltaT(2011.0,  70.0),  
      new DeltaT(2012.0,  71.0),  
      new DeltaT(2013.0,  72.0),  
      new DeltaT(2014.0,  73.0)
   );
   
};

window.astro_utils = new Astro_Utils();