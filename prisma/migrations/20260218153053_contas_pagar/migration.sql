-- CreateTable
CREATE TABLE "ContaPagar" (
    "id" TEXT NOT NULL,
    "descricao" TEXT,
    "valor" DOUBLE PRECISION,
    "dataVencimento" TIMESTAMP(3),
    "dataPagamento" TIMESTAMP(3),
    "status" TEXT,
    "categoria" TEXT,
    "fornecedor" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContaPagar_pkey" PRIMARY KEY ("id")
);
