export default function Home() {
  return (
    <div className="grid min-h-dvh grid-rows-[auto_1fr_auto] w-full">
      <header className="sticky top-0 flex h-10 w-full items-center justify-between p-3">
        Header
      </header>

      <main className="w-full h-full p-3">
        Main
      </main>

      <footer className="flex h-10 w-full items-center justify-between p-3">
        Footer
      </footer>
    </div>
  );
}
