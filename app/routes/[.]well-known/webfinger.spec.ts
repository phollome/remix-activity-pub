import { test, expect } from "vitest";
import { loader } from "./webfinger";
import config from "~/config";
import { randUserName } from "@ngneat/falso";

const baseURL = config.get("app.baseURL");
const username = randUserName();

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
