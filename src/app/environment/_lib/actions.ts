"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { 
  EnvironmentInsertSchema, 
  EnvironmentUpdateSchema,
  type EnvironmentInsert,
  type EnvironmentUpdate
} from "./validations"

export async function createEnvironment(data: EnvironmentInsert) {
  const supabase = await createClient()
  
  try {
    // Validate the input data
    const validatedData = EnvironmentInsertSchema.parse(data)
    
    // Validate environment variables if provided
    if (validatedData.environment_variables && validatedData.environment_variables.length > 0) {
      const seenKeys = new Set<string>()
      
      for (const variable of validatedData.environment_variables) {
        // Each variable is already validated by the schema
        const normalizedKey = variable.name.toUpperCase()
        
        if (seenKeys.has(normalizedKey)) {
          return { success: false, error: `Duplicate key "${normalizedKey}" detected.` }
        }
        
        seenKeys.add(normalizedKey)
        variable.name = normalizedKey
      }
    }
    
    // Extract environment variables from the validated data
    const environmentVariables = validatedData.environment_variables || []
    
    // Prepare the data for insertion (environment variables handled separately)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { environment_variables: _, ...environmentData } = validatedData
    
    const { data: newEnvironment, error } = await supabase
      .from("environments")
      .insert([environmentData])
      .select("id")
      .single()
    
    if (error) {
      console.error("Error creating environment:", error)
      return { success: false, error: error.message }
    }
    
    // Insert environment variables if any
    if (environmentVariables.length > 0) {
      const { error: variableError } = await supabase
        .from("environment_variables")
        .insert(
          environmentVariables.map((variable) => ({
            ...variable,
            environment_id: newEnvironment.id,
          }))
        )
      
      if (variableError) {
        // Clean up the environment if variable insertion fails
        await supabase.from("environments").delete().eq("id", newEnvironment.id)
        console.error("Error creating environment variables:", variableError)
        return { success: false, error: variableError.message }
      }
    }
    
    revalidatePath("/environment")
    return { success: true, data: newEnvironment }
  } catch (error) {
    console.error("Unexpected error creating environment:", error)
    
    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return { success: false, error: "Invalid input data provided" }
    }
    
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateEnvironment(id: string, data: EnvironmentUpdate) {
  const supabase = await createClient()
  
  try {
    // Validate the update data
    const validatedData = EnvironmentUpdateSchema.parse(data)
    
    const { data: updatedEnvironment, error } = await supabase
      .from("environments")
      .update(validatedData)
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating environment:", error)
      return { success: false, error: error.message }
    }
    
    revalidatePath("/environment")
    return { success: true, data: updatedEnvironment }
  } catch (error) {
    console.error("Unexpected error updating environment:", error)
    
    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return { success: false, error: "Invalid input data provided" }
    }
    
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function multiUpdateEnvironments(environmentIds: string[], data: EnvironmentUpdate) {
  const supabase = await createClient()
  
  try {
    // Validate the update data
    const validatedData = EnvironmentUpdateSchema.parse(data)
    
    // Only process fields that are actually provided (not undefined)
    const fieldsToUpdate = Object.fromEntries(
      Object.entries(validatedData).filter(([, value]) => value !== undefined)
    )
    
    // Update all environments with the provided data
    if (Object.keys(fieldsToUpdate).length > 0) {
      const { error } = await supabase
        .from("environments")
        .update(fieldsToUpdate)
        .in("id", environmentIds)
      
      if (error) {
        console.error("Error multi updating environments:", error)
        return { success: false, error: error.message }
      }
    }
    
    revalidatePath("/environment")
    return { success: true, updatedCount: environmentIds.length }
  } catch (error) {
    console.error("Unexpected error multi updating environments:", error)
    
    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return { success: false, error: "Invalid input data provided" }
    }
    
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteEnvironments(environmentIds: string[]) {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from("environments")
      .delete()
      .in("id", environmentIds)
    
    if (error) {
      console.error("Error deleting environments:", error)
      return { success: false, error: error.message }
    }
    
    revalidatePath("/environment")
    return { success: true, deletedCount: environmentIds.length }
  } catch (error) {
    console.error("Unexpected error deleting environments:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}