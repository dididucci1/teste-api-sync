require("dotenv").config();
const axios = require("axios");
const { getValidAccessToken } = require("./tokenManager");

async function debug() {
  const token = await getValidAccessToken();

  const res = await axios.get(
    "https://api-v2.contaazul.com/v1/venda/busca",
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { pagina: 1, tamanho_pagina: 10 }
    }
  );

  console.log("TIPO:", typeof res.data);
  console.log("É array?", Array.isArray(res.data));
  console.log("Keys:", Object.keys(res.data));
  console.log("Conteúdo bruto:");
  console.log(JSON.stringify(res.data, null, 2));
}

debug();