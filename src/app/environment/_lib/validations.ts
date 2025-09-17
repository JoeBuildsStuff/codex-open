import { z } from "zod"

// Environment Variable Schema
export const EnvironmentVariableSchema = z.object({
  name: z.string()
    .min(1, "Variable name is required")
    .regex(/^[A-Z][A-Z0-9_]*$/, "Variable name must start with a letter and use only A-Z, 0-9, and underscores"),
  value: z.string().min(1, "Variable value is required"),
  is_secret: z.boolean().default(false)
})

// Main Environment Schema
export const EnvironmentSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  created_by: z.string().uuid().optional(),
  name: z.string()
    .min(1, "Environment name is required")
    .max(100, "Environment name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Environment name can only contain letters, numbers, hyphens, and underscores"),
  description: z.string().max(500, "Description must be less than 500 characters").nullable().optional(),
  github_org: z.string().min(1).max(100).nullable().optional(),
  github_repo: z.string().min(1).max(100).nullable().optional(),
  container_image: z.enum(["universal", "node", "python"]).default("universal"),
  python_version: z.string().regex(/^\d+\.\d+$/, "Invalid Python version format").default("3.12"),
  node_version: z.string().regex(/^\d+$/, "Invalid Node version format").default("20"),
  ruby_version: z.string().regex(/^\d+\.\d+\.\d+$/, "Invalid Ruby version format").default("3.4.4"),
  rust_version: z.string().regex(/^\d+\.\d+\.\d+$/, "Invalid Rust version format").default("1.89.0"),
  go_version: z.string().regex(/^\d+\.\d+\.\d+$/, "Invalid Go version format").default("1.24.3"),
  bun_version: z.string().regex(/^\d+\.\d+\.\d+$/, "Invalid Bun version format").default("1.2.14"),
  php_version: z.string().regex(/^\d+\.\d+$/, "Invalid PHP version format").default("8.4"),
  java_version: z.string().regex(/^\d+$/, "Invalid Java version format").default("21"),
  swift_version: z.string().regex(/^\d+\.\d+$/, "Invalid Swift version format").default("6.1"),
  setup_script_mode: z.enum(["automatic", "manual"]).default("automatic"),
  setup_script: z.string().nullable().optional(),
  container_caching_enabled: z.boolean().default(false),
  internet_access_enabled: z.boolean().default(false),
  environment_variables: z.array(EnvironmentVariableSchema).optional()
})

// Form Data Schema (for client-side forms)
export const EnvironmentFormDataSchema = z.object({
  name: z.string()
    .min(1, "Environment name is required")
    .max(100, "Environment name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Environment name can only contain letters, numbers, hyphens, and underscores"),
  description: z.string().max(500, "Description must be less than 500 characters").default(""),
  github_org: z.string().optional(),
  github_repo: z.string().optional(),
  container_image: z.string().default("universal"),
  python_version: z.string().default("3.12"),
  node_version: z.string().default("20"),
  ruby_version: z.string().default("3.4.4"),
  rust_version: z.string().default("1.89.0"),
  go_version: z.string().default("1.24.3"),
  bun_version: z.string().default("1.2.14"),
  php_version: z.string().default("8.4"),
  java_version: z.string().default("21"),
  swift_version: z.string().default("6.1"),
  setup_script_mode: z.string().default("automatic"),
  setup_script: z.string().default(""),
  container_caching_enabled: z.boolean().default(false),
  internet_access_enabled: z.boolean().default(false),
  environment_variables: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).optional(),
  secrets: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).optional()
})

// Insert Schema (for creating new environments)
export const EnvironmentInsertSchema = EnvironmentSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true,
  created_by: true
})

// Update Schema (for updating existing environments)
export const EnvironmentUpdateSchema = EnvironmentInsertSchema.partial()

// Type exports
export type Environment = z.infer<typeof EnvironmentSchema>
export type EnvironmentFormData = z.infer<typeof EnvironmentFormDataSchema>
export type EnvironmentInsert = z.infer<typeof EnvironmentInsertSchema>
export type EnvironmentUpdate = z.infer<typeof EnvironmentUpdateSchema>
export type EnvironmentVariable = z.infer<typeof EnvironmentVariableSchema>

// API response types
export type EnvironmentListResponse = {
  environments: Environment[];
  total: number;
}

export type EnvironmentDetailResponse = Environment;