var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
function flattenArray(obj) {
	var arraytemp = [];
	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			arraytemp.push(obj[key]);
		}
	}
	return arraytemp;
}

function unique(arr) {
	var a = [];
	var l = arr.length;
	for (var i = 0; i < l; i++) {
		for (var j = i + 1; j < l; j++) {
			// If a[i] is found later in the array
			if (arr[i] === arr[j]) j = ++i;
		}
		a.push(arr[i]);
	}
	return a;
}
