# Repository Guidelines

## Project Structure & Module Organization
The app router lives in `src/app`, with route groups such as `(Auth)` hosting Supabase auth flows. Shared UI sits in `src/components` (files are kebab-case but export PascalCase components). Server actions and data access helpers are kept in `src/actions` and `src/lib`, while authentication context is in `src/contexts`. Hooks and types reside in `src/hooks` and `src/types`. Static assets belong in `public/`, and Tailwind/global styles are maintained under `src/app/globals.css`.

## Build, Test, and Development Commands
Install dependencies with `pnpm install`. Use `pnpm dev` to run the Next.js dev server on `http://localhost:3000`. Build production assets with `pnpm build`, then verify the optimized app via `pnpm start`. Run `pnpm lint` before committing; it executes the project-wide ESLint configuration defined in `eslint.config.mjs`.

## Coding Style & Naming Conventions
Write TypeScript with React Server/Client Components as appropriate—add `'use client'` only when needed. Follow the strict ESLint rules already configured; keep two-space indentation and prefer arrow functions for callbacks. Co-locate styles with components via Tailwind utility classes, and import shared helpers through the `@/` path alias defined in `tsconfig.json`. Name files with kebab-case (e.g., `auth-button.tsx`) and export components in PascalCase.

## Testing Guidelines
Automated tests are not yet configured. When contributing features, exercise the affected flows manually and document the steps in your PR. If you introduce a testing framework, colocate specs next to the implementation (e.g., `component.test.tsx`) and add the corresponding `pnpm` script so others can run it.

## Commit & Pull Request Guidelines
Keep commits focused and write imperative, descriptive messages similar to the existing history (e.g., `Refactor layout and home page structure`). For pull requests, include a concise summary, link related issues, list environment variables or migrations that changed, and attach screenshots or recordings when UI is affected. Confirm that `pnpm lint` passes and that any Supabase keys remain stored in `.env.local` rather than committed files.

## Security & Configuration Tips
Supabase clients expect `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`; define them in `.env.local` before running locally. Never share service-role keys in the repository. When adding new environment variables, document their purpose in the PR and update any onboarding notes.
