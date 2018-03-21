
function runpromt(){
var statesdemo = {
	state0: {
		title: 'Event',
		html:'<label>First <input type="text" name="fname" value=""></label><br />'+
			'<label>Last <input type="text" name="lname" value=""></label><br />',
		buttons: { Next: 1 },
		//focus: "input[name='fname']",
		submit:function(e,v,m,f){
			console.log(f);

			e.preventDefault();
			$.prompt.goToState('state1');
		}
	},
	state1: {
		title: 'Gender',
		html:'<label><input type="radio" name="gender" value="Male"> Male</label><br />'+
			'<label><input type="radio" name="gender" value="Female"> Female</label>',
		buttons: { Back: -1, Next: 1 },
		//focus: ":input:first",
		submit:function(e,v,m,f){
			console.log(f);

			if(v==1) $.prompt.goToState('state2')
			if(v==-1) $.prompt.goToState('state0');
			e.preventDefault();
		}
	},
	state2: {
		title: 'Transportation',
		html:'<label>Travels By <select name="travel" multiple>'+
				'<option value="Car" selected>Car</option>'+
				'<option value="Bus">Bus</option>'+
				'<option value="Plane" selected>Plane</option>'+
				'<option value="Train">Train</option>'+
			'</select></label>',
		buttons: { Back: -1, Done: 1 },
		focus: 1,
		submit:function(e,v,m,f){
			console.log(f);

			e.preventDefault();
			if(v==1) $.prompt.close();
			if(v==-1) $.prompt.goToState('state1');
		}
	},
};

$.prompt(statesdemo);
}

var multiplePromptsCounter = 1;

function openMultiplePrompts(){

	$.prompt("Do you want to open another?", {
		title: "A Prompt Has Opened: "+ multiplePromptsCounter++,
		buttons: { "Yes, Open Another": true, "No, Close This One": false },
		persistent: false,
		submit: function(e,v,m,f){
			if(v){
				e.preventDefault();
				openMultiplePrompts();
			}
		}
	});
}
