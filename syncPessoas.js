const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const { getValidAccessToken } = require('./tokenManager');

const prisma = new PrismaClient();

async function syncPessoas() {
  try {
    console.log("🔄 Sincronizando pessoas...");

    const token = await getValidAccessToken();

    let pagina = 1;
    const tamanhoPagina = 100;
    let totalSalvo = 0;

    while (true) {
      console.log(`📄 Página ${pagina}`);

      const res = await axios.get(
        "https://api-v2.contaazul.com/v1/pessoas",
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            pagina,
            tamanho_pagina: tamanhoPagina
          }
        }
      );

      const dados = Array.isArray(res.data.items)
        ? res.data.items
        : [];

      if (dados.length === 0) {
        console.log("✅ Pessoas sincronizadas.");
        break;
      }

      for (const pessoa of dados) {
        await prisma.pessoa.upsert({
          where: { id: pessoa.id },
          update: {
            nome: pessoa.nome || null,
            documento: pessoa.documento || null,
            email: pessoa.email || null,
            tipo: pessoa.tipo_pessoa || null
          },
          create: {
            id: pessoa.id,
            nome: pessoa.nome || null,
            documento: pessoa.documento || null,
            email: pessoa.email || null,
            tipo: pessoa.tipo_pessoa || null
          }
        });

        totalSalvo++;
      }

      console.log(`✔ ${dados.length} pessoas salvas`);
      pagina++;
    }

    console.log(`🏁 Finalizado. Total salvo: ${totalSalvo}`);

  } catch (error) {
    console.error("❌ Erro pessoas:", error.response?.data || error.message);
  }
}

module.exports = syncPessoas;

if (require.main === module) {
  syncPessoas();
}