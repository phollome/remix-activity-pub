import { test, expect, beforeAll, afterAll } from "vitest";
import { loader } from "./webfinger";
import config from "~/config";
import { randUserName, randEmail, randPassword } from "@ngneat/falso";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getDbClient } from "~/db.server";

const baseURL = config.get("app.baseURL");
const username = randUserName({ withAccents: false }).toLowerCase();
const email = randEmail();
const password = bcrypt.hashSync(randPassword(), 10);

let dbClient: PrismaClient;

beforeAll(async () => {
  dbClient = getDbClient();
  await dbClient.user.create({
    data: {
      username,
      email,
      password,
    },
  });
});

afterAll(async () => {
  await dbClient.user.deleteMany();
  await dbClient.$disconnect();
});

test("no resource", async () => {
  const request = new Request(`${baseURL}/.well-known/webfinger`);
  const response = await loader({ request, params: {}, context: {} });
  expect(response.status).toBe(400);
  const body = (await response.json()) as {
    error: string;
    error_description: string;
  };
  expect(body.error).toBe("Invalid resource format");
  expect(body.error_description).toBe("The resource parameter is missing.");
});

test("wrong format", async () => {
  const request = new Request(
    `${baseURL}/.well-known/webfinger?resource=acct:user@name@somedomain.com`
  );
  const response = await loader({ request, params: {}, context: {} });
  expect(response.status).toBe(400);
  const body = (await response.json()) as {
    error: string;
    error_description: string;
  };
  expect(body.error).toBe("Invalid resource format");
  expect(body.error_description).toBe(
    "The resource parameter has the wrong format."
  );
});

test("wrong domain", async () => {
  const request = new Request(
    `${baseURL}/.well-known/webfinger?resource=acct:username@wrongdomain.com`
  );
  const response = await loader({ request, params: {}, context: {} });
  expect(response.status).toBe(400);
  const body = (await response.json()) as {
    error: string;
    error_description: string;
  };
  expect(body.error).toBe("Invalid resource format");
  expect(body.error_description).toBe(
    "The resource parameter is invalid. The domain does not match."
  );
});

test("empty user return", async () => {
  const request = new Request(
    `${baseURL}/.well-known/webfinger?resource=acct:username@localhost`
  );
  const response = await loader({ request, params: {}, context: {} });
  expect(response.status).toBe(404);
  const body = (await response.json()) as {
    error: string;
    error_description: string;
  };
  expect(body.error).toBe("Resource not found");
  expect(body.error_description).toBe(
    "No Resource for given parameters found."
  );
});

test("user return", async () => {
  const request = new Request(
    `${baseURL}/.well-known/webfinger?resource=acct:${username}@localhost`
  );
  const response = await loader({ request, params: {}, context: {} });
  expect(response.status).toBe(200);
  const body = (await response.json()) as {
    subject: string;
    links: {
      rel: string;
      type: string;
      href: string;
    }[];
  };

  expect(body.subject).toBe(`acct:${username}@localhost`);
  expect(body.links.length).toBe(1);
  expect(body.links[0].rel).toBe("self");
  expect(body.links[0].type).toBe("application/activity+json");
  expect(body.links[0].href).toBe(`${baseURL}/users/${username}`);
});
