import { SEO } from "site.config";

export function meta() {
  return [{ title: SEO.title }, { name: "description", content: SEO.description }];
}

export default function Home() {
  return <main>Main Page</main>;
}
