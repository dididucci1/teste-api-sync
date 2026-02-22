require("dotenv").config();
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { getValidAccessToken } = require("./tokenManager");

async function syncVendas() {
  try {
    console.log("🔄 Iniciando sincronização de vendas...");

    const token = await getValidAccessToken();

    let pagina = 1;
    let totalSalvo = 0;
    let temMais = true;

    while (temMais) {
      console.log(`📄 Buscando página ${pagina}...`);

      const res = await axios.get(
        "https://api-v2.contaazul.com/v1/venda/busca",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            pagina,
            tamanho_pagina: 100,
          },
        }
      );

      const vendas = res.data?.itens || [];

      console.log(`➡️ Recebidas: ${vendas.length}`);

      if (vendas.length === 0) {
        temMais = false;
        break;
      }

      for (const venda of vendas) {
        await prisma.venda.upsert({
          where: { id: venda.id },
          update: {
            numero: venda.numero?.toString() || null,
            status: venda.situacao?.nome || venda.situacao || null,
            total: Number(venda.total) || 0,
            dataEmissao: venda.data_emissao
              ? new Date(venda.data_emissao)
              : null,
            pessoaId: venda.cliente?.id || null,
          },
          create: {
            id: venda.id,
            numero: venda.numero?.toString() || null,
            status: venda.situacao?.nome || venda.situacao || null,
            total: Number(venda.total) || 0,
            dataEmissao: venda.data_emissao
              ? new Date(venda.data_emissao)
              : null,
            pessoaId: venda.cliente?.id || null,
          },
        });

        totalSalvo++;
      }

      pagina++;
    }

    console.log("🎉 Sincronização finalizada!");
    console.log("🧾 Total salvo:", totalSalvo);

  } catch (err) {
    console.error("❌ ERRO REAL:");
    console.error(err.response?.data || err.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  syncVendas();
}

module.exports = syncVendas;