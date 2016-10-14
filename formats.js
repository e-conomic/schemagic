var moment = require('moment');
var format = require('util').format;
var validUrl = require('valid-url');

module.exports = {
	'date-time': datetimeFormatCheck,
	date: dateFormatCheck,
	currency: currencyFormatCheck,
	rate: rateFormat,
	'rate-negative': rateNegativeFormat,
	'currency-rate': currencyRateFormat,
	url: urlFormat
};

var minYear = 1970;
var dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
var dateTimeFormat = 'YYYY-MM-DDThh:mm:ssZ';
function datetimeFormatCheck(value) {
	var dateTime = moment(value, dateTimeFormat);
	if (!dateTime || !dateTime.isValid() || !dateTimePattern.test(value)) {
		return false;
	} else if (dateTime.year() < minYear) {
		return false;
	}
	return true;
}
datetimeFormatCheck.doc = format('Must be a date and time in the format %s', dateTimeFormat);

var datePattern = /^\d{4}-\d{2}-\d{2}$/;
var dateFormat = 'YYYY-MM-DD';
function dateFormatCheck(value) {
	var dateTime = moment(value, dateFormat);
	if (!dateTime || !dateTime.isValid() || !datePattern.test(value)) {
		return false;
	} else if (dateTime.year() < minYear) {
		return false;
	}
	return true;
}
dateFormatCheck.doc = format('Must be a date in the format %s', dateFormat);


var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
var maxCurrency = MAX_SAFE_INTEGER / 100;
var minCurrency = -MAX_SAFE_INTEGER / 100;
function currencyFormatCheck(value) {
	if (typeof value !== 'number') {
		return true;
	} else if ((value.toString().split('.')[1] || '').length > 2) {
		return false;
	} else if (value > maxCurrency || value < minCurrency) {
		return false;
	}
	return true;
}
currencyFormatCheck.doc = format('Must be a number with a maximum of two decimals after the decimal point. ' +
'Must be between %s and %s', minCurrency, maxCurrency);

var maxRate = 100;
var minRate = 0;
function rateFormat(value) {
	if (typeof value !== 'number') {
		return true;
	} else if ((value.toString().split('.')[1] || '').length > 2) {
		return false;
	} else if (value > maxRate || value < minRate) {
		return false;
	}
	return true;
}
rateFormat.doc = format('Must be a number with a maximum of two decimals after the decimal point. ' +
'Must be between %s and %s', minRate, maxRate);

var maxNegativeRate = 0;
var minNegativeRate = -100;
function rateNegativeFormat(value) {
	if (typeof value !== 'number') {
		return true;
	} else if ((value.toString().split('.')[1] || '').length > 2) {
		return false;
	} else if (value > maxNegativeRate || value < minNegativeRate) {
		return false;
	}
	return true;
}
rateNegativeFormat.doc = format('Must be a number with a maximum of two decimals after the decimal point. ' +
'Must be between %s and %s', minNegativeRate, maxNegativeRate);

var maxCurrencyRate = 999999999;
var minCurrencyRate = 0.000001;
function currencyRateFormat(value) {
	if (typeof value !== 'number') {
		return true;
	} else if ((value.toString().split('.')[1] || '').length > 6) {
		return false;
	} else if (value > maxCurrencyRate || value < minCurrencyRate) {
		return false;
	}
	return true;
}
currencyRateFormat.doc = format('Must be a number with a maximum of six decimals after the decimal point. ' +
'Must be between %s and %s', minCurrencyRate, maxCurrencyRate);

function urlFormat(value){
	return /http(s)?:\/\//.test(value) && validUrl.isUri(value);
}
urlFormat.doc = 'Must be a valid http:// or https:// URL';