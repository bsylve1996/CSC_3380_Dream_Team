//create local variables of time and get time variables so other js documents can call them
var computerTime = new Date();
var currentTime = {
	hour : computerTime.getHours(),
	minutes : computerTime.getMinutes(),
	timeZone : Intl.DateTimeFormat().resolvedOptions().timeZone,
	day : computerTime.getDate(),
	dayOfTheWeek : computerTime.getDay(),
	dayOfTheWeekString : "n/a",
	monthString : "n/a",
	year : computerTime.getFullYear(),
	month : computerTime.getMonth(),
	choice1 : false,
	choice2 : false,
	updateTime : function() {
		oldminutes = currentTime.minutes
		currentTime.minutes = String(new Date().getMinutes());
		if (currentTime.minutes == 0 && oldminutes == 59)
			currentTime.hour++;
		if (currentTime.hour > 24){
			currentTime.hour -= 24;
			currentTime.dayOfTheWeek++
			currentTime.day++;
			if (currentTime.dayOfTheWeek > 6)
				currentTime.dayOfTheWeek = 0;
			currentTime.choice1 = false
			switch(currentTime.month){
				case 0: case 2:case 4:case 6:case 7:case 9:
					if(currentTime.day == 32){
						currentTime.month++;
						currentTime.choice2 = false;
						currentTime.day = 1;
					}
					break;
				case 1:
					if(isLeapYear(currentTime.year))
						if (currentTime.day == 30){
							currentTime.month++;
							currentTime.choice2 = false;
							currentTime.day = 1;
						}
					else
						if (currentTime.day == 29){
							currentTime.month++;
							currentTime.choice2 = false;
							currentTime.day = 1;
						}
					break;
				case 3:case 5:case 8:case 10:
					if(currentTime.day == 31){
						currentTime.month++;
						currentTime.choice2 = false;
						currentTime.day = 1;
					}
					break;
				case 11:
					if(currentTime.day == 32){
						currentTime.month = 0;
						currentTime.choice2 = false;
						currentTime.day = 1;
						currentTime.year++;
					}
					break;
			}
		}

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
			currentTime.choice1 = true;
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
			currentTime.choice2 = true;
		}
		
		if (currentTime.hour > 12){
			if (currentTime.minutes < 10)
				return(currentTime.dayOfTheWeekString + ", " + currentTime.monthString + " " + currentTime.day + ", " + currentTime.year + " " + (currentTime.hour-12) + ":0" + currentTime.minutes + " PM");
			else
				return(currentTime.dayOfTheWeekString + ", " + currentTime.monthString + " " + currentTime.day + ", " + currentTime.year + " " + (currentTime.hour-12) + ":" + currentTime.minutes + " PM");
		
		}
		else if (currentTime.hour == 0){
			if (currentTime.minutes < 10)
				return(currentTime.dayOfTheWeekString + ", " + currentTime.monthString + " " + currentTime.day + ", " + currentTime.year + " 12:0" + currentTime.minutes + " AM");
			else
				return(currentTime.dayOfTheWeekString + ", " + currentTime.monthString + " " + currentTime.day + ", " + currentTime.year + " 12:" + currentTime.minutes + " AM");
		
		}
		else {	
			if (currentTime.minutes < 10)
				return(currentTime.dayOfTheWeekString + ", " + currentTime.monthString + " " + currentTime.day + ", " + currentTime.year + " " + currentTime.hour + ":0" + currentTime.minutes + " AM");
			else
				return(currentTime.dayOfTheWeekString + ", " + currentTime.monthString + " " + currentTime.day + ", " + currentTime.year + " " + currentTime.hour + ":" + currentTime.minutes + " AM");
		}
	},

	negativeTime : function() {
		if (currentTime.hour > -1){
		}
		else{
			currentTime.hour += 24;
			currentTime.day--;
			currentTime.dayOfTheWeek--;
			currentTime.choice1 = false;
			if (currenTime.dayOfTheWeek < 0)
				currentTime.dayOfTheWeek = 6;
			if (currentTime.day == 0){
				currentTime.choice2 = false;
				switch(currentTime.month){
					case 0://jan
						currentTime.month = 11;
						currentTime.day = 31;
						currentTime.year--;
					case 2://march
						if(isLeapYear(currentTime.year)){
							currentTime.day = 29;
						}
						else{
							currentTime.day = 28;
						}
						currentTime.month--;
					case 1:case 4:case 6:case 8:case 10:
						currentTime.day = 31;
						currentTime.month--;
					case 3:case 5:case 7:case 9:case 11:
						currentTime.month--;
						currentTime.day = 30;
				}			
				
			}
		}
		currentTime.updateTime();
	}
};

function isLeapYear(year){
	if ((year % 4) == 0){
  		if (year % 100 == 0){
    		if (year % 400 != 0){
    			return false;
    		}
    		else{
    		return true;
    		}
  		}
  		else{
    		return true;
  		}
 	}
 	else{
    	return false;
 	} 
}

function getTime(){
	return currentTime.updateTime();
}

var HawaiiStandard = ["Etc/GMT+10", "Pacific/Honolulu", "Pacific/Johnston", "Pacific/Rarotonga", "Pacific/Tahiti"];
var AlaskanStandard = ["America/Anchorage", "America/Juneau", "America/Nome", "America/Sitka", "America/Yakutat"];
var PacificStandard = ["America/Dawson", "America/Los_Angeles", "America/Tijuana", "America/Vancouver", "America/Whitehorse", "PST8PDT"];
var MountainStandard = ["America/Creston", "America/Dawson_Creek", "America/Hermosillo", "America/Phoenix", "Etc/GMT+7"];
var CentralStandard = ["America/Chicago", "America/Indiana/Knox", "America/Indiana/Tell_City", "America/Matamoros", "America/Menominee", "America/North_Dakota/Beulah", "America/North_Dakota/Center", "America/North_Dakota/New_Salem","America/Rainy_River", "America/Rankin_Inlet", "America/Resolute", "America/Winnipeg", "CST6CDT"];
var EasternStandard = ["America/Detroit", "America/Havana",  "America/Indiana/Petersburg", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Iqaluit", "America/Kentucky/Monticello", "America/Louisville", "America/Montreal", "America/Nassau", "America/New_York", "America/Nipigon", "America/Pangnirtung", "America/Port-au-Prince", "America/Thunder_Bay", "America/Toronto", "EST5EDT"];
var timeZoneArray = [HawaiiStandard, AlaskanStandard, PacificStandard, MountainStandard, CentralStandard, EasternStandard]

function searchForTimeZone(timeZone){
	var standard;
	var timezoneType;
	for (var i = 0; i < timeZoneArray.length; i++) { 
		for (var k = 0; k < timeZoneArray[i].length; k++){ 
			if (timeZoneArray[i][k] == timeZone){
				standard = i;
				break;
			}
		}
	}
	switch(standard){
		case 0:
			return "Hawaii";
		case 1:
			return "Alaskan";
		case 2:
			return "Pacific";
		case 3:
			return "Mountain";
		case 4:
			return "Central";
		case 5:
			return "Eastern";
	}
}

var timeZoneArrayShort = ["Hawaii", "Alaskan", "Pacific", "Mountain", "Central", "Eastern"]
function changeTheTime(value){
	if (value == 0)
		return;
	yourTimeZone = searchForTimeZone(currentTime.timeZone);
	desiredTimeZone = timeZoneArrayShort[value - 1]
	if (yourTimeZone == desiredTimeZone){
		return;
	}
	else if (yourTimeZone == "Hawaii"){
		if (desiredTimeZone == "Alaskan"){
			currentTime.hour += 2;
			currentTime.updateTime();
			currentTime.timeZone = AlaskanStandard[0];
			return;
		}
		else if (desiredTimeZone == "Pacific"){
			currentTime.hour += 3;
			currentTime.updateTime();
			currentTime.timeZone = PacificStandard[0];
			return;
		}
		else if (desiredTimeZone == "Mountain"){
			currentTime.hour += 4;
			currentTime.updateTime();
			currentTime.timeZone = MountainStandard[0];
			return;
		}
		else if (desiredTimeZone == "Central"){
			currentTime.hour += 5;
			currentTime.updateTime();
			currentTime.timeZone = CentralStandard[0];
			return;
		}
		else if (desiredTimeZone == "Eastern"){
			currentTime.hour += 6;
			currentTime.updateTime();
			currentTime.timeZone = EasternStandard[0];
			return;
		}
	}
	else if (yourTimeZone == "Alaskan"){
		if (desiredTimeZone == "Hawaii"){
			currentTime.hour  -= 2;
			currentTime.negativeTime();
			currentTime.timeZone = HawaiiStandard[0];
			return;
		}
		else if (desiredTimeZone == "Pacific"){
			currentTime.hour += 1;
			currentTime.updateTime();
			currentTime.timeZone = PacificStandard[0];
			return;
		}
		else if (desiredTimeZone == "Mountain"){
			currentTime.hour += 2;
			currentTime.updateTime();
			currentTime.timeZone = MountainStandard[0];
			return;
		}
		else if (desiredTimeZone == "Central"){
			currentTime.hour += 3;
			currentTime.updateTime();
			currentTime.timeZone = CentralStandard[0];
			return;
		}
		else if (desiredTimeZone == "Eastern"){
			currentTime.hour += 4;
			currentTime.updateTime();
			currentTime.timeZone = EasternStandard[0];
			return;
		}
	}
	else if (yourTimeZone == "Pacific"){
		if (desiredTimeZone == "Hawaii"){
			currentTime.hour  -= 3;
			currentTime.negativeTime();
			currentTime.timeZone = HawaiiStandard[0];
			return;
		}
		else if (desiredTimeZone == "Alaskan"){
			currentTime.hour  -= 1;
			currentTime.negativeTime();
			currentTime.timeZone = AlaskanStandard[0];
			return;
		}
		else if (desiredTimeZone == "Mountain"){
			currentTime.hour += 1;
			currentTime.updateTime();
			currentTime.timeZone = MountainStandard[0];
			return;
		}
		else if (desiredTimeZone == "Central"){
			currentTime.hour += 2;
			currentTime.updateTime();
			currentTime.timeZone = CentralStandard[0];
			return;
		}
		else if (desiredTimeZone == "Eastern"){
			currentTime.hour += 3;
			currentTime.updateTime();
			currentTime.timeZone = EasternStandard[0];
			return;
		}
	}
	else if (yourTimeZone == "Mountain"){
		if (desiredTimeZone == "Hawaii"){
			currentTime.hour  -= 4;
			currentTime.negativeTime();
			currentTime.timeZone = HawaiiStandard[0];
			return;
		}
		else if (desiredTimeZone == "Alaskan"){
			currentTime.hour  -= 2;
			currentTime.negativeTime();
			currentTime.timeZone = AlaskanStandard[0];
			return;
		}
		else if (desiredTimeZone == "Pacific"){
			currentTime.hour  -= 1;
			currentTime.negativeTime();
			currentTime.timeZone = PacificStandard[0];
			return;
		}
		else if (desiredTimeZone == "Central"){
			currentTime.hour += 1;
			currentTime.updateTime();
			currentTime.timeZone = CentralStandard[0];
			return;
		}
		else if (desiredTimeZone == "Eastern"){
			currentTime.hour += 2;
			currentTime.updateTime();
			currentTime.timeZone = EasternStandard[0];
			return;
		}
	}
	else if (yourTimeZone == "Central"){
		if (desiredTimeZone == "Hawaii"){
			currentTime.hour -= 5;
			currentTime.negativeTime();
			currentTime.timeZone = HawaiiStandard[0];
			return;
		}
		else if (desiredTimeZone == "Alaskan"){
			currentTime.hour -= 3;
			currentTime.negativeTime();
			currentTime.timeZone = AlaskanStandard[0];
			return;
		}
		else if (desiredTimeZone == "Pacific"){
			currentTime.hour -= 2;
			currentTime.negativeTime();
			currentTime.timeZone = PacificStandard[0];
			return;
		}
		else if (desiredTimeZone == "Mountain"){
			currentTime.hour -= 1;
			currentTime.negativeTime();
			currentTime.timeZone = MountainStandard[0];
			return;
		}

		else if (desiredTimeZone == "Eastern"){
			currentTime.hour += 1;
			currentTime.updateTime();
			currentTime.timeZone = EasternStandard[0];
			return;
		}
	}
	else if (yourTimeZone == "Eastern"){
		if (desiredTimeZone == "Hawaii"){
			currentTime.hour -= 6;
			currentTime.negativeTime();
			currentTime.timeZone = HawaiiStandard[0];
			return;
		}
		else if (desiredTimeZone == "Alaskan"){
			currentTime.hour -= 4;
			currentTime.negativeTime();
			currentTime.timeZone = AlaskanStandard[0];
			return;
		}
		else if (desiredTimeZone == "Pacific"){
			currentTime.hour -= 3;
			currentTime.negativeTime();
			currentTime.timeZone = PacificStandard[0];
			return;
		}
		else if (desiredTimeZone == "Mountain"){
			currentTime.hour -= 2;
			currentTime.negativeTime();
			currentTime.timeZone = MountainStandard[0];
			return;
		}
		else if (desiredTimeZone == "Central"){
			currentTime.hour -= 1;
			currentTime.negativeTime();
			currentTime.timeZone = CentralStandard[0];
			return;
		}
	}
	console.log("You Fucked up and Your TimeZone doesn't exist")
}