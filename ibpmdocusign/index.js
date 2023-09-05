const express = require('express')
const bodyParser = require('body-parser')
const oauthClient = require('client-oauth2')
const nodefetch = require('node-fetch')
const request = require('request')
const {
    response
} = require('express')
const app = express()
const port = process.env.PORT || 443
app.use(bodyParser.json())


app.post('/initiatewf', async (req, res) => {
    var division = req.body.division,
        compcode = req.body.companyCode,
        userId = req.body.userID,
        email = req.body.email,
        bunit = req.body.Bunit,
        name = req.body.name;


    const businessrules = async function(compcode, bunit, division) {

        const body_br = {
            "RuleServiceId": "2cdada4bb1944bdfb85a70559e31f04c",
            "Vocabulary": [{
                "employmentInfo": {
                    "compCode": compcode,
                    "businessUnit": bunit,
                    "division": division
                }
            }]
        };

        const host_url = 'https://bpmruleruntime.rule.cfapps.us10.hana.ondemand.com/rules-service/rest/v2/workingset-rule-services';
        const accessToken = await accessTokenFetch('https://deployment-nu5u9ld5.authentication.us10.hana.ondemand.com/oauth/token', 'sb-clone-6d1ea3b5-9052-4642-bd7b-199950fac82f!b111849|bpmrulebroker!b2018', '3ea9729f-7b95-4ad3-b398-4669a103f545$vfT90jVtNro5ci8oBtSPmiDStIJJnUYjY5wus-2ia5M=');

        const result = await nodefetch(host_url, {
            method: 'POST',
            body: JSON.stringify(body_br),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + accessToken,
                Accept: 'application/json'
            }
        });

        const output = await result.json();
        return output;

    }


    const accessTokenFetch = async function(url, clientId, clientSecret) {

        var oautClient = new oauthClient({
            accessTokenUri: url,
            clientId: clientId,
            clientSecret: clientSecret,
            scopes: []
        });

        var accessToken = (await oautClient.owner.getToken('mohd.anwar@inkitsolutions.com', 'Arzoo@0406')).accessToken;

        return accessToken;

    }

    const initiatetask = async function(reqbody) {

        const wfbody = {
            "definitionId": "reswfs",
            "context": reqbody
        }

        // console.log(wfbody);

        const accessToken = await accessTokenFetch('https://deployment-nu5u9ld5.authentication.us10.hana.ondemand.com/oauth/token', 'sb-clone-04bf942f-ba02-46e4-98a7-46e077bb3ef9!b111849|workflow!b1774', '49f8f61d-af55-4d81-81ef-7422e8e803aa$6K3ujRn5fxSxmN273bZA7q5BHbjP7BM8o5tYJulQyc8=');

        const host_url = 'https://api.workflow-sap.cfapps.us10.hana.ondemand.com/workflow-service/rest/v1/workflow-instances';
        const result = await nodefetch(host_url, {
            method: 'POST',
            body: JSON.stringify(wfbody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + accessToken,
                Accept: 'application/json'
            }

        });

        const output = await result.json();
        // console.log("wf=", output);
        return output;

    }


    const createwfinstance = async function(reqbody) {

        const brulesData = await businessrules(reqbody.companyCode, reqbody.Bunit, reqbody.division);

        const finalpayload = {
            "division": reqbody.division,
            "companyCode": reqbody.companyCode,
            "userID": reqbody.userID,
            "email": reqbody.email,
            "Bunit": reqbody.Bunit,
            "name": reqbody.Name,
            "financeApprover": brulesData.Result[0].EmpApprovers.FinanceClearanceApprover,
            "ITApprover": brulesData.Result[0].EmpApprovers.ITClearanceApprover,
            "AssetApprover": brulesData.Result[0].EmpApprovers.OtherAssetClearanceApprover,
            "hrApprover": brulesData.Result[0].EmpApprovers.HRClearanceApprover
        }

        // console.log(finalpayload);

        const wfinstance = await initiatetask(finalpayload);

        return wfinstance;

    }

    const result = await createwfinstance(req.body);
    res.send(result);
    // res.send(await createwfinstance(req.body));

});


app.post('/sendcontract', (req, res) => {
    
    var url = 'https://api.openconnectors.eu10.ext.hana.ondemand.com/elements/api-v2/envelopes';
    var headers = {
        'authorization': 'User LjllK0TNrEY+Lv3cGh/dLdVZ6dE0JwWbvRIAAZHBilM=, Organization 198f2a88af3257c17700ac017640ba56, Element nZoUAk5Gc5hFD1GSka4lyedGFBoXpGdGrQ71+7+WDEA=',
        'accept': 'application/json',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    };
  
    var bodyJson = {
        "compositeTemplates": [{
            "compositeTemplateId": "1",
            "inlineTemplates": [{
                "recipients": {
                    "carbonCopies": [{
                        "email": req.body.email,
                        "name": req.body.name,
                        "recipientId": "2"
                    }],
                    "signers": [{
                        "email": 'mohd.anwar@inkitsolutions.com',
                        "name": 'Christine Dolan',
                        "recipientId": "1",
                        "roleName": "HR",
                        "tabs": {
                            "textTabs": []
                        }
                    }]
                },
                "sequence": "1"
            }],
            "serverTemplates": [{
                "sequence": "1",
                "templateId": "d56445f8-ddb0-472d-bddb-e1dffd5c52ab"
            }]
        }],
        "emailSubject": "Experience letter",
        "enableWetSign": "false",
        "status": "sent"
    };

    var options = {
        method: 'POST',
        url: url,
        headers: headers,
        formData: {
            envelope: JSON.stringify(bodyJson)
        }

    };
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            res.send(body)


        } else {
           
            res.send("Error");
        }
    })


})

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})