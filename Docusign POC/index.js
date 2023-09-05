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



app.post('/senddocument', (req, res) => {
    
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
                    "signers": []
                },
                "sequence": "1"
            }],
            "serverTemplates": [{
                "sequence": "1",
                "templateId": "58a2760c-84ad-4d79-9cde-2dc804b3c244"
            }]
        }],
        "emailSubject": "Employee Bond Letter",
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
            console.log(body);
           
            res.send("Error");
        }
    })


})

app.listen(port, () => {
    console.log('Server is running on port ' + port)
})