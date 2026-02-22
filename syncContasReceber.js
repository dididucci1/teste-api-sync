const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const { getValidAccessToken } = require('./tokenManager');

const prisma = new PrismaClient();

async function syncContasReceber() {
  try {
    console.log("🔄 Sincronizando contas a receber...");

    const token = await getValidAccessToken();

    let pagina = 1;
    const tamanhoPagina = 100;
    let totalRecebido = 0;

    while (true) {
      console.log(`📄 Buscando página ${pagina}`);

      const res = await axios.get(
        "https://api-v2.contaazul.com/v1/financeiro/eventos-financeiros/contas-a-receber/buscar",
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            pagina,
            tamanho_pagina: tamanhoPagina,
            data_vencimento_de: "2024-01-01",
            data_vencimento_ate: "2026-12-31"
          }
        }
      );

      const dados = Array.isArray(res.data.itens)
        ? res.data.itens
        : [];

      if (dados.length === 0) {
        console.log("✅ Todas páginas sincronizadas");
        break;
      }

      for (const conta of dados) {
        await prisma.contaReceber.upsert({
          where: { id: conta.id },
          update: {
            descricao: conta.descricao,
            status: conta.status,
            valor: conta.total,
            dataVencimento: conta.data_vencimento
              ? new Date(conta.data_vencimento)
              : null,
            dataCompetencia: conta.data_competencia
              ? new Date(conta.data_competencia)
              : null,
            dataCriacao: conta.data_criacao
              ? new Date(conta.data_criacao)
              : null,
            dataAlteracao: conta.data_alteracao
              ? new Date(conta.data_alteracao)
              : null
          },
          create: {
            id: conta.id,
            descricao: conta.descricao,
            status: conta.status,
            valor: conta.total,
            dataVencimento: conta.data_vencimento
              ? new Date(conta.data_vencimento)
              : null,
            dataCompetencia: conta.data_competencia
              ? new Date(conta.data_competencia)
              : null,
            dataCriacao: conta.data_criacao
              ? new Date(conta.data_criacao)
              : null,
            dataAlteracao: conta.data_alteracao
              ? new Date(conta.data_alteracao)
              : null
          }
        });

        totalRecebido++;
      }

      console.log(`✔ ${dados.length} contas salvas`);
      pagina++;
    }

    console.log(`🏁 Finalizado. Total salvo: ${totalRecebido}`);

  } catch (e) {
    console.error("❌ Erro sync:", e.response?.data || e.message);
  }
}

module.exports = syncContasReceber;

if (require.main === module) {
  syncContasReceber();
}