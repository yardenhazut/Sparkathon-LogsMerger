const axios = require('axios');  
const cors = require('cors')
const { DefaultAzureCredential } = require("@azure/identity");

const endpoint = "oa-research";
//## For Incontact use ic-oa-research
//## For Actimize  use act-oa-research
const model = "text-davinci-003";
  
async function getAccessToken() {  
  try {  
    const credential = new DefaultAzureCredential();
    const token = await credential.getToken("https://cognitiveservices.azure.com/.default");
    return token.token;  
  } catch (error) {  
    console.error('Error getting access token:', error);  
    throw error;  
  }  
}  
  
async function queryAzureOpenAI(prompt) {  
  const resourceURL = `https://${endpoint}.openai.azure.com/openai/deployments/${model}/completions?api-version=2023-05-15`;  
  const apiKey = await getAccessToken();  
    
  const headers = {  
    'Content-Type': 'application/json',  
    'Authorization': `Bearer ${apiKey}`,  
    };  
  
  const data = {  
    prompt: prompt,  
    max_tokens: 1000,  
    n: 1,  
    stop: null,  
    temperature: 1,  
    top_p: 1,  
  };  
  
  try {  
    const response = await axios.post(resourceURL, data, { headers: headers });  
    return response.data.choices[0].text;  
  } catch (error) {  
    console.error('Error querying Azure OpenAI:', error);  
    throw error;  
  }  
}  

const express = require('express');  
const app = express();  
  
app.use(cors());
app.use(express.json());  
  
app.post('/api/endpoint', (req, res) => {  
  console.error(req);
  const data = req.body;  
  console.log('Data received:', data);  

  let prompt = `
Hello, I would like you to help us improve our work in our company.  
We are working on a product that helps contact center manage their incoming calls.
the metadata communication is done by SIP protocol.

There are several event types, according to the SIP protocol:
1. "INVITE" - the request that starts the call
2. "BYE" - the request tht ends the call
3. "200 OK on INVITE" - OK response on the INVITE request
4. "200 OK on BYE" - OK response on the BYE request
5. "ACK" - Acknowledgment on the 200 OK

Please note that there is a difference between 200 OK on INVITE and 200 OK on BYE. to differentiate between them, you should look on the cSeq value in each 200 OK log print:
if the cSeq field contains "INVITE" then the OK is on INVITE. if the cSeq field contains "BYE" then the OK is on BYE.

In general, in SIP protocol, there are 2 types of flows:
1. INVITE flow: receive an INVITE, respond 200 OK and receive ACK.
2. BYE flow: receive an INVITE and respond 200 OK.


This specific microservice has to do the following requirements,for INVITE or BYE flows:
1. receive INVITE, respond 200 OK on INVITE and receive ACK
2. send an INVITE, recieve 200 OK on INVITE and send ACK
3. receive BYE and respond 200 OK on BYE
4. send BYE and receive 200 OK on BYE

I would like that you iterate some logs that describe a specific call and note all the "INVITE" and "200 OK" and "BYE" events with their timestamps:
Note that each log print contains a field called "[InteractionKey]". its value can be found in the next "[]" charts. please note that the value inside is a string that contains 2 "_" chars. please take the last part of this string. name it as correlationKey
please write it in a table according to timestamp, event type (INVITE, 2000 OK or ACK), correlationKey, call id and whether the event type was received or sent
according to the microservice requirements and the table you genetared, please summerize for each call id, whether the INVITE and BYE flows were successful or not.
please make sure no event is missing in each flow. the flow will be successful only if all the required events will be present 

please make sure all the events happened in each flow
  `;
  prompt+="\n";
  prompt+=data.msg;


  queryAzureOpenAI(prompt)  
  .then(result => {    
    console.log('Data sent:', result);  
    res.send(result);
  })      
  .catch(error => console.error('Error:', error)); 
  
});  
  
const port = process.env.PORT || 3000;  
app.listen(port, () => {  
  console.log(`Server is running on port ${port}`);  
});  

 