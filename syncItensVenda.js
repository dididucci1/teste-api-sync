require("dotenv").config();
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const { getValidAccessToken } = require("./tokenManager");

const prisma = new PrismaClient();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function syncItensVenda() {
  try {
    console.log("🔄 Sincronizando itens das vendas...");

    const token = await getValidAccessToken();

    const vendas = await prisma.venda.findMany({
      select: { id: true }
    });

    console.log(`📦 Total de vendas: ${vendas.length}`);

    let totalCriados = 0;
    let totalAtualizados = 0;
    let contador = 0;

    for (const venda of vendas) {
      contador++;
      console.log(`\n📦 Processando venda ${contador}/${vendas.length}`);
      console.log(`🆔 ID: ${venda.id}`);

      await sleep(150); // evita rate limit

      const res = await axios.get(
        `https://api-v2.contaazul.com/v1/venda/${venda.id}/itens`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            pagina: 1,
            tamanho_pagina: 100
          }
        }
      );

      const itens =
        res.data?.itens ||
        res.data?.registros ||
        res.data?.items ||
        [];

      console.log(`➡️ Itens retornados: ${itens.length}`);

      if (itens.length === 0) continue;

      const idsRecebidos = itens.map(i => i.id);

      const existentes = await prisma.itemVenda.findMany({
        where: { id: { in: idsRecebidos } },
        select: { id: true }
      });

      const idsExistentes = new Set(existentes.map(e => e.id));

      const novos = [];
      const atualizar = [];

      for (const item of itens) {
        const dados = {
          id: item.id,
          vendaId: venda.id,
          produtoId: item.produto?.id || null,
          descricao: item.descricao || null,
          quantidade: Number(item.quantidade) || 0,
          valorUnitario: Number(item.valor_unitario) || 0,
          valorTotal: Number(item.total) || 0
        };

        if (idsExistentes.has(item.id)) {
          atualizar.push(dados);
        } else {
          novos.push(dados);
        }
      }

      // 🔥 Criar novos em batch
      if (novos.length > 0) {
        await prisma.itemVenda.createMany({
          data: novos
        });
        totalCriados += novos.length;
        console.log(`🆕 Criados: ${novos.length}`);
      }

      // 🔥 Atualizar existentes
      for (const item of atualizar) {
        await prisma.itemVenda.update({
          where: { id: item.id },
          data: {
            vendaId: item.vendaId,
            produtoId: item.produtoId,
            descricao: item.descricao,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            valorTotal: item.valorTotal
          }
        });
        totalAtualizados++;
      }

      if (atualizar.length > 0) {
        console.log(`🔄 Atualizados: ${atualizar.length}`);
      }
    }

    console.log("\n🏁 Finalizado!");
    console.log(`🆕 Total criados: ${totalCriados}`);
    console.log(`🔄 Total atualizados: ${totalAtualizados}`);

  } catch (e) {
    console.error("❌ ERRO REAL:");
    console.error(e.response?.data || e.message || e);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

module.exports = syncItensVenda;

if (require.main === module) {
  syncItensVenda();
}