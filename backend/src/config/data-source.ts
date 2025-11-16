import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";

config();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../database/migrations/*{.ts,.js}"],
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

