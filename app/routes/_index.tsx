import type { MetaFunction } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { RootOutletContext } from "~/root";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const outletContext = useOutletContext<RootOutletContext>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome 👋</h1>
      <p>baseURL: {outletContext.config.baseURL}</p>
    </div>
  );
}
