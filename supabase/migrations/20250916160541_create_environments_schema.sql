-- Create schema to store environment configuration data if it does not exist yet
create schema if not exists codex_open;

-- Ensure helper extensions are available (already enabled in most Supabase projects)
create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists moddatetime with schema extensions;

create table if not exists codex_open.environments (
    id uuid primary key default gen_random_uuid(),
    created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
    github_org text,
    github_repo text,
    name text not null,
    description text,
    container_image text not null default 'universal',
    python_version text not null default '3.12',
    node_version text not null default '20',
    ruby_version text not null default '3.4.4',
    rust_version text not null default '1.89.0',
    go_version text not null default '1.24.3',
    bun_version text not null default '1.2.14',
    php_version text not null default '8.4',
    java_version text not null default '21',
    swift_version text not null default '6.1',
    setup_script_mode text not null default 'automatic' check (setup_script_mode in ('automatic', 'manual')),
    setup_script text,
    container_caching_enabled boolean not null default false,
    internet_access_enabled boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint environment_name_length check (char_length(name) between 1 and 120)
);

create unique index if not exists environments_owner_name_key
    on codex_open.environments (created_by, lower(name));

create trigger set_environments_updated_at
    before update on codex_open.environments
    for each row execute procedure moddatetime(updated_at);

create table if not exists codex_open.environment_variables (
    id bigserial primary key,
    environment_id uuid not null references codex_open.environments(id) on delete cascade,
    name text not null,
    value text not null,
    is_secret boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint env_var_key_format check (name ~ '^[A-Z][A-Z0-9_]*$')
);

create unique index if not exists environment_variables_environment_key_unique
    on codex_open.environment_variables (environment_id, name);

create index if not exists environment_variables_environment_id_idx
    on codex_open.environment_variables (environment_id);

create trigger set_environment_variables_updated_at
    before update on codex_open.environment_variables
    for each row execute procedure moddatetime(updated_at);

-- Enable Row Level Security and scope data to the authenticated owner
alter table codex_open.environments enable row level security;
alter table codex_open.environment_variables enable row level security;

create policy "environments_select" on codex_open.environments
    for select using (auth.uid() = created_by);

create policy "environments_insert" on codex_open.environments
    for insert with check (auth.uid() = created_by);

create policy "environments_update" on codex_open.environments
    for update using (auth.uid() = created_by) with check (auth.uid() = created_by);

create policy "environments_delete" on codex_open.environments
    for delete using (auth.uid() = created_by);

create policy "environment_variables_select" on codex_open.environment_variables
    for select using (
        exists (
            select 1 from codex_open.environments env
            where env.id = environment_variables.environment_id
              and env.created_by = auth.uid()
        )
    );

create policy "environment_variables_insert" on codex_open.environment_variables
    for insert with check (
        exists (
            select 1 from codex_open.environments env
            where env.id = environment_variables.environment_id
              and env.created_by = auth.uid()
        )
    );

create policy "environment_variables_update" on codex_open.environment_variables
    for update using (
        exists (
            select 1 from codex_open.environments env
            where env.id = environment_variables.environment_id
              and env.created_by = auth.uid()
        )
    ) with check (
        exists (
            select 1 from codex_open.environments env
            where env.id = environment_variables.environment_id
              and env.created_by = auth.uid()
        )
    );

create policy "environment_variables_delete" on codex_open.environment_variables
    for delete using (
        exists (
            select 1 from codex_open.environments env
            where env.id = environment_variables.environment_id
              and env.created_by = auth.uid()
        )
    );
