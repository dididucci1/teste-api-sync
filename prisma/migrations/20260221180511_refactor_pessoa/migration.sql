/*
  Warnings:

  - You are about to drop the column `fornecedorId` on the `ContaPagar` table. All the data in the column will be lost.
  - You are about to drop the column `clienteId` on the `ContaReceber` table. All the data in the column will be lost.
  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Fornecedor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContaPagar" DROP CONSTRAINT "ContaPagar_fornecedorId_fkey";

-- DropForeignKey
ALTER TABLE "ContaReceber" DROP CONSTRAINT "ContaReceber_clienteId_fkey";

-- AlterTable
ALTER TABLE "ContaPagar" DROP COLUMN "fornecedorId",
ADD COLUMN     "pessoaId" TEXT;

-- AlterTable
ALTER TABLE "ContaReceber" DROP COLUMN "clienteId",
ADD COLUMN     "pessoaId" TEXT;

-- DropTable
DROP TABLE "Cliente";

-- DropTable
DROP TABLE "Fornecedor";

-- CreateTable
CREATE TABLE "Pessoa" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "tipo" TEXT,
    "documento" TEXT,
    "email" TEXT,

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ContaPagar" ADD CONSTRAINT "ContaPagar_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContaReceber" ADD CONSTRAINT "ContaReceber_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
