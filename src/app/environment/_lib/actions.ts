"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface EnvironmentVariable {
  name: string
  value: string
  is_secret: boolean
}

interface EnvironmentData {
  github_org?: string | null
  github_repo?: string | null
  name: string
  description?: string | null
  container_image?: string
  python_version?: string
  node_version?: string
  ruby_version?: string
  rust_version?: string
  go_version?: string
  bun_version?: string
  php_version?: string
  java_version?: string
  swift_version?: string
  setup_script_mode?: string
  setup_script?: string | null
  container_caching_enabled?: boolean
  internet_access_enabled?: boolean
  environment_variables?: EnvironmentVariable[]
}

const ENV_VAR_KEY_REGEX = /^[A-Z][A-Z0-9_]*$/

export async function createEnvironment(data: EnvironmentData) {
  const supabase = await createClient()
  
  try {
    // Validate environment variables if provided
    if (data.environment_variables && data.environment_variables.length > 0) {
      const seenKeys = new Set<string>()
      
      for (const variable of data.environment_variables) {
        const key = variable.name.trim()
        const value = variable.value.trim()
        
        if (!key && !value) continue
        
        if (!key || !value) {
          return { success: false, error: "Environment variables and secrets require both a key and value." }
        }
        
        const normalizedKey = key.toUpperCase()
        if (!ENV_VAR_KEY_REGEX.test(normalizedKey)) {
          return { success: false, error: "Keys must start with a letter and use only A-Z, 0-9, and underscores." }
        }
        
        if (seenKeys.has(normalizedKey)) {
          return { success: false, error: `Duplicate key "${normalizedKey}" detected.` }
        }
        
        seenKeys.add(normalizedKey)
        variable.name = normalizedKey
      }
    }
    
    // Extract environment variables from the data
    const environmentVariables = data.environment_variables || []
    delete data.environment_variables
    
    // Set default values for required fields
    const environmentData = {
      github_org: data.github_org || null,
      github_repo: data.github_repo || null,
      name: data.name.trim(),
      description: data.description?.trim() || null,
      container_image: data.container_image || "universal",
      python_version: data.python_version || "3.12",
      node_version: data.node_version || "20",
      ruby_version: data.ruby_version || "3.4.4",
      rust_version: data.rust_version || "1.89.0",
      go_version: data.go_version || "1.24.3",
      bun_version: data.bun_version || "1.2.14",
      php_version: data.php_version || "8.4",
      java_version: data.java_version || "21",
      swift_version: data.swift_version || "6.1",
      setup_script_mode: data.setup_script_mode === "manual" ? "manual" : "automatic",
      setup_script: data.setup_script?.trim() || null,
      container_caching_enabled: data.container_caching_enabled || false,
      internet_access_enabled: data.internet_access_enabled || false,
    }
    
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
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateEnvironment(id: string, data: Record<string, unknown>) {
  const supabase = await createClient()
  
  try {
    const { data: updatedEnvironment, error } = await supabase
      .from("environments")
      .update(data)
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
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function multiUpdateEnvironments(environmentIds: string[], data: Record<string, unknown>) {
  const supabase = await createClient()
  
  try {
    // Only process fields that are actually provided (not undefined)
    const fieldsToUpdate = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
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