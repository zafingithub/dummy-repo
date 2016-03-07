function calculatePayment(uname, amount, years, rate) {
	return (uname == "admin") ? returnAPayment(amount, years, rate) : _calculatePayment(amount, years, rate);
}

function getCompanies(uname, amount, years, rate) {
	return (uname == "admin") ? returnALender(amount, years, rate) : _getCompanies(amount, years, rate);
}

function _calculatePayment(amount, years, rate) {
	
	var request = 
		<soapenv:Envelope 
			xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
			xmlns:q0="http://www.JKECSMRTI.com/schemas/JKECSMRTIInterface" 
			xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
			xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
			<soapenv:Body>
			<q0:DFHCOMMAREA>
				<q0:jkepcom_principle_data>{ amount }</q0:jkepcom_principle_data> 
				<q0:jkepcom_number_of_years>{ years }</q0:jkepcom_number_of_years> 
				<q0:jkepcom_quoted_interest_rate>{ rate }</q0:jkepcom_quoted_interest_rate> 
			</q0:DFHCOMMAREA>
		</soapenv:Body>
	</soapenv:Envelope>;
		
	
	var input = {
	    method : 'post',
	    returnedContentType : 'xml',
	    path : 'cics/services/JKECSMRT',
	    body: {
	    	content : request.toString(),
	    	contentType : 'text/xml; charset=utf-8'
	    }
	};
	
	return WL.Server.invokeHttp(input);
}

function returnAPayment(amount, years, rate) {
	return { "Envelope": 
	             {"Body": 
	            	 {"DFHCOMMAREA":	            		 
	            		{"jkepcom_return_month_payment":"876.50", "jkepcom_errmsg":"", "jkepcom_program_retcode":"0"}           		
	                 }
	             }
			};
}


function _getCompanies(amount, years, rate) {
	
	var request = 
		<soapenv:Envelope 
			xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
			xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
			xmlns:xsd="http://www.w3.org/2001/XMLSchema" 		
			xmlns:tns1="http://www.JKEMLISTI.com/schemas/JKEMLISTIInterface">
			<soapenv:Body>
			<tns1:DFHCOMMAREA>
				<tns1:process_indicator>1</tns1:process_indicator>
				<tns1:jkepcom_principle_data>{ amount }</tns1:jkepcom_principle_data>
				<tns1:jkepcom_number_of_years>{ years }</tns1:jkepcom_number_of_years>
				<tns1:jkepcom_quoted_interest_rate>{ rate }</tns1:jkepcom_quoted_interest_rate>
			</tns1:DFHCOMMAREA>
		</soapenv:Body>
	</soapenv:Envelope>;
		
	
	var input = {
	    method : 'post',
	    returnedContentType : 'xml',
	    path : 'cics/services/JKEMLIST',
	    body: {
	    	content : request.toString(),
	    	contentType : 'text/xml; charset=utf-8'
	    }
	};
	
	return WL.Server.invokeHttp(input);
}

function returnALender(amount, years, rate) {
	return { "Envelope": 
	             {"Body": 
	            	 {"DFHCOMMAREA":
	            		 {"mortgage_company_table": 
	            		 	{"mort_table_rec":
	            				 [{"mort_company":"Local Lender", "mort_phone_num":"888-555-5000", "mort_rate":rate, "mort_years":years, "mort_loan":amount}],
	            			"row_count":1
	            		 	}
	            		 }
	                 }
	             }
			};
}