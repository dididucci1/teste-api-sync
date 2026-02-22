require('dotenv').config();
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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

    console.log("TOKEN RECEBIDO");

    await prisma.token.upsert({
      where: { id: 1 },
      update: {
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token,
        expiresIn: res.data.expires_in
      },
      create: {
        id: 1,
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token,
        expiresIn: res.data.expires_in
      }
    });

    console.log("✅ Token salvo no banco");

  } catch (e) {
    console.log("Erro:", e.response?.data || e.message);
  }
})();
