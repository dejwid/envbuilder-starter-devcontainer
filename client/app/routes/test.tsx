import { Welcome } from "../welcome/welcome";
import { Header, Footer } from "../components";

export function meta() {
  return [
    { title: "Test Page - React Router App" },
    { name: "description", content: "Test page for React Router!" },
  ];
}

export default function Test() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#36391a] to-transparent text-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <Welcome />
      </main>
      <Footer />
    </div>
  );
}