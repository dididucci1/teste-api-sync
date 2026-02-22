-- CreateTable
CREATE TABLE "ContaReceber" (
    "id" TEXT NOT NULL,
    "descricao" TEXT,
    "status" TEXT,
    "valor" DOUBLE PRECISION,
    "dataVencimento" TIMESTAMP(3),
    "dataCompetencia" TIMESTAMP(3),
    "dataCriacao" TIMESTAMP(3),
    "dataAlteracao" TIMESTAMP(3),

    CONSTRAINT "ContaReceber_pkey" PRIMARY KEY ("id")
);
