var main = function () {
	document.getElementById('fizzbuzzBtn').addEventListener('click', valValidation, false);
	var ul = document.getElementById("fizzbuzzlist"), msg;
	
  //function to print fizzbuzz
	function fizzBuzz(val_1,val_2) {
		for (var i = val_1; i <= val_2; i++) {
			if ( i % 3 == 0 && i % 5 == 0 ) {
				msg = "Fizzbuzz";
			} else if ( i % 3 == 0 ) {
				msg = "Fizz";
			} else if ( i % 5 == 0 ) {
				msg = "Buzz";
			} else {
				msg = i;
			}
			var li = document.createElement("li");
			li.appendChild(document.createTextNode(i + " = " + msg));
			li.setAttribute("class", msg);
			ul.appendChild(li);
		}
	};
  
  // function to validate the numbers entered
	function valValidation() {
		var regex = /^-?(0|[1-9]\d*)(\.\d+)?$/;
		var firstVal = document.getElementById('val1');
		var secondVal = document.getElementById('val2');

		if (firstVal.value.trim().length === 0 || secondVal.value.trim().length === 0) {
			alert("Either of the Values is Empty");
		} else if (!regex.test(firstVal.value) || !regex.test(secondVal.value)) {
			alert("Either of the Values is not a Number ");	
		} else if (parseFloat(firstVal.value) > parseFloat(secondVal.value)){
			alert(" Start value is greater than the End value");
		} else {
			fizzBuzz(parseFloat(firstVal.value), parseFloat(secondVal.value));
		}
	}
};
$(document).ready(main);
