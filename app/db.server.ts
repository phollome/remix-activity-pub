import { PrismaClient } from "@prisma/client";

let dbClient: PrismaClient;

export function getDbClient() {
  if (!dbClient) {
    dbClient = new PrismaClient();
  }
  return dbClient;
}
