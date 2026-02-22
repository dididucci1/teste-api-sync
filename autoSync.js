const syncContasPagar = require('./syncContasPagar');

async function syncLoop() {
  try {
    console.log('🔄 Iniciando sincronização...');
    await syncContasPagar();
    console.log('✅ Sincronização finalizada');
  } catch (e) {
    console.error('❌ Erro no ciclo automático:', e.message);
  }
}

// roda ao iniciar
syncLoop();

// roda a cada 1 hora
setInterval(syncLoop, 60 * 60 * 1000);
