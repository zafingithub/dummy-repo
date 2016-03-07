
// Worklight comes with the jQuery framework bundled inside. If you do not want to use it, please comment out the line below.
//window.$ = window.jQuery = WLJQ;

function wlCommonInit(){
	// Common initialization code goes here
	require(["dojo/core-web-layer", "dojo/mobile-ui-layer", "dojo/mobile-compat-layer"], dojoInit);
}

function dojoInit() {
	require(["dojo",
	          "dijit/registry",
	          "dojo/parser",
		  	  "dojox/mobile",
		  	  "dojox/mobile/compat",
		  	  "dojox/mobile/deviceTheme",
			  "dojox/mobile/View",
			  "dojox/mobile/ScrollableView",
			  "dojox/mobile/Heading",
			  "dojox/mobile/Button",
			  "dojox/mobile/ToolBarButton",
			  "dojox/mobile/RoundRect",
			  "dojox/mobile/RoundRectList",
			  "dojox/mobile/ListItem",
			  "dojox/mobile/Slider",
			  "dojo/string"], function(dojo, registry) {
		dojo.ready(function() {

			// variable to hold organizations
			var orgs;
			
			// variable to hold retrieved account summary
			var accounts;
			
			// variable to hold the user info
			var user;
			
			// variable to hold the Money that Matters selected account number and selected org
			var mtmAcctNum;
			var mtmAcctName;
			var mtmOrgName;
			
			// clear the money that matters selected fields
		    var org = dojo.byId("selectedOrg");
			org.innerHTML = "";
			var acct = dojo.byId("selectedAcct");
			acct.innerHTML = "";
					
			// =================================== Login Page ====================================
			// wire up the login button
			dojo.connect(dojo.byId("loginButton"), "onclick",
				function(event) {
				
					var busy = new WL.BusyIndicator();
					busy.show();
					
					function authenticateSuccess(result) {
						console.log("authenticate good");
						user = result.invocationResult;
						var invocationData = {
							adapter : 'JKELegacyAdapter',
							procedure : 'accounts',
							parameters : [user.userId]
						};

						WL.Client.invokeProcedure(invocationData,{
							onSuccess : accountSuccess,
							onFailure : accountFailure,
						});								
						//setTimeout(function(){gotoMain()}, 3000);
						//gotoMain();	
						
					}
					function accountSuccess(result) {
						console.log("accounts good");
						accounts = result.invocationResult;
						populateAccounts();
						gotoMain();
					}
						
					// there should be no reason to fail here
					function accountFailure(result) {
						console.log("accounts bad");
					}
				    
				    function authenticateFailure(result) {
				    	console.log("authenticate bad");
				    	busy.hide();
				    	dojo.byId("loanImg").style.display="none";
				    	dojo.byId("loginFailed").style.display="inline";
				    }
				    
				    function gotoMain() {
				    	var banner = document.getElementById("banner");
						banner.innerHTML = "Welcome, " + user.first;
				    	busy.hide();
				    	var v = registry.byId("loginView");
						v.performTransition("mainView",1,"slide",null);
				    }
				    
				    function populateAccounts() {
						var list = registry.byId("mainAccountList");
						list.destroyDescendants();
						for (var i=0; i<accounts.array.length; i++) {
							var itemid = "mainAcct"+i;
							var itemWidget = new dojox.mobile.ListItem(
									{id:itemid, moveTo:'#', 
									 label:accounts.array[i].typeName, 
									 rightText:accounts.array[i].accountNumber, 
									 icon:getAcctIcon(accounts.array[i].typeName)});
							list.addChild(itemWidget);
							//var content = '<div style=\"line-height: 1.5em; font-size: 12pt\">${type}</div>' +
							//	  	  	  '<div style=\"line-height: 1.5em; font-size: 10pt\">${acctnum}</div>';
							//var divstring = dojo.string.substitute(content, {
							//	type: accounts.array[i].typeName,
							//	acctnum: accounts.array[i].accountNumber
							//});
							//dojo.byId(itemid).innerHTML = divstring;
							dojo.connect(dojo.byId(itemid), "onclick", 
									dojo.hitch(this, populateAccountTransactions, i));
						}				    	
				    }
				    
				    function getAcctIcon(account) {
				    	if (account.substring(0,8) == "Checking") return "images/checking.png";
				    	if (account.substring(0,7) == "Savings") return "images/PiggyBank.png";
				    	if (account.substring(0,5) == "Money") return "images/moneymarket.png";
				    	if (account.substring(0,3) == "IRA") return "images/vacation.png";
				    }
				    

				    var uname = dojo.byId("uname").value;
				    var pword = dojo.byId("pword").value;
				    dojo.byId("uname").value = "";
					dojo.byId("pword").value = "";
					
				    // authenticate
					var invocationData = {
						adapter : 'JKELegacyAdapter',
						procedure : 'user',
						parameters : [uname, pword]
					};

					WL.Client.invokeProcedure(invocationData,{
						onSuccess : authenticateSuccess,
						onFailure : authenticateFailure,
					});

				}
			);
			
			// login failed, go back to login page
			dojo.connect(dojo.byId("loginFailedButton"), "onclick",
				function(event) {
					dojo.byId("uname").value = "";
					dojo.byId("pword").value = "";
				    dojo.byId("loginFailed").style.display="none";
				    dojo.byId("loanImg").style.display="inline";
				}
			);
			
			// ======================== Account Transactions Page =============================
			// populate the account transactions view
		    function populateAccountTransactions(acct) {
				var busy = new WL.BusyIndicator();
				busy.show();
				
				function acctTxSuccess(result) {
					var txs = result.invocationResult;
					var list = registry.byId("transactions");
					list.destroyDescendants();
					
					if (txs.array.length == 0) {
						var itemid = "tx0";
						var itemWidget = new dojox.mobile.ListItem({id: itemid});
						list.addChild(itemWidget);			
						var errstring = '<div style=\"line-height: 1.5em; font-size: 10pt\">There are no transactions to display</div>';
						dojo.byId(itemid).innerHTML = errstring;
					} else {
						for (var i=0; i<txs.array.length; i++) {
							var itemid = "tx"+i;
							var itemWidget = new dojox.mobile.ListItem({id: itemid});
							list.addChild(itemWidget);
							var content = '<div style=\"line-height: 1.5em; font-size: 10pt\">${type} \$${amount} on ${date}</div>' +
										  '<div style=\"line-height: 1.5em; font-size: 10pt; float: right\">balance: \$${balance}</div>';
							var divstring = dojo.string.substitute(content, {
								type: txs.array[i].type,
								amount: txs.array[i].amount.toFixed(2),
								date: txs.array[i].date,
								balance: txs.array[i].balance.toFixed(2)
							});
							dojo.byId(itemid).innerHTML = divstring;
						}
					}
					
			    	busy.hide();
			    	var v = registry.byId("mainView");
					v.performTransition("transactionHistoryView",1,"slide",null);
				}
				
				function acctTxFailure(result) {
					
				}
				
				var entry = accounts.array[acct];
				
			    // get the account transaction history
				var invocationData = {
					adapter : 'JKELegacyAdapter',
					procedure : 'accttx',
					parameters : [user.userId, entry.type]
				};

				WL.Client.invokeProcedure(invocationData,{
					onSuccess : acctTxSuccess,
					onFailure : acctTxFailure,
				});
				
		    }
		    
			// ==================== Money that Matters Account List Page ====================
			// dynamically create the account list
			dojo.connect(dojo.byId("chooseAcct"), "onclick", function() { populateMtMAccounts() });
			
			function populateMtMAccounts() {
				var list = registry.byId("accountList");
				list.destroyDescendants();
				for (var i=0; i<accounts.array.length; i++) {
					var itemid = "acct"+i;
					var itemWidget = new dojox.mobile.ListItem({id: itemid});
					list.addChild(itemWidget);
					var content = '<div style=\"line-height: 1.5em; font-size: 12pt\">${type}</div>' +
						  	  	  '<div style=\"line-height: 1.5em; font-size: 10pt\">${acctnum}</div>';
					var divstring = dojo.string.substitute(content, {
						type: accounts.array[i].typeName,
						acctnum: accounts.array[i].accountNumber
					});
					dojo.byId(itemid).innerHTML = divstring;
					dojo.connect(dojo.byId(itemid), "onclick", 
							dojo.hitch(this, acctselected, i));
				}
			    var v = registry.byId("mtmView");
				v.performTransition("accountListView",1,"slide",null);
			}
									
			function acctselected(acct) {
				var content = '<div style=\"line-height: 1.5em; font-size: 12pt\">${type}</div>' +
							  '<div style=\"line-height: 1.5em; font-size: 10pt\">${acctnum}</div>';
				if (acct != 99) {		
					var item = dojo.byId("selectedAcct");
					var entry = accounts.array[acct];
					// save the account number and name
					mtmAcctNum = entry.accountNumber;
					mtmAcctName = entry.typeName;
					var divstring = dojo.string.substitute(content, {
						type: entry.typeName,
						acctnum: entry.accountNumber
					});
					item.innerHTML = divstring;
				}
				var v = registry.byId("accountListView");
				v.performTransition("mtmView",-1,"slide",null);		
			}


			// ==================== Money that Matters Organization List Page ====================
			// dynamically move to the Money that Matters page
			dojo.connect(dojo.byId("chooseOrg"), "onclick", function() { populateOrgs() });
			
			function populateOrgs(){
				var busy = new WL.BusyIndicator();
				busy.show();		
				
				function orgsSuccess(result) {
					orgs = result.invocationResult;
					var list = registry.byId("orgList");
					list.destroyDescendants();
					
					for (var i=0; i<orgs.array.length; i++) {
						var itemid = "org"+i;
						var itemWidget = new dojox.mobile.ListItem({id: itemid, label: orgs.array[i].name});
						list.addChild(itemWidget);
						dojo.connect(dojo.byId(itemid), "onclick", 
								dojo.hitch(this, orgselected, i));
					}				
					
			    	busy.hide();
			    	var v = registry.byId("mtmView");
					v.performTransition("orgListView",1,"slide",null);
				}
				
				function orgsFailure(result) {
					
				}
				
				function orgselected(org) {
					if (org != 99) {	
						mtmOrgName = orgs.array[org].name;
						dojo.byId("selectedOrg").innerHTML = orgs.array[org].name;
					}
					var v = registry.byId("orgListView");
					v.performTransition("mtmView",-1,"slide",null);		
				}
				
			    // get the organization list
				var invocationData = {
					adapter : 'JKELegacyAdapter',
					procedure : 'orgs',
					parameters : [user.userId]
				};

				WL.Client.invokeProcedure(invocationData,{
					onSuccess : orgsSuccess,
					onFailure : orgsFailure
				});
			}
			

			// ==================== Money that Matters View Buttons ====================
			// If the proceed button has been clicked, move to the proceed view if all info has been filled in
			dojo.connect(dojo.byId("proceedButton"), "onclick",
				function(event) {
					var org = dojo.byId("selectedOrg");
					var acct = dojo.byId("selectedAcct");
					var pctg = dojo.byId("percentage");
					// data is missing.  Hide the proceed button and display the missingInfo button
					if ((org.innerHTML == "") || (acct.innerHTML == "") || (pctg.value == "0")) {
			    		dojo.byId("missingInfo").style.display="inline";	
						dojo.byId("proceedButton").style.display="none";
					} else {
						// now preview the transaction
						var busy = new WL.BusyIndicator();
						busy.show();	
						
						function previewSuccess(result) {
							var data = result.invocationResult;
							var item = dojo.byId("proceedMsg");
							var content = '<div style=\"line-height: 1.5em; font-size: 10pt\">\$${amount} (${percent}% of the dividend)</div>' +
							              '<div style=\"line-height: 1.5em; font-size: 10pt\">will be deducted from your ${account}</div>' +
							              '<div style=\"line-height: 1.5em; font-size: 10pt\">and donated to ${org}</div>' +
							              '<div style=\"line-height: 1.5em; font-size: 10pt\">leaving you a balance of \$${balance}</div>'
							var divstring = dojo.string.substitute(content, {
								amount:  data.amount.toFixed(2),
								percent: pctg.value,
								account: mtmAcctName,
								org: data.source,
								balance: data.balance.toFixed(2)
							});
							item.innerHTML = divstring;
							// insure the proceed Buttons are visible
							dojo.byId("proceedViewButtons").style.display="inline";
							busy.hide();
							// move to the proceed view
							var v = registry.byId("mtmView");
							v.performTransition("proceedView",1,"slide",null);
						}
						
						function previewFailure(result) {
							var item = dojo.byId("proceedMsg");
							var content = '<div style=\"line-height: 1.5em; font-size: 10pt\">Unable to preview the dividend contribution.</div>' +
							              '<div style=\"line-height: 1.5em; font-size: 10pt\">Please try again later.</div>';
							item.innerHTML = content;
							// hide the proceed Buttons
							dojo.byId("proceedViewButtons").style.display="none";
							busy.hide();
							// move to the proceed view
							var v = registry.byId("mtmView");
							v.performTransition("proceedView",1,"slide",null);
						}
						
						var decPercent = pctg.value/100;
						
					    // get the account transaction history
						var invocationData = {
							adapter : 'JKELegacyAdapter',
							procedure : 'preview',
							parameters : [user.userId, mtmAcctNum, mtmOrgName, decPercent]
						};

						WL.Client.invokeProcedure(invocationData,{
							onSuccess : previewSuccess,
							onFailure : previewFailure
						});		
					}
				}
			);
			
			// if the missing info OK button is clicked, remove the button and re-display the Proceed button
			dojo.connect(dojo.byId("OKButton"), "onclick",
				function(event) {
					dojo.byId("missingInfo").style.display="none";
					dojo.byId("proceedButton").style.display="inline";
				}
			);
			
			// ========================== Proceed View Buttons =============================
			// if the cancel button is clicked, move back to the Money that Matters view
			dojo.connect(dojo.byId("cancelButton"), "onclick",
				function(event) {
					var v = registry.byId("proceedView");
					v.performTransition("mtmView",-1,"slide",null);
				}
			);
		
			// if the confirm button has been clicked, post the transaction and move to the confirm view
			dojo.connect(dojo.byId("confirmButton"), "onclick",
				function(event) {
				
					var busy = new WL.BusyIndicator();
					busy.show();	
					
					function postSuccess(result) {
						data = result.invocationResult;
						
						var confirmstr = "<u>Dividend Contribution Confirmed</u><br><br>" +
		                 	             "Thank you for your donation!";
						var cfirmed = dojo.byId("confirmed");
						cfirmed.innerHTML = confirmstr;
						
						clearMtMData();
						busy.hide();
						// move the the confirm view
						var v = registry.byId("proceedView");
						v.performTransition("confirmView",1,"slide",null);
					}
					
					function postFailure(result) {
						data = result.invocationResult;
						
						var content = '<div style=\"line-height: 1.5em; font-size: 10pt\">Unable to complete the dividend contribution.</div>' +
			              			  '<div style=\"line-height: 1.5em; font-size: 10pt\">Please try again later.</div>';
						var cfirmed = dojo.byId("confirmed");
						cfirmed.innerHTML = content;		
						
						clearMtMData();
						busy.hide();
						// move the the confirm view
						var v = registry.byId("proceedView");
						v.performTransition("confirmView",1,"slide",null);
					}
					
					function clearMtMData() {
						// clear all the Money that Matters selected data
						var org = dojo.byId("selectedOrg");
						var orgstr = org.innerHTML;
						org.innerHTML = "";
						var acct = dojo.byId("selectedAcct");
						var acctstr = acct.innerHTML;
						acct.innerHTML = "";
						var pctg = dojo.byId("percentage");
						var pctgnum = pctg.value;
						pctg.value = "0";
						registry.byId("slider").set("value", 0);
						mtmAcctNum = "";
						mtmAcctName = "";
						mtmOrgName = "";
					}

					// get the percentage.  (Account number and organization name come from global variables)
					var pctg = dojo.byId("percentage");
					var decPercent = pctg.value/100;
					
				    // get the account transaction history
					var invocationData = {
						adapter : 'JKELegacyAdapter',
						procedure : 'postTrans',
						parameters : [user.userId, mtmAcctNum, mtmOrgName, decPercent]
					};

					WL.Client.invokeProcedure(invocationData,{
						onSuccess : postSuccess,
						onFailure : postFailure
					});		
				}
			);
			
			// ==================== Local Charities Map Page ====================					
			// move to local charities
			dojo.connect(dojo.byId("charities"), "onclick",
				function(event) {
				  
					var myOptions = {
					        zoom: 13,
					        mapTypeId: google.maps.MapTypeId.ROADMAP
				    };
				    var map = new google.maps.Map(document.getElementById('mapCanvas'), myOptions);
					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(function(position) {
							
							var myLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
							var infoWindow = new google.maps.InfoWindow({disableAutoPan: true});
								
							// create the markers
							function createMarker(point,html) {
								var marker = new google.maps.Marker({
										map: map,
									position: point,
									title: html
								});
								google.maps.event.addListener(marker, "mouseover", function() {
									var markerContent = "<font size=\"2\"><b>" + html + "</b></font>"
   									infoWindow.setContent(markerContent);
									infoWindow.open(map, marker);    									
								});
								
								google.maps.event.addListener(marker, "click", function() {
									mtmOrgName = html;
									dojo.byId("selectedOrg").innerHTML = html;
									var v = registry.byId("mapView");
									v.performTransition("mtmView",-1,"slide",null);			
								});
								return marker;
								}
									
								function getCharitiesFailure(result){
									busy.hide();
								var v = registry.byId("orgListView");
								v.performTransition("noCharityView",-1,"slide",null);
							}
								
							function getCharitiesSuccess(result){
								if (result.invocationResult.items.length>0) {
									displayMarkers(result.invocationResult.items);
									gotoMap();					
								} else { 
									getCharitiesFailure();
								}
							}
								
							function displayMarkers(items) {
								for (var i=0; i<items.length; i++) {
  									var point = new google.maps.LatLng(items[i].lat, items[i].lng);
  									var marker = createMarker(point, items[i].name);
								}		
							}
							
							function gotoMap() {
								busy.hide();
								var li = dojo.byId("charities");
								registry.byNode(li).transitionTo("mapView");
								google.maps.event.trigger(map, "resize");
								map.setCenter(myLatLng);
							}
									
								// get the charities from the server
							var invocationData = {
								adapter : 'JKEAdapter',
								procedure : 'charities',
								parameters : [user.userId, position.coords.latitude, position.coords.longitude]
								};

							WL.Client.invokeProcedure(invocationData,{
								onSuccess : getCharitiesSuccess,
								onFailure : getCharitiesFailure
							});

							var busy = new WL.BusyIndicator();
							busy.show();
							// setTimeout(function(){gotoMap()}, 3000);
							
						}, function(){
								var v = registry.byId("orgListView");
								v.performTransition("noCharityView",-1,"slide",null);			
						   }, { enableHighAccuracy: true, timeout: 30000 });	
					} else {
						var v = registry.byId("orgListView");
						v.performTransition("noCharityView",-1,"slide",null);								
					}
				}
			);
			
			// ==================== Find a Lender Page ====================
			dojo.connect(dojo.byId("getLenders"), "onclick",
				function(event) {
				
					var busy = new WL.BusyIndicator();
					busy.show();
				
					function lenderSuccess(result) {
						var envelope = result.invocationResult.Envelope;
						if (envelope.Body.DFHCOMMAREA.mortgage_company_table.row_count == "0") {
							lenderFailure(result);				
						} else {
							displayLenders(envelope);
						}
					}
					
					function lenderFailure(result) {
						var list = registry.byId("lenderList");
						// get rid of any elements from previous times being here
						list.destroyDescendants();
						var itemid = "lender0";
						var itemWidget = new dojox.mobile.ListItem({id: itemid});
						list.addChild(itemWidget);
						var content = '<div style=\"line-height: 1.5em; font-size: 12pt\">${msg1}</div>' +
								  	  '<div style=\"line-height: 1.5em; font-size: 10pt\">${msg2}</div>';
						var divstring = dojo.string.substitute(content, {
							msg1: 'No lenders found for your desired mortgage',
							msg2: 'Go back and change parameters and try again'
						});
						dojo.byId(itemid).innerHTML = divstring;
						busy.hide();
						var v = registry.byId("findALenderView");
						v.performTransition("displayLendersView","slide",null);
					}
					
					function displayLenders(envelope) {
						var list = registry.byId("lenderList");
						// get rid of any elements from previous times being here
						list.destroyDescendants();
						var mortgage_table = envelope.Body.DFHCOMMAREA.mortgage_company_table;
						var numrows = parseInt(mortgage_table.row_count);
						for (var i=0; i<numrows; i++) {
							console.log("lender row");
							var itemid = "lender"+i;
							var itemWidget = new dojox.mobile.ListItem({id: itemid, variableHeight: true});
							list.addChild(itemWidget);
							var mortgage_record = mortgage_table.mort_table_rec[i];
							var content = '<div style=\"line-height: 1.5em; font-size: 12pt\">${name}</div>' +
								  	  	  '<div style=\"line-height: 1.5em; font-size: 10pt\"><a href=\"tel:${phone}\">${phone}</a></div>' +
								  	  	  '<div style=\"line-height: 1.5em; font-size: 10pt\">${years} years at ${rate}%</div>' +
								  	  	  '<div style=\"line-height: 1.5em; font-size: 10pt\">monthly payment: \$${payment}</div>';
							var divstring = dojo.string.substitute(content, {
								name: mortgage_record.mort_company,
								phone: mortgage_record.mort_phone_num,
								rate: mortgage_record.mort_rate,
								years: mortgage_record.mort_years,
								payment: mortgage_record.mort_loan
							});
							dojo.byId(itemid).innerHTML = divstring;
						}	
						busy.hide();
						var v = registry.byId("findALenderView");
						v.performTransition("displayLendersView","slide",null);
					}
					
				    var amount = dojo.byId("amount").value;
				    var years = dojo.byId("years").value;
				    var rate = dojo.byId("rate").value;
				    dojo.byId("amount").value = "";
					dojo.byId("years").value = "";
					dojo.byId("rate").value = "";
					
					console.log("user" + user.userId);
					var invocationData = {
						adapter : 'MortgageServices',
						procedure : 'getCompanies',
						parameters : [user.userId, amount, years, rate]
					};

					WL.Client.invokeProcedure(invocationData,{
						onSuccess : lenderSuccess,
						onFailure : lenderFailure
					});

				}
			);
			
			// ==================== Calculate Mortgage Payment Page ====================
			dojo.connect(dojo.byId("calculate"), "onclick",
				function(event) {
				
					var busy = new WL.BusyIndicator();
					busy.show();
				
					function calculateSuccess(result) {
						var envelope = result.invocationResult.Envelope;
						if (envelope.Body.DFHCOMMAREA.jkepcom_program_retcode != "0") {
							calculateFailure(result);				
						} else {
							displayPayment(envelope);
						}
					}
					
					function calculateFailure(result) {
						var list = registry.byId("payment");
						// get rid of any elements from previous times being here
						list.destroyDescendants();
						var itemid = "payment0";
						var itemWidget = new dojox.mobile.ListItem({id: itemid, variableHeight: true});
						list.addChild(itemWidget);
						var content = '<div style=\"line-height: 1.5em; font-size: 12pt\">Error:  ${msg1}</div>' +
								  	  '<div style=\"line-height: 1.5em; font-size: 10pt\">${msg2}</div>';
						var divstring = dojo.string.substitute(content, {
							msg1: result.invocationResult.Envelope.Body.DFHCOMMAREA.jkepcom_errmsg,
							msg2: 'Go back and change parameters and try again'
						});
						dojo.byId(itemid).innerHTML = divstring;
						busy.hide();
						var v = registry.byId("mortgageCalcView");
						v.performTransition("displayPaymentView","slide",null);
					}
					
					function displayPayment(envelope) {
						var list = registry.byId("payment");
						// get rid of any elements from previous times being here
						list.destroyDescendants();
						var itemid = "payment0";
						var itemWidget = new dojox.mobile.ListItem({id: itemid, variableHeight: true});
						list.addChild(itemWidget);
						var content = '<div style=\"line-height: 1.5em; font-size: 10pt\">Principle amount: \$${amount}</div>' +
							  	  	  '<div style=\"line-height: 1.5em; font-size: 10pt\">${years} years at ${rate}%</div>' +
							  	  	  '<div style=\"line-height: 1.5em; font-size: 10pt\">Monthly payment: \$${payment}</div>';
						var divstring = dojo.string.substitute(content, {
							amount: dojo.byId("calcAmount").value,
							rate: dojo.byId("calcRate").value,
							years: dojo.byId("calcYears").value,
							payment: envelope.Body.DFHCOMMAREA.jkepcom_return_month_payment
						});
						dojo.byId(itemid).innerHTML = divstring;	
						busy.hide();
						clearCalcInput();
						var v = registry.byId("mortgageCalcView");
						v.performTransition("displayPaymentView","slide",null);
					}
					
					function clearCalcInput() {
					    dojo.byId("calcAmount").value = "";
						dojo.byId("calcYears").value = "";
						dojo.byId("calcRate").value = "";						
					}
					
				    var amount = dojo.byId("calcAmount").value;
				    var years = dojo.byId("calcYears").value;
				    var rate = dojo.byId("calcRate").value;
					
					var invocationData = {
						adapter : 'MortgageServices',
						procedure : 'calculatePayment',
						parameters : [user.userId, amount, years, rate]
					};

					WL.Client.invokeProcedure(invocationData,{
						onSuccess : calculateSuccess,
						onFailure : calculateFailure
					});

				}
			);
					
			// display the body now that we are ready
			dojo.style("content", "display", "");
		});
	});
}