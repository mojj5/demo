Number.prototype.toFixed = function(s) {
	changenum = (parseInt(this * Math.pow(10, s) + 0.5) / Math.pow(10, s)).toString();
	index = changenum.indexOf(".");
	if (index < 0 && s > 0) {
		changenum = changenum + ".";
		for (i = 0; i < s; i++) {
			changenum = changenum + "0";
		}
	} else {
		index = changenum.length - index;
		for (i = 0; i < (s - index) + 1; i++) {
			changenum = changenum + "0";
		}
	}
	return changenum;
}