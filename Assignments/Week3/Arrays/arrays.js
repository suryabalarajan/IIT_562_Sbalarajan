var main = function () {
	document.getElementById("button").addEventListener('click', calculateLargest, false);

	function calculateLargest() {
		var strArray = document.getElementById("array").value;
		
		
		console.log(strArray);
		var numArray = strArray.split(",").map(Number);
		var regex = /^-?(0|[1-9]\d*)(\.\d+)?$/;

		for ( var i = 0; i < numArray.length; i++) {
			if(!regex.test(numArray[i])) {
				alert("Please, Enter valid numbers ");
			}
		}
		if (numArray.length < 3) {
			alert(" Length of the array is less than three! ");
		} else {
			numArray.sort(function(a,b){
	    		if(a < b) { 
	    			return 1;
	    		} else if ( a == b) {
	    			return 0;
	    		} else {
	    			return -1;
	    		}
    		});
        	document.getElementById("result").innerHTML = "Three Largest Numbers : " + numArray[0] +", " + numArray[1] + ", " + numArray[2];
		}
		
	};

};
$(document).ready(main);