require("dotenv").config();

const refreshToken = require("./refreshToken");
const syncVendas = require("./syncVendas");
const syncItensVenda = require("./syncItensVenda");
const syncContasPagar = require("./syncContasPagar");
const syncContasReceber = require("./syncContasReceber");
const syncPessoas = require("./syncPessoas");

async function main() {
  try {
    console.log("🚀 INICIANDO SYNC COMPLETO", new Date());

    await refreshToken();
    await syncPessoas();
    await syncVendas();
    await syncItensVenda();
    await syncContasPagar();
    await syncContasReceber();

    console.log("✅ SYNC FINALIZADO", new Date());
  } catch (e) {
    console.error("❌ ERRO GERAL:", e);
  } finally {
    process.exit(0);
  }
}

main();