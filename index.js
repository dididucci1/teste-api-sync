require('./autoRefresh');

const { PrismaClient } = require('@prisma/client');
const syncContasPagar = require('./syncContasPagar');
const syncContasReceber = require('./syncContasReceber');

const prisma = new PrismaClient();

async function iniciar() {
  console.log('🚀 Backend iniciado');

  try {
    // garante que token existe
    await prisma.token.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        accessToken: 'init',
        refreshToken: 'init',
        expiresIn: 3600,
      },
    });

    console.log('🔄 Executando sincronização inicial...');

    await syncContasPagar();
    await syncContasReceber();

    console.log('✅ Sincronização inicial concluída');
    console.log('⏳ Aguardando próximas execuções...');
  } catch (err) {
    console.error('❌ Erro na inicialização:', err.message);
  }
}

iniciar();


// ⏰ Roda ciclo completo a cada 1 hora
setInterval(async () => {
  console.log('⏰ Iniciando ciclo automático...');

  try {
    await syncContasPagar();
    await syncContasReceber();

    console.log('✅ Ciclo finalizado com sucesso');
  } catch (err) {
    console.error('❌ Erro no ciclo automático:', err.message);
  }

}, 60 * 60 * 1000);