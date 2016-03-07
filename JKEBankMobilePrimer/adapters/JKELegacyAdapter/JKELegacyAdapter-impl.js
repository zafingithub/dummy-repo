
/**
 *  WL.Server.invokeHttp(parameters) accepts the following json object as an argument:
 *  
 *  {
 *  	// Mandatory 
 *  	method : 'get' , 'post', 'delete' , 'put' or 'head' 
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

function user(uname, pword) {
	return (uname == "admin") ? localUser() : _user(uname, pword);
}

function localUser() {
	return { "first": "Admin", "userId": "admin", "last": "Brown" };
}

function _user(uname, pword) {
	var input = {
		    method : 'get',
		    returnedContentType : 'json',
		    //path : 'JKEServices/rest/JKEMtM/user/' + uname + '?password=' + pword
		    path : 'user/' + uname + '?password=' + pword
		};

		return WL.Server.invokeHttp(input);
}

function accounts(userId) {
	return (userId == "admin") ? localAccounts() : _accounts(userId);
}

function localAccounts() {
	return { "array": [
				{"contributions":50.0, "dividendsETD":5500.0, "type":"Checking",     "userName":"admin", "contributionsETD":50.0, "accountNumber":9200, "dividends":1000.0, "balance":1950.0,  "typeName":"Checking Account"},
				{"contributions":0.0,  "dividendsETD":5.0,    "type":"IRA",          "userName":"admin", "contributionsETD":0.0,  "accountNumber":9202, "dividends":500.0,  "balance":25.0,    "typeName":"IRA Retirement Account"},
				{"contributions":0.0,  "dividendsETD":35.0,   "type":"Money_Market", "userName":"admin", "contributionsETD":0.0,  "accountNumber":9203, "dividends":500.0,  "balance":500.0,   "typeName":"Money Market Savings Account"},
				{"contributions":0.0,  "dividendsETD":3500.0, "type":"Savings",      "userName":"admin", "contributionsETD":0.0,  "accountNumber":9201, "dividends":500.0,  "balance":12500.0, "typeName":"Savings Account"}
				]};
}

function _accounts(userId) {
	var input = {
		    method : 'get',
		    returnedContentType : 'json',
		    //path : 'JKEServices/rest/JKEMtM/user/' + userId + '/accounts'
		    path : 'user/' + userId + '/accounts'
		};

		return WL.Server.invokeHttp(input);
}

function accttx(uname, account) {
	return (uname == "admin") ? localAccountTx(account) : _acctTx(uname, account);
}

function _acctTx(uname, account) {
	var input = {
		    method : 'get',
		    returnedContentType : 'json',
		    path : 'transactions/' + uname + '/' + account
		};

		return WL.Server.invokeHttp(input);	
}

function localAccountTx(account) {
	return { "array": [
		{"accountNumber":"200","amount":5.75,"type":"Withdrawl","id":"1","source":"Bills","balance":6790.0,"date":"5\/03\/2010"},
		{"accountNumber":"200","amount":600.0,"type":"Withdrawl","id":"2","source":"Bills","balance":6175.0,"date":"5\/05\/2010"}
		]};
}

function orgs(uname) {
	return (uname == "admin") ? localOrgs() : _orgs();
}

function _orgs() {
	var input = {
		    method : 'get',
		    returnedContentType : 'json',
		    path : 'organizations'
		};

		return WL.Server.invokeHttp(input);	
}

function localOrgs() {
	return { "array": [
	         {"website":"http:\/\/www.salvationarmyusa.org\/usn\/www_usn_2.nsf","name":"Salvation Army"},
	         {"website":"http:\/\/www.care.org\/","name":"Care"},
	         {"website":"http:\/\/www.redcross.org\/","name":"Red Cross"},
	         {"website":"http:\/\/www.cancer.org\/","name":"American Cancer Society"}
	         ]};
}

function preview(uname, account, org, percent) {
	return (uname == "admin") ? localPreview(account, org, percent) : _preview(account, org, percent);
}


function _preview(account, org, percent) {
	
	var input = {
		    method : 'get',
		    returnedContentType : 'json',
		    path : 'transactions/preview?account=' + encodeURIComponent(account) + '&org=' + encodeURIComponent(org) + '&date=' + encodeURIComponent(getDate()) + '&percent=' + percent
		};

		return WL.Server.invokeHttp(input);	
}

function localPreview(account, org, percent) {
	return{ "accountNumber": 200,
			"amount": 1.0,
			"balance": 1948.0,
			"date": "04\/05\/2013",
			"id": 0,
			"isSuccessful": true,
			"source": "Red Cross",
			"statusCode": 200,
			"statusReason": "OK",
			"type": "Donation" }
}

function postTrans(uname, account, org, percent) {
	return (uname == "admin") ? localPostTrans(account, org, percent) : _postTrans(account, org, percent);
}

function _postTrans(account, org, percent) {
	
	var input = {
		    method : 'post',
		    returnedContentType : 'json',
		    path : 'transactions/create?account=' + encodeURIComponent(account) + '&org=' + encodeURIComponent(org) + '&date=' + encodeURIComponent(getDate()) + '&percent=' + percent
		};

		return WL.Server.invokeHttp(input);	
}

function localPostTrans(account, org, percent) {
	return{ "accountNumber": 200,
			"amount": 1.0,
			"balance": 1948.0,
			"date": "04\/05\/2013",
			"id": 12,
			"isSuccessful": true,
			"source": "Red Cross",
			"statusCode": 200,
			"statusReason": "OK",
			"type": "Donation" }
}

function getDate() {
	var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    return curr_month + "\/" + curr_date + "\/" + curr_year;
}