"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import EnvironmentForm from "../_components/form"
import { 
  Environment, 
  EnvironmentFormData,
  EnvironmentFormDataSchema,
  type EnvironmentInsert,
  type EnvironmentUpdate
} from "../_lib/validations"
import { Button } from "@/components/ui/button"
import { X, Plus, Save } from "lucide-react"
import { toast } from "sonner"

// Helper function to transform form data to database format
function transformFormDataToEnvironment(formData: EnvironmentFormData): EnvironmentInsert {
  const environmentVariables: Array<{ name: string; value: string; is_secret: boolean }> = []
  
  // Process environment variables
  if (formData.environment_variables) {
    formData.environment_variables.forEach(envVar => {
      if (envVar.key.trim() && envVar.value.trim()) {
        environmentVariables.push({
          name: envVar.key.trim().toUpperCase(),
          value: envVar.value.trim(),
          is_secret: false
        })
      }
    })
  }
  
  // Process secrets
  if (formData.secrets) {
    formData.secrets.forEach(secret => {
      if (secret.key.trim() && secret.value.trim()) {
        environmentVariables.push({
          name: secret.key.trim().toUpperCase(),
          value: secret.value.trim(),
          is_secret: true
        })
      }
    })
  }
  
  // Validate and transform the form data
  const validatedFormData = EnvironmentFormDataSchema.parse(formData)
  
  return {
    name: validatedFormData.name,
    description: validatedFormData.description || null,
    github_org: validatedFormData.github_org || null,
    github_repo: validatedFormData.github_repo || null,
    container_image: validatedFormData.container_image as "universal" | "node" | "python",
    python_version: validatedFormData.python_version,
    node_version: validatedFormData.node_version,
    ruby_version: validatedFormData.ruby_version,
    rust_version: validatedFormData.rust_version,
    go_version: validatedFormData.go_version,
    bun_version: validatedFormData.bun_version,
    php_version: validatedFormData.php_version,
    java_version: validatedFormData.java_version,
    swift_version: validatedFormData.swift_version,
    setup_script_mode: validatedFormData.setup_script_mode === "2" ? "manual" : "automatic",
    setup_script: validatedFormData.setup_script?.trim() || null,
    container_caching_enabled: validatedFormData.container_caching_enabled,
    internet_access_enabled: validatedFormData.internet_access_enabled,
    environment_variables: environmentVariables.length > 0 ? environmentVariables : undefined
  }
}

// Add Form Wrapper
export function EnvironmentAddForm({
  onSuccess,
  onCancel,
  createAction
}: {
  onSuccess?: () => void
  onCancel?: () => void
  createAction?: (data: EnvironmentInsert) => Promise<{ success: boolean; error?: string }>
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<EnvironmentFormData | null>(null)

  const handleFormDataChange = useCallback((data: EnvironmentFormData) => {
    setFormData(data)
  }, [])

  const handleSubmit = async () => {
    if (!formData || !createAction) return

    setIsSubmitting(true)
    try {
      const environmentData = transformFormDataToEnvironment(formData)
      const result = await createAction(environmentData)
      
      if (result.success) {
        router.refresh()
        onSuccess?.()
        toast.success("Environment created successfully")
      } else {
        console.error("Failed to create environment:", result.error)
        toast.error("Failed to create environment", { description: result.error })
      }
    } catch (error) {
      console.error("Error creating environment:", error)
      
      // Handle validation errors
      if (error instanceof Error && error.name === 'ZodError') {
        toast.error("Please check your input and try again")
      } else {
        toast.error("An unexpected error occurred while creating the environment.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto">
        <EnvironmentForm
          onChange={handleFormDataChange}
        />
      </div>
      
      <div className="flex justify-between gap-2 p-4  bg-background">
        <Button
          type="button"
          variant="red"
          onClick={onCancel}
          className="w-1/2"
        >
          <X className="size-4 shrink-0" /> Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData}
          className="w-1/2"
          variant="blue"
        >
          <Plus className="size-4 shrink-0" />
          {isSubmitting ? "Adding..." : "Add Environment"}
        </Button>
      </div>
    </div>
  )
}

// Edit Form Wrapper
export function EnvironmentEditForm({
  data,
  onSuccess,
  onCancel,
  updateAction,
  className
}: {
  data: Environment
  onSuccess?: () => void
  onCancel?: () => void
  updateAction?: (id: string, data: EnvironmentUpdate) => Promise<{ success: boolean; error?: string }>
  className?: string
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<EnvironmentFormData | null>(null)

  const handleFormDataChange = useCallback((formData: EnvironmentFormData) => {
    setFormData(formData)
  }, [])

  const handleSubmit = async () => {
    if (!formData || !updateAction) return

    setIsSubmitting(true)
    try {
      const environmentData = transformFormDataToEnvironment(formData)
      const result = await updateAction(data.id, environmentData)
      
      if (result.success) {
        router.refresh()
        onSuccess?.()
        toast.success("Environment updated successfully")
      } else {
        console.error("Failed to update environment:", result.error)
        toast.error("Failed to update environment", { description: result.error })
      }
    } catch (error) {
      console.error("Error updating environment:", error)
      toast.error("An unexpected error occurred while updating the environment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto">
        <EnvironmentForm
          initialName={data.name || ""}
          initialDescription={data.description || ""}
          onChange={handleFormDataChange}
          className={className}
        />
      </div>
      
      <div className="flex justify-between gap-2 p-4  bg-background">
        <Button
          type="button"
          variant="red"
          onClick={onCancel}
          className="w-1/2"
        >
          <X className="size-4 shrink-0" /> Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData}
          className="w-1/2"
          variant="blue"
        >
          <Save className="size-4 shrink-0" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}

// Multi Edit Form Wrapper
  export function EnvironmentMultiEditForm({
  selectedCount,
  onSuccess,
  onCancel,
  updateActionMulti
}: {
  selectedCount: number
  onSuccess?: () => void
  onCancel?: () => void
  updateActionMulti?: (ids: string[], data: EnvironmentUpdate) => Promise<{ success: boolean; error?: string; updatedCount?: number }>
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<EnvironmentFormData | null>(null)

  const handleFormDataChange = useCallback((data: EnvironmentFormData) => {
    setFormData(data)
  }, [])

  const handleSubmit = async () => {
    if (!formData || !updateActionMulti) return

    setIsSubmitting(true)
    try {
      const environmentData = transformFormDataToEnvironment(formData)
      
      // Filter out undefined values for multi edit - only update fields that were actually modified
      const filteredData = Object.fromEntries(
        Object.entries(environmentData as Record<string, unknown>).filter(([, value]) => {
          if (value === undefined || value === null) return false
          if (typeof value === 'string' && value.trim() === '') return false
          return true
        })
      )
      
      // The updateActionMulti function will be called with the selected environment IDs
      // by the DataTableRowEditMulti component
      const result = await updateActionMulti([], filteredData)
      
      if (result.success) {
        router.refresh()
        onSuccess?.()
        toast.success("Environments updated successfully", {
          description: `${result.updatedCount || selectedCount} environment${(result.updatedCount || selectedCount) > 1 ? 's' : ''} updated.`
        })
      } else {
        console.error("Failed to update environments:", result.error)
        toast.error("Failed to update environments", { description: result.error })
      }
    } catch (error) {
      console.error("Error updating environments:", error)
      toast.error("An unexpected error occurred while updating the environments.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto">
        <EnvironmentForm
          onChange={handleFormDataChange}
          // Start with empty values for multi edit
          initialName=""
          initialDescription=""
        />
      </div>
      
      <div className="flex justify-between gap-2 p-4 bg-background">
        <Button
          type="button"
          variant="red"
          onClick={onCancel}
          className="w-1/2"
        >
          <X className="size-4 shrink-0" /> Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData}
          className="w-1/2"
          variant="blue"
        >
          <Save className="size-4 shrink-0" />
          {isSubmitting ? "Updating..." : `Update ${selectedCount} Environment${selectedCount > 1 ? 's' : ''}`}
        </Button>
      </div>
    </div>
  )
}