import { EnvironmentEditForm } from "../_components/form-wrapper"
import { getEnvironment } from "../_lib/queries"
import { updateEnvironment } from "../_lib/actions"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Fetch data on the server
  const environmentResult = await getEnvironment(id)

  if (environmentResult.error) {
    console.error("Error fetching environment:", environmentResult.error)
    return (
      <div className="flex flex-col gap-4 p-1">
        <div className="text-center text-muted-foreground">
          Error loading environment
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
      <EnvironmentEditForm 
        data={environment}
        updateAction={updateEnvironment}
        className="border border-border rounded-2xl"
      />
    </div>
  )
} 