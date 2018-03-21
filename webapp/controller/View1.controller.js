sap.ui.define(["sap/ui/core/mvc/Controller", "soap/libs/jquerysoap"], function(Controller, jquerysoapjs) {
	"use strict";
	return Controller.extend("soap.controller.View1", {

		onInit: function() {
			jQuery.sap.log.setLevel(5);
			$.sap.oLogger = jQuery.sap.log.getLogger("soap");
		},
		
		onGoGET: function() {
			
			var nTemperature = this.getView().byId("nDegreeFahrenheitID").getValue();

			var oParameters = { 
					Temperature: nTemperature,
					FromUnit: "degreeFahrenheit",
					ToUnit: "degreeCelsius"
				};
			
			var oSoapModel = new sap.ui.model.xml.XMLModel();
			this.getView().setModel(oSoapModel, "SoapModel");
			var self = this;
			
			 $.ajax({
                     url : "/soap_ws",
                     type : "GET",
                     data : oParameters,
                     dataType : "text",
                     contentType : "text/xml; charset=\"utf-8\"",
                     success : function(data, textStatus, jqXHR) {
                           oSoapModel.setXML(data); 
                           var result = oSoapModel.getData().querySelector("double").textContent;
                           $.sap.oLogger.info("Retrieved this: " + result);
                     },
                     error: function(xhr, status)
                     {
                           $.sap.oLogger.info("ERROR");     
                     },
                     complete : function(xhr,status) {
                           $.sap.oLogger.info("completed!");
                           self.onSoapSuccess();
                     }
              });
		},
		
		onGoPOST: function() {
		
			var nTemperature = this.getView().byId("nDegreeFahrenheitID").getValue();

			var oXML = [
			
				'<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">',
				   '<soap:Body>',
				      '<ConvertTemp xmlns="http://www.webserviceX.NET/">',
				         '<Temperature>',nTemperature,'</Temperature>',
				         '<FromUnit>degreeFahrenheit</FromUnit>',
				         '<ToUnit>degreeCelsius</ToUnit>',
				      '</ConvertTemp>',
				   '</soap:Body>',
				'</soap:Envelope>'
			];
			
			oXML = oXML.join("");
			
			var oSoapModel = new sap.ui.model.xml.XMLModel();
			this.getView().setModel(oSoapModel, "SoapModel");
			var self = this;
			
			 $.ajax({
				url : "/soap_ws",
				type : "POST",
				headers: {
					"SOAPAction": "http://www.webserviceX.NET/ConvertTemp"
				},
				payload : oXML,
				dataType : "xml",
				ContentType: "text/xml;charset=UTF-8",
				appendMethodToURL: false,
                beforeSend: function( jqXHR ){
					jqXHR.setRequestHeader(
						"SOAPAction",
						"http://www.webserviceX.NET/ConvertTemp"
					);
                },
                success : function(data, textStatus, jqXHR) {
                       oSoapModel.setXML(data); 
                       var result = oSoapModel.getData().querySelector("double").textContent;
                       $.sap.oLogger.info("Retrieved this: " + result);
                },
                error: function(xhr, status)
                {
                       $.sap.oLogger.info("ERROR");     
                },
                complete : function(xhr,status) {
                       $.sap.oLogger.info("completed!");
                       self.onSoapSuccess();
                }
              });		
			
		},

		onSoapSuccess: function(){
			var oSoapModel = this.getView().getModel("SoapModel");
			var _result = oSoapModel.getData().querySelector("double").textContent;
			var nCelsius = parseFloat(_result);
			this.getView().byId("nDegreeCelsiusID").setValue(nCelsius);
		}

		

	});
});