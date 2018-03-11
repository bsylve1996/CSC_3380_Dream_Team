function changeTheTime(value){
	var d = new Date();
	//use value to determine desired date and use actual date to return a new date
	d.setHours(0);
	var stringy = d.getHours() + ":" + d.getMinutes();
	return stringy;
}
//create local variables of time and get time variables so other js documents can call them
var computerTime = new Date();
var currentTime = {
	hour : computerTime.getHours(),
	minutes : computerTime.getMinutes(),
	timezone : Intl.DateTimeFormat().resolvedOptions().timeZone,
	day : computerTime.getDate(),
	dayOfTheWeek : computerTime.getDay(),
	dayOfTheWeekString : "n/a",
	monthString : "n/a",
	year : computerTime.getFullYear(),
	month : computerTime.getMonth(),
	choice1 : false,
	choice2 : false,
	getTime : function() {
		if(!currentTime.choice1){
			if(currentTime.dayOfTheWeek == 0)
				currentTime.dayOfTheWeekString = "Sunday";
			else if(currentTime.dayOfTheWeek == 1)
				currentTime.dayOfTheWeekString = "Monday";
			else if(currentTime.dayOfTheWeek == 2)
				currentTime.dayOfTheWeekString = "Tuesday";
			else if(currentTime.dayOfTheWeek == 3)
				currentTime.dayOfTheWeekString = "Wednesday";
			else if(currentTime.dayOfTheWeek == 4)
				currentTime.dayOfTheWeekString = "Thursday";
			else if(currentTime.dayOfTheWeek == 5)
				currentTime.dayOfTheWeekString = "Friday";
			else if(currentTime.dayOfTheWeek == 6)
				currentTime.dayOfTheWeekString = "Saturday";
		}
		if(!currentTime.choice2){
			if(currentTime.month == 0)
				currentTime.monthString = "January";
			else if(currentTime.month == 1)
				currentTime.monthString = "February";
			else if(currentTime.month == 2)
				currentTime.monthString = "March";
			else if(currentTime.month == 3)
				currentTime.monthString = "April";
			else if(currentTime.month == 4)
				currentTime.monthString = "May";
			else if(currentTime.month == 5)
				currentTime.monthString = "June";
			else if(currentTime.month == 6)
				currentTime.monthString = "July";
			else if(currentTime.month == 7)
				currentTime.monthString = "August";
			else if(currentTime.month == 8)
				currentTime.monthString = "September";
			else if(currentTime.month == 9)
				currentTime.monthString = "October";
			else if(currentTime.month == 10)
				currentTime.monthString = "November";
			else if(currentTime.month == 11)
				currentTime.monthString = "December";
		}

		currentTime.minutes = String(new Date().getMinutes());

		return(currentTime.dayOfTheWeekString + ", " + currentTime.monthString + " " + currentTime.day + ", " + currentTime.year + " " + currentTime.hour + ":" + currentTime.minutes);
	}
};

function updateTime(){
	return currentTime.getTime();
}