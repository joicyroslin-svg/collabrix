const https = require('https');

const data = JSON.stringify({ task: 'Hello, how are you?' });

const options = {
  hostname: 'collabrix-lyart.vercel.app',
  port: 443,
  path: '/api/ai-task',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => console.error('Error:', e));
req.write(data);
req.end();

