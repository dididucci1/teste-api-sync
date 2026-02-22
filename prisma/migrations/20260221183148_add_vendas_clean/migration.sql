-- CreateTable
CREATE TABLE "Venda" (
    "id" TEXT NOT NULL,
    "numero" TEXT,
    "status" TEXT,
    "total" DOUBLE PRECISION,
    "dataEmissao" TIMESTAMP(3),
    "pessoaId" TEXT,

    CONSTRAINT "Venda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemVenda" (
    "id" TEXT NOT NULL,
    "vendaId" TEXT NOT NULL,
    "produtoId" TEXT,
    "descricao" TEXT,
    "quantidade" DOUBLE PRECISION,
    "valorUnitario" DOUBLE PRECISION,
    "valorTotal" DOUBLE PRECISION,

    CONSTRAINT "ItemVenda_pkey" PRIMARY KEY ("id")
);
