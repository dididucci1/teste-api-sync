require('dotenv').config();
const axios = require('axios');

(async () => {
  try {
    const res = await axios.post(
      'https://auth.contaazul.com/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: process.env.CA_CODE,
        redirect_uri: process.env.CA_REDIRECT_URI
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: {
          username: process.env.CA_CLIENT_ID,
          password: process.env.CA_CLIENT_SECRET
        }
      }
    );

    console.log('✅ TOKEN OK:', res.data);
  } catch (e) {
    console.log('❌ ERRO:', e.response?.data || e.message);
  }
})();
