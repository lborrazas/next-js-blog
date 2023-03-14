-- CreateTable
CREATE TABLE "Parcela" (
    "id" TEXT NOT NULL,
    "latitud" INTEGER NOT NULL,
    "longitud" INTEGER NOT NULL,
    "m2" INTEGER NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Parcela_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "pid" TEXT NOT NULL,
    "m2used" INTEGER NOT NULL,
    "m3" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "address" TEXT,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "History_address_key" ON "History"("address");

-- CreateIndex
CREATE INDEX "History_address_date_idx" ON "History"("address", "date" DESC);

-- CreateIndex
CREATE INDEX "users_address_idx" ON "users"("address");
