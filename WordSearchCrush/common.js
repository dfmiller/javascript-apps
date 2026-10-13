/*
window.onerror = function(message, source, line_num, col_num, error) {
	alert('Error in "' + source + '" at ' + line_num + '-' + col_num + '.  Please contact support at digitalfunmedia@gmail.com about this error: "' + message + '"')
	console.log(message, source, line_num, col_num, error, arguments)
	return true // return true to prevent browser from displaying error
}
*/
window.oncontextmenu = function() { return false }
