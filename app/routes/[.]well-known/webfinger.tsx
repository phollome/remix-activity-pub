import { type LoaderFunctionArgs, json } from "@remix-run/node";
import config from "~/config";
import { getDbClient } from "~/db.server";

export async function loader(args: LoaderFunctionArgs) {
  const { request } = args;

  const { searchParams } = new URL(request.url);
  const resource = searchParams.get("resource");

  // check if the resource parameter is present
  if (resource === null) {
    return json(
      {
        error: "Invalid resource format",
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
          error: "Invalid resource format",
          error_description:
            "The resource parameter is invalid. The domain does not match.",
        },
        { status: 400 }
      );
    }

    // get the user
    const dbClient = getDbClient();
    const user = await dbClient.user.findFirst({
      where: {
        username,
      },
    });

    if (user === null) {
      return json(
        {
          error: "Resource not found",
          error_description: "No Resource for given parameters found.",
        },
        { status: 404 }
      );
    }
    return json({
      subject: resource,
      links: [
        {
          rel: "self",
          type: "application/activity+json",
          href: `${baseURL.origin}/users/${username}`,
        },
      ],
    });
  }

  return json(
    {
      error: "Invalid resource format",
      error_description: "The resource parameter has the wrong format.",
    },
    { status: 400 }
  );
}
