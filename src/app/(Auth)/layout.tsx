import { Terminal } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <Terminal className="size-10 shrink-0" />
        <h1 className="text-2xl font-bold">Codex Open</h1>
        <p className="text-sm text-muted-foreground">
          Codex Open is a tool that helps you create code.
        </p>
      {children}
    </main>
  );
}
