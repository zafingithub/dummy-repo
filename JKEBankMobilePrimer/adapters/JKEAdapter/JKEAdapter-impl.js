/**
 *  WL.Server.invokeHttp(parameters) accepts the following json object as an argument:
 *  
 *  {
 *  	// Mandatory 
 *  	method : 'get' or 'post', 
 *  	path: value,
 *  	
 *  	// Optional 
 *  	returnedContentType: any known mime-type or one of "json", "css", "csv", "javascript", "plain", "xml", "html"  
 *  	returnedContentEncoding : 'encoding', 
 *  	parameters: {name1: value1, ... }, 
 *  	headers: {name1: value1, ... }, 
 *  	cookies: {name1: value1, ... }, 
 *  	body: { 
 *  		contentType: 'text/xml; charset=utf-8' or similar value, 
 *  		content: stringValue 
 *  	}, 
 *  	transformation: { 
 *  		type: 'default', or 'xslFile', 
 *  		xslFile: fileName 
 *  	} 
 *  } 
 */

function charities(uname, lat, lng) {
	return (uname == "admin") ? localCharities(lat, lng) : _charities(lat, lng);
}

function _charities(lat, lng) {

	var input = {
	    method : 'get',
	    returnedContentType : 'json',
	    path : 'JKEServices/rest/JKEMtM/charities?lat=' + lat + '&lng=' + lng
	};

	return WL.Server.invokeHttp(input);
}

function localCharities(lat, lng) {
	var newlat = parseFloat(lat) + 0.01;
	var newlng = parseFloat(lng) + 0.01;
	var latstr = newlat.toString();
	var lngstr = newlng.toString();
	return { "description" : "Markers ", 
		     "items":[{"lat":latstr, "lng":lngstr, "name":"Local Charity"}],
		     "count":1 };
}
