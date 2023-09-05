sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("inkit.login.loginpage.controller.Login", {
            onInit: function () {
               
            },
            onBtnClick : function(){
                var oUser = this.getView().byId("user").getValue();  //get input value data in oUser variable 
                var oPwd = this.getView().byId("pwd").getValue();    //get input value data in oPwd variable
                
                if(oUser==="admin" && oPwd==="admin"){				
                    document.write("Login Successfully");
                    // this.getRouter().navTo("TargetHome");
                }else{
                    alert("Re-Enter your Detail");
                }
                
                
            }
        });
    });
