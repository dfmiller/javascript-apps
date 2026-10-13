
var Trunk = {
	load: function(varname, defaultValue) {
		try {
			if (typeof window.localStorage.getItem(varname) == 'undefined') {
				return defaultValue;
			}
			return JSON.parse(window.localStorage.getItem(varname)) || defaultValue
		} catch(e) {
			return window.localStorage.getItem(varname);
		}
	},
	save: function(varname, value) {
		try {
			if (typeof value == 'object') {
				value = JSON.stringify(value);
			}
			Trunk[varname] = window.localStorage.setItem(varname, value);
		} catch(e) {}
	}
}
