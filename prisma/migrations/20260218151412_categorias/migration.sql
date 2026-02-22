-- CreateTable
CREATE TABLE "Categoria" (
    "idContaAzul" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("idContaAzul")
);
