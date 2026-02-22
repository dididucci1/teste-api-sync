require("dotenv").config();
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function refreshToken() {
  const token = await prisma.token.findUnique({
    where: { id: 1 }
  });

  if (!token) throw new Error("Token não encontrado");

  const res = await axios.post(
    "https://auth.contaazul.com/oauth2/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refreshToken
    }).toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      auth: {
        username: process.env.CA_CLIENT_ID,
        password: process.env.CA_CLIENT_SECRET
      }
    }
  );

  const { access_token, refresh_token, expires_in } = res.data;

  const expiresAt = new Date(Date.now() + expires_in * 1000 - 60000);

  await prisma.token.update({
    where: { id: 1 },
    data: {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
      expiresAt
    }
  });

  console.log("🔄 Token atualizado com sucesso");
}

module.exports = refreshToken;
