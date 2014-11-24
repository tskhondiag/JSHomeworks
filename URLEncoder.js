var whitelist = "!#$&'()*+,-./:;=?@_~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

var encodeChar = function(c) {
	var result = '';

	var charCode = c.charCodeAt(0);

	if (whitelist.indexOf(c) != -1)
		result += c;
	else {
		var bin = charCode.toString(2);

		if (bin.length <= 7) {
			result += ('%' + charCode.toString(16));
		} else if (bin.length <= 11) {
			var zeros = 11 - bin.length;
			var mask1 = '110';
			mask1 += Array(zeros + 1).join('0');
			var remaining = 8 - 3 - zeros;
			mask1 += bin.substr(0, remaining);
			var mask2 = '10';
			mask2 += bin.substr(remaining);
			result += ('%' + parseInt(mask1, 2).toString(16) + '%' + parseInt(mask2, 2).toString(16));
		} else if (bin.length <= 16) {
			var zeros = 16 - bin.length;
			var mask1 = '1110';
			mask1 += Array(zeros + 1).join('0');
			var remaining = 8 - 4 - zeros;
			mask1 += bin.substr(0, remaining);
			var mask2 = '10';
			mask2 += bin.substr(remaining, 6);
			var mask3 = '10';
			mask3 += bin.substr(remaining + 6);
			result += ('%' + parseInt(mask1, 2).toString(16) + '%' + parseInt(mask2, 2).toString(16) + '%' + parseInt(mask3, 2).toString(16));
		}
	}
	return result;
};

var decodeChar = function(c) {
	var bin = "";

	var arr = c.split('%');
	arr.shift();

	var firstBin = parseInt(arr[0], 16).toString(2);
	var count = firstBin.substr(0, firstBin.indexOf('0')).length;
	if (count == 0 || count == 1) {
		bin = firstBin;
	} else {
		bin = firstBin.substr(count);
		arr.shift();
		count--;

		for (var i = 0; i < count; i++) {
			bin += parseInt(arr[i], 16).toString(2).substr(2);
		}
	}

	return String.fromCharCode(parseInt(bin, 2).toString(10));
};


exports.encode = function(param) {
	var type = typeof param;

	if (type == "number")
		return param;
	if (type == "string") {
		var result = "";
		for (var i = 0; i < param.length; i++)
			result += encodeChar(param.charAt(i));
		return result;
	}
	if (type == "object") {
		if (Array.isArray(param)) {
			var result = [];
			for (var i = 0; i < param.length; i++) {
				result.push(encode(param[i]));
			}
			return result;
		} else {
			var result = "";
			for (var i in param) {
				result += '&' + i + '=' + encode(param[i]);
			}
			return result.substr(1);
		}
	}
};

exports.decode = function(param) {
	var type = typeof param;

	if (type == "number")
		return param;
	if (type == "string") {
		if (param.indexOf('=') == -1) {
			var decodePos = param.indexOf('%');
			if (decodePos != -1) {
				var first = param.substr(decodePos + 1, 2);
				var firstBin = parseInt(first, 16).toString(2);
				var count = firstBin.substr(0, firstBin.indexOf('0')).length;
				if (count == 0)
					count = 1;
				return decode(param.substr(0, decodePos) + decodeChar(param.substr(decodePos, 3 * count)) + param.substr(decodePos + 3 * count));
			} else {
				return param;
			}
		} else {
			var result = {};
			var args = param.split('&');
			for (var i = 0; i < args.length; i++) {
				var pair = args[i].split('=');
				result[decode(pair[0])] = decode(pair[1]);
			}
			return result;
		}
	}

	if (Array.isArray(param)) {
		var result = [];
		for (var i = 0; i < param.length; i++) {
			result.push(decode(param[i]));
		}
		return result;
	}
};