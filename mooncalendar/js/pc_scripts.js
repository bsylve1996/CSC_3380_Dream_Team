function get_m(name, host, domain, fill, fill_id)
{
   var result = "<a " + fill_id + " href=\"" + "mailto:" + name + "@" + host + "." + domain + "?subject=" + document.title + "\">" + fill + "</a>";
   return result;
}

function WebObject(url, title)
{
   this.url = url;
   this.title = title;
}

function getLinks()
{

   pathToRoot = "../"; 
   
   webArray = new Array();
   
   webArray[webArray.length] =
      new WebObject(pathToRoot + "old/Home.html",
                    "Paul Carlisle's Home Page");
                    
   webArray[webArray.length] =
      new WebObject(pathToRoot + "mooncalendar",
                    "Moon Calendar");
                    
   webArray[webArray.length] =
      new WebObject(pathToRoot + "old/earthviewer.html",
                    "Earth Viewer");
                    
   webArray[webArray.length] =
      new WebObject(pathToRoot + "old/spudgun.html",
                    "Spud Gun &#073;"); 
                    
   webArray[webArray.length] =
      new WebObject(pathToRoot + "old/trebuchet.html",
                    "The Trebuchet");
                    
   webArray[webArray.length] =
      new WebObject(pathToRoot + "codedaperture",
                    "Coded Aperture Imaging");
                    
   webArray[webArray.length] =
      new WebObject(pathToRoot + "old/soapfilms.html",
                    "Flowing Soap Films");
                    
   webArray[webArray.length] =
      new WebObject(pathToRoot + "support",
                    "support this site");
    
   tempStr = "";
   document.write("<ul style=\"margin:0px; padding-left:0px;\">");                
   for (i = 0; i < webArray.length; i++)
   {
      if (webArray[i].title.toLowerCase() != document.title.toLowerCase())
      {
         document.write("<li>");
         tempStr = "<a class=\"layout\" href = \"" + webArray[i].url + "\">" + webArray[i].title.toLowerCase() + "</a>";
      } 
      else
      {
         document.write("<li class=\"current\">");
         tempStr = webArray[i].title.toLowerCase();
      }
      document.write(tempStr + "</li>");
   }
   var em = get_m("paulcarlisle", "paulcarlisle", "net", "send&#160;email", "class=\"layout\"");
   str = "<li>" + em + "</li>";
   document.write(str);
   document.write("</ul>");
}
