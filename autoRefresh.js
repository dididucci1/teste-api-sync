const { refreshAccessToken } = require('./tokenManager');

async function refreshLoop() {
  try {
    console.log('[Token] Verificando token...');
    await refreshAccessToken();
    console.log('[Token] Atualizado automaticamente');
  } catch (e) {
    console.error('[Token] Erro ao atualizar:', e.message);
  }
}

// roda ao iniciar
refreshLoop();

// roda a cada 25 minutos
setInterval(refreshLoop, 25 * 60 * 1000);
