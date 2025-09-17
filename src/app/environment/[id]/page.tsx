import EnvironmentForm from "../_components/form"
import { getEnvironment } from "../_lib/queries"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch data on the server
  const environmentResult = await getEnvironment(id)

  if (environmentResult.error) {
    console.error("Error fetching environment:", environmentResult.error)
    return (
      <div className="flex flex-col gap-4 p-1">
        <div className="text-center text-muted-foreground">
          Error loading company
        </div>
      </div>
    )
  }

  if (!environmentResult.data) {
    return (
      <div className="flex flex-col gap-4 p-1">
        <div className="text-center text-muted-foreground">
          Environment not found
        </div>
      </div>
    )
  }

  const environment = environmentResult.data

  return (
    <div className="flex flex-col gap-4 p-1">
      <EnvironmentForm 
        initialName={environment.name || ""}
        initialDescription={environment.description || ""}
      />
    </div>
  )
} 