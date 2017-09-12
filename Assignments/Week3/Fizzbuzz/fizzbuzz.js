var main = function () {
	document.getElementById('fizzbuzzBtn').addEventListener('click', valValidation, false);
	
  //function to print fizzbuzz
	function fizzBuzz(val_1,val_2) {
		for (var i = val_1; i <= val_2; i++) {
			if ( i % 3 == 0 && i % 5 == 0 ) {
				console.log("FizzBuzz");
			} else if ( i % 3 == 0 ) {
				console.log("Fizz");
			} else if ( i % 5 == 0 ) {
				console.log("Buzz");
			} else {
				console.log(i);
			}
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
