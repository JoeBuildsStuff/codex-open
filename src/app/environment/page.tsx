import DataTableEnvironment from "./_components/table"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  return (
    <main className="max-w-4xl mx-4 md:mx-auto ">
      <DataTableEnvironment searchParams={params} />
    </main>
  )
}