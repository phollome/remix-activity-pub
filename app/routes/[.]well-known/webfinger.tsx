import { type LoaderFunctionArgs, json } from "@remix-run/node";
import config from "~/config";

export async function loader(args: LoaderFunctionArgs) {
  const { request } = args;

  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource");

  // check if the resource parameter is present
  if (resource === null) {
    return json(
      {
        error: "invalid_resource",
        error_description: "The resource parameter is missing.",
      },
      { status: 400 }
    );
  }

  const baseURL = new URL(config.get("app.baseURL"));

  // regexp to check if resource starts with acct: and value equals username@domain
  const acctRegExp = new RegExp(/^acct:[^@]+@[^@]+$/);

  // check if the resource parameter is a valid acct: URI
  if (acctRegExp.test(resource)) {
    const [username, domain] = resource.slice(5).split("@");
    if (domain !== baseURL.hostname) {
      return json(
        {
          error: "invalid_resource",
          error_description:
            "The resource parameter is invalid. The domain does not match.",
        },
        { status: 400 }
      );
    }

    // TODO: search for user
    const user = null;

    if (user === null) {
      return json(
        {
          subject: resource,
          links: [],
        },
        { headers: { "Content-Type": "application/jrd+json" } }
      );
    }
  }

  return json(
    {
      error: "invalid_resource",
      error_description: "The resource parameter has the wrong format.",
    },
    { status: 400 }
  );
}
