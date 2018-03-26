
  //for changing info in the tabs
function openAction(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
//java script for changing greeting
var today = new Date();
var hourNow = today.getHours();
var greeting;
 if (hourNow>18){
  greeting = 'Good Evening';
}
else if (hourNow > 12){
  greeting = 'Good Afternoon';
}
else if (hourNow > 0){
  greeting = 'Good Morning';
}
else{
  greeting = 'Welcome';
}

function eventPrompt(){

var eventName, time, date, description;


}

