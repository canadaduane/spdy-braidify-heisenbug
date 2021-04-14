const https = require('https');
const axios = require("axios");

const instance = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});

const requestBody = `Content-Range: json [-0:-0]
Content-Length: 1
Content-Type: application/json

0
`;

const headers = {
  Patches: "1",
};

(async () => {
  let res;
  console.log("PUT content...")
  res = await instance.put("https://localhost:3000", requestBody, { headers });

  console.log("PUT content (2nd time)...")
  res = await instance.put("https://localhost:3000", requestBody, { headers });
})();
