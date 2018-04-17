"use strict";

var calendar_preferences = (function () {
 
  // Instance stores a reference to the Singleton
  var instance;
 
  function init() {
  
     if(typeof String.prototype.trim !== 'function')
     {
        String.prototype.trim = function()
        {
           return this.replace(/^\s+|\s+$/g, ''); 
        }
     };
     
     function hasStorage()
     {
        if (typeof(Storage) !== "undefined")
           return true;
        else
           return false;
     }
 
    // It's a Singleton Pattern! - There are private methods and variables!!!!!!!!
    function cookiesEnabled()
    {
       var cookieEnabled = (navigator.cookieEnabled) ? true : false;

       if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
       { 
           document.cookie="testcookie";
           cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
       }
       
       return (cookieEnabled);
    }
    
    function setCookie(cname, cvalue)
    {
       var d = new Date();
       var exdays = 4000; // > 10 years.
       d.setTime(d.getTime()+(exdays*24*60*60*1000));
       var expires = "expires="+d.toUTCString();
       document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    
    function getCookie(cname)
    {
       var result = "";
       var name1 = cname + "=";
       var ca = document.cookie.split(';');
       for(var i=0; i < ca.length; i++)
       {
          var c = ca[i].trim();
          if (c.indexOf(name1)==0)
          {
             result = c.substring(name1.length,c.length);
          }
       }
       return result;
    }
 
    var validKeys = ["firstDayOfWeek",   // numeric, 0..6
                     "gregorianJD1",     // numeric, first Julian date in Gregorian calendar
                     "phaseTime",        // Time at which phases are calculated: localMidnight, utcMidnight, localTime
                     "northUp",          // true, false
                     "positionAngle",    // true, false
                     "scaling",          // normal, none, or exaggerated
                     "language",         // Language localization, i.e., 'en', 'hi-IN'
                     "tooltips",         // true, false. Show/hide tooltips.
                     "legend",           // true, false. Show/hide legend.
                     "timeFormat"//,       // 12 or 24. Time format for local time.
                     /*"version",          // numeric
                     "revision"*/];        // numeric
                     
    var _version = "1";
    var _dotRevision = "4\u03B2;";
    
    return {
      values: {"firstDayOfWeek":"0",
               "gregorianJD1":"2299160.5",
               "phaseTime":"localMidnight",
               "northUp":"true",
               "positionAngle":"true",
               "scaling":"normal",
               "language":"en",
               "tooltips":"true",
               "legend":"true",
               "timeFormat":"24",
               "version":_version,
               "revision":_dotRevision},
      
      loadPreferences: function()
      {
         if(hasStorage())
         {
            for (var i = 0; i < validKeys.length; i++)
            {
               var key = validKeys[i];
               var val = localStorage.getItem(key);

               if (val !== null && val !== "null")
               {
                  this.values[key] = val;
               }
            }
         }
         else
         {
            for (var i = 0; i < validKeys.length; i++)
            {
               var key = validKeys[i];
               var val = $.cookie(key);

               if (typeof val !== "undefined")
               {
                  this.values[key] = val;
               }
            }
         }
      },
      
      savePreferences: function()
      {
         if (hasStorage())
         {
            for (var i = 0; i < validKeys.length; i++)
            {
               var key = validKeys[i];
               localStorage.setItem(key, this.values[key]);
            }
            localStorage.setItem("version", _version);
            localStorage.setItem("revision", _dotRevision);
         }
         else
         {
            for (var i = 0; i < validKeys.length; i++)
            {
               var key = validKeys[i];
               $.cookie(key, this.values[key], {expires: 4000});
            }
            $.cookie("version", _version, {expires: 4000});
            $.cookie("revision", _dotRevision, {expires: 4000});
         }
      }
    };
 
  };
 
  return {

    getInstance: function () {
 
      if ( !instance ) {
        instance = init();
      }
 
      return instance;
    }
 
  };
 
})();