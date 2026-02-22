const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const { getValidAccessToken } = require('./tokenManager');

const prisma = new PrismaClient();

async function syncCategorias() {
  console.log('Iniciando sync de categorias...');

  const token = await getValidAccessToken();

  let pagina = 1;
  const tamanhoPagina = 100;
  let totalSalvos = 0;

  while (true) {
    console.log(`Buscando página ${pagina}`);

    const res = await axios.get(
      'https://api-v2.contaazul.com/v1/categorias',
      {
        params: {
          pagina: pagina,
          tamanho_pagina: tamanhoPagina
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const categorias = res.data?.items || res.data || [];

    if (!categorias.length) break;

    for (const cat of categorias) {
      await prisma.categoria.upsert({
        where: { id: String(cat.id) },
        update: {
          nome: cat.nome,
          tipo: cat.tipo
        },
        create: {
          id: String(cat.id),
          nome: cat.nome,
          tipo: cat.tipo
        }
      });

      totalSalvos++;
    }

    if (categorias.length < tamanhoPagina) break;

    pagina++;
  }

  console.log(`Categorias sincronizadas: ${totalSalvos}`);
}

syncCategorias()
  .catch(e => console.error('Erro:', e.response?.data || e.message))
  .finally(async () => prisma.$disconnect());
