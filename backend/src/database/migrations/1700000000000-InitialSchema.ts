import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1700000000000 implements MigrationInterface {
  name = "InitialSchema1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание enum для PaymentStatus (TypeORM создает его автоматически с префиксом таблицы)
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "orders_paymentstatus_enum" AS ENUM('unpaid', 'paid', 'manual');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Создание таблицы users
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "fullName" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone")
      )
    `);

    // Создание таблицы cities
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cities" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_4762ffb6e5d198cfec5606bc11e" UNIQUE ("name")
      )
    `);

    // Создание таблицы tariffs
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tariffs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "month" integer NOT NULL,
        "pricePerKmUnder1000" numeric(10,2) NOT NULL,
        "pricePerKmOver1000" numeric(10,2) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tariffs_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_tariffs_month" UNIQUE ("month")
      )
    `);

    // Создание таблицы orders
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "carBrand" character varying NOT NULL,
        "cityFromId" uuid NOT NULL,
        "cityToId" uuid NOT NULL,
        "startDate" date NOT NULL,
        "distance" numeric(10,2) NOT NULL,
        "appliedTariff" numeric(10,2) NOT NULL,
        "isFixedRoute" boolean NOT NULL DEFAULT false,
        "transportPrice" numeric(10,2) NOT NULL,
        "insurancePrice" numeric(10,2) NOT NULL,
        "totalPrice" numeric(10,2) NOT NULL,
        "durationHours" integer NOT NULL,
        "durationDays" integer NOT NULL,
        "estimatedArrivalDate" date NOT NULL,
        "paymentStatus" "orders_paymentstatus_enum" NOT NULL DEFAULT 'unpaid',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_orders_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_orders_cityFrom" FOREIGN KEY ("cityFromId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_orders_cityTo" FOREIGN KEY ("cityToId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )
    `);

    // Создание индексов
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_orders_userId" ON "orders" ("userId");
      CREATE INDEX IF NOT EXISTS "IDX_orders_cityFromId" ON "orders" ("cityFromId");
      CREATE INDEX IF NOT EXISTS "IDX_orders_cityToId" ON "orders" ("cityToId");
      CREATE INDEX IF NOT EXISTS "IDX_orders_paymentStatus" ON "orders" ("paymentStatus");
      CREATE INDEX IF NOT EXISTS "IDX_orders_startDate" ON "orders" ("startDate");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаление таблиц в обратном порядке
    await queryRunner.query(`DROP TABLE IF EXISTS "orders"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tariffs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cities"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    
    // Удаление enum
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_paymentstatus_enum"`);
  }
}

