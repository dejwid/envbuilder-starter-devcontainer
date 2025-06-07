import type { Route } from "./+types/test";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Test Page - React Router App" },
    { name: "description", content: "Test page for React Router!" },
  ];
}

export default function Test() {
  return <Welcome />;
}