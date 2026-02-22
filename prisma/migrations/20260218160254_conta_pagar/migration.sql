/*
  Warnings:

  - You are about to drop the column `categoria` on the `ContaPagar` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ContaPagar` table. All the data in the column will be lost.
  - You are about to drop the column `dataPagamento` on the `ContaPagar` table. All the data in the column will be lost.
  - You are about to drop the column `fornecedor` on the `ContaPagar` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ContaPagar` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContaPagar" DROP COLUMN "categoria",
DROP COLUMN "createdAt",
DROP COLUMN "dataPagamento",
DROP COLUMN "fornecedor",
DROP COLUMN "updatedAt",
ADD COLUMN     "dataAlteracao" TIMESTAMP(3),
ADD COLUMN     "dataCompetencia" TIMESTAMP(3),
ADD COLUMN     "dataCriacao" TIMESTAMP(3);
