/*
  Warnings:

  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LegalTerms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Shirt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ShirtOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `size` column on the `ShirtOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `quantity` on the `ShirtOrder` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.

*/
CREATE TYPE "ShirtSize" AS ENUM ('P', 'M', 'G', 'GG', 'XGG');

ALTER TABLE "ShirtOrder" DROP CONSTRAINT "ShirtOrder_Client_fkey";
ALTER TABLE "ShirtOrder" DROP CONSTRAINT "ShirtOrder_LegalTerms_fkey";
ALTER TABLE "ShirtOrder" DROP CONSTRAINT "ShirtOrder_Shirt_fkey";

ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(0),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(0),
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("id");

ALTER TABLE "LegalTerms" DROP CONSTRAINT "LegalTerms_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(0),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(0),
ADD CONSTRAINT "LegalTerms_pkey" PRIMARY KEY ("id");

ALTER TABLE "Shirt" DROP CONSTRAINT "Shirt_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(0),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(0),
ADD CONSTRAINT "Shirt_pkey" PRIMARY KEY ("id");

ALTER TABLE "ShirtOrder" DROP CONSTRAINT "ShirtOrder_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "clientId" SET DATA TYPE TEXT,
ALTER COLUMN "shirtId" SET DATA TYPE TEXT,
ALTER COLUMN "size" SET DEFAULT 'G',
ALTER COLUMN "size" SET DATA TYPE "ShirtSize" USING size::"ShirtSize",
ALTER COLUMN "size" SET NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1,
ALTER COLUMN "quantity" SET DATA TYPE SMALLINT,
ALTER COLUMN "downPayment" SET DEFAULT 51.99,
ALTER COLUMN "termAccepted" SET DATA TYPE TEXT,
ALTER COLUMN "deliveredAt" SET DATA TYPE TIMESTAMP(0),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(0),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(0),
ADD CONSTRAINT "ShirtOrder_pkey" PRIMARY KEY ("id");

ALTER TABLE "ShirtOrder" ADD CONSTRAINT "ShirtOrder_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ShirtOrder" ADD CONSTRAINT "ShirtOrder_shirtId_fkey" FOREIGN KEY ("shirtId") REFERENCES "Shirt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ShirtOrder" ADD CONSTRAINT "ShirtOrder_termAccepted_fkey" FOREIGN KEY ("termAccepted") REFERENCES "LegalTerms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
