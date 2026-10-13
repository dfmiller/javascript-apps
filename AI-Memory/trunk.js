
var Trunk = {};

//localStorage.clear();
Trunk.load = function(varname, defaultValue) {
	if (typeof localStorage[varname] == 'undefined') {
		return defaultValue;
	}
	try {
		return JSON.parse(localStorage[varname])
	} catch(e) {
		return localStorage[varname];
	}
},
Trunk.save = function(varname, value) {
	if (typeof value == 'object') {
		value = JSON.stringify(value);
	}
	Trunk[varname] = localStorage[varname] = value;
};
init();

