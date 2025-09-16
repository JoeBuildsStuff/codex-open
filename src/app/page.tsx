import EnvironmentForm from "@/components/environments/environment-form";
import { AuthButton } from "@/components/auth-button";
import Logo from "@/components/ui/logo";
import { Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto] w-full">
      <header className="sticky top-0 flex h-12 w-full items-center justify-between p-4">
        <Logo icon={Terminal} text="Codex Open" />
        <div>
          <AuthButton size="icon" />
        </div>
      </header>

      <main className="w-full h-full p-3">
        <EnvironmentForm />
      </main>

      <footer className="flex h-10 w-full items-center justify-between p-3">
        Footer
      </footer>
    </div>
  );
}
