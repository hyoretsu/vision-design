CREATE OR REPLACE FUNCTION generate_tsid(table_name TEXT) RETURNS BIGINT AS
$$
DECLARE
    C_MILLI_PREC          BIGINT := 10 ^ 3;
    C_RANDOM_LEN          BIGINT := 2 ^ 12;
    C_TSID_EPOCH          BIGINT := 1733011200; -- 2024-12-01 00:00:00

    C_TIMESTAMP_COMPONENT BIGINT := floor((extract('epoch' from clock_timestamp()) - C_TSID_EPOCH) * C_MILLI_PREC);
    C_RANDOM_COMPONENT    BIGINT := floor(random() * C_RANDOM_LEN);
    C_COUNTER_COMPONENT   BIGINT;
    seq_name              TEXT;
BEGIN
    seq_name := table_name || '_tsid_seq';

    -- Check if the sequence already exists
    IF NOT EXISTS (SELECT 1
                   FROM pg_catalog.pg_sequences
                   WHERE sequencename = seq_name
                     AND schemaname = 'public') THEN
        -- Create the sequence if it doesn't exist
        EXECUTE format('CREATE SEQUENCE %I MAXVALUE 1024 AS SMALLINT CYCLE', seq_name);
    END IF;

    EXECUTE format('SELECT nextval(%L)', 'public."' || seq_name || '"') INTO C_COUNTER_COMPONENT;

    C_COUNTER_COMPONENT := C_COUNTER_COMPONENT - 1;

    RETURN ((C_TIMESTAMP_COMPONENT << 22) | (C_RANDOM_COMPONENT << 10) | C_COUNTER_COMPONENT);
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION updated_at() RETURNS TRIGGER AS
$$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CreateTable
CREATE TABLE "Client" (
    "id" BIGINT NOT NULL DEFAULT generate_tsid('Client'),
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shirt" (
    "id" BIGINT NOT NULL DEFAULT generate_tsid('Shirt'),
    "model" VARCHAR(50) NOT NULL,
    "manufacturingPrice" DECIMAL(4,2) NOT NULL,
    "prices" DECIMAL(4,2)[],
    "photos" VARCHAR(100)[],
    "colors" VARCHAR(32)[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shirt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalTerms" (
    "id" BIGINT NOT NULL DEFAULT generate_tsid('LegalTerms'),
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LegalTerms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShirtOrder" (
    "id" BIGINT NOT NULL DEFAULT generate_tsid('ShirtOrder'),
    "clientId" BIGINT NOT NULL,
    "shirtId" BIGINT NOT NULL,
    "color" VARCHAR(15) NOT NULL,
    "size" VARCHAR(3) NOT NULL,
    "babyLook" BOOLEAN NOT NULL DEFAULT false,
    "quantity" INTEGER NOT NULL,
    "downPayment" DECIMAL(4,2) NOT NULL,
    "finalPayment" DECIMAL(4,2),
    "payments" BOOLEAN[2],
    "termAccepted" BIGINT,
    "orderedAt" DATE,
    "deliveredTo" VARCHAR(50),
    "deliveredAt" TIMESTAMP(6) WITH TIME ZONE,
    "expiredAt" DATE,
    "cancelledAt" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShirtOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ShirtOrder" ADD CONSTRAINT "ShirtOrder_Client_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShirtOrder" ADD CONSTRAINT "ShirtOrder_Shirt_fkey" FOREIGN KEY ("shirtId") REFERENCES "Shirt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShirtOrder" ADD CONSTRAINT "ShirtOrder_LegalTerms_fkey" FOREIGN KEY ("termAccepted") REFERENCES "LegalTerms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

