export type Environment = {
    id: string;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
    name: string;
    description?: string | null;
    github_org?: string | null;
    github_repo?: string | null;
    container_image?: string;
    python_version?: string;
    node_version?: string;
    ruby_version?: string;
    rust_version?: string;
    go_version?: string;
    bun_version?: string;
    php_version?: string;
    java_version?: string;
    swift_version?: string;
    setup_script_mode?: string;
    setup_script?: string | null;
    container_caching_enabled?: boolean;
    internet_access_enabled?: boolean;
  }
  
  // Form-specific types (for your React component)
  export type EnvironmentFormData = {
    name: string;
    description: string;
  }
  
  // API response types
  export type EnvironmentListResponse = {
    environments: Environment[];
    total: number;
  }
  
  export type EnvironmentDetailResponse = Environment;
  
  // Insert/Update types (without generated fields)
  export type EnvironmentInsert = Omit<Environment, 'id' | 'created_at'>;
  export type EnvironmentUpdate = Partial<EnvironmentInsert>;
  
  // Utility types for the component
  export type EnvironmentData = {
    name: string;
    description: string;
  }