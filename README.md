# OpenCodex

An open-source alternative to OpenAI Codex for cloud-based software development environments. OpenCodex provides developers with isolated, containerized environments for coding, testing, and collaboration - all managed through an intuitive web interface.

## 🚀 Vision

OpenCodex aims to democratize access to cloud-based development environments by providing:

- **Multi-tenant environment management** - Create and manage isolated development containers
- **Flexible container configurations** - Support for multiple programming languages and runtime versions
- **GitHub integration** - Seamless connection to your repositories
- **Environment templating** - Reusable configurations for different project types
- **Admin dashboard** - Server management and container orchestration
- **Developer-friendly API** - Programmatic access to all functionality

## ✅ Completed Features

### Environment Management UI
- ✅ **Environment CRUD Operations** - Create, read, update, delete development environments
- ✅ **Multi-language Support** - Configure Python, Node.js, Ruby, Rust, Go, Bun, PHP, Java, and Swift versions
- ✅ **Container Configuration** - Choose from Universal, Node, or Python base images
- ✅ **Environment Variables & Secrets** - Secure configuration management
- ✅ **Setup Scripts** - Automatic or manual environment initialization
- ✅ **GitHub Repository Integration** - Connect environments to specific repos
- ✅ **Bulk Operations** - Multi-select and batch edit environments
- ✅ **Advanced Filtering & Search** - Find environments quickly with powerful filters
- ✅ **Responsive Design** - Works seamlessly on desktop and mobile

### Backend Infrastructure
- ✅ **Supabase Integration** - PostgreSQL database with real-time subscriptions
- ✅ **Type-safe API** - Full TypeScript support with Zod validation
- ✅ **Server Actions** - Next.js 14 App Router with server-side mutations
- ✅ **Data Validation** - Comprehensive input validation and error handling
- ✅ **Authentication Ready** - Supabase Auth integration prepared

### Developer Experience
- ✅ **Modern Tech Stack** - Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- ✅ **Component Library** - Reusable UI components with consistent design
- ✅ **Form Management** - Complex forms with validation and error states
- ✅ **Toast Notifications** - User feedback for all operations
- ✅ **Loading States** - Proper UX during async operations

## 🛣️ Roadmap

### Phase 1: Container Runtime (In Progress)
- [ ] **Docker Integration** - Container creation and management
- [ ] **Runtime API** - RESTful API for container operations
- [ ] **Container Lifecycle** - Start, stop, restart, destroy containers
- [ ] **Resource Limits** - CPU, memory, and storage constraints
- [ ] **Port Management** - Dynamic port allocation and forwarding
- [ ] **File System Access** - Volume mounting and persistence
- [ ] **Network Isolation** - Secure container networking

### Phase 2: Admin Dashboard
- [ ] **Server Monitoring** - Real-time server metrics and health
- [ ] **Container Analytics** - Usage statistics and performance data
- [ ] **User Management** - Multi-tenant user administration
- [ ] **Resource Allocation** - Server capacity planning and limits
- [ ] **Audit Logging** - Complete activity tracking
- [ ] **Backup & Recovery** - Environment and data protection
- [ ] **Cost Tracking** - Resource usage and billing insights

### Phase 3: Developer Tools
- [ ] **Web-based IDE** - Browser-based code editor
- [ ] **Terminal Access** - WebSocket-based terminal sessions
- [ ] **File Browser** - GUI for container file management
- [ ] **Git Integration** - Clone, commit, push from the UI
- [ ] **Package Manager UI** - Visual dependency management
- [ ] **Environment Sharing** - Share environments with team members
- [ ] **Snapshots** - Save and restore environment states

### Phase 4: Advanced Features
- [ ] **CI/CD Integration** - GitHub Actions and pipeline support
- [ ] **Template Marketplace** - Community-shared environment templates
- [ ] **VS Code Extension** - Native IDE integration
- [ ] **CLI Tool** - Command-line interface for power users
- [ ] **API Webhooks** - Event-driven integrations
- [ ] **Custom Domains** - Branded environment URLs
- [ ] **SSL/TLS Termination** - Automatic certificate management

### Phase 5: Enterprise Features
- [ ] **SSO Integration** - SAML, OIDC, and enterprise auth
- [ ] **RBAC** - Role-based access control
- [ ] **Compliance** - SOC2, GDPR, HIPAA readiness
- [ ] **High Availability** - Multi-region deployment
- [ ] **Auto-scaling** - Dynamic resource scaling
- [ ] **Custom Branding** - White-label deployment options
- [ ] **Advanced Analytics** - Business intelligence and reporting

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App  │    │   Supabase      │    │  Container      │
│   (Frontend)    │◄──►│   (Database)    │    │  Runtime        │
│                 │    │                 │    │  (Docker)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Admin Panel   │    │   Auth System   │    │   File Storage  │
│   (Management)  │    │   (Supabase)    │    │   (Volumes)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Docker and Docker Compose
- Supabase account (or self-hosted instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/opencodex.git
   cd opencodex
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up the database**
   ```bash
   # Run the SQL migrations in your Supabase dashboard
   # See /database/migrations/ for schema files
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Validation**: Zod
- **Forms**: React Hook Form
- **State Management**: React Context + Server State
- **Container Runtime**: Docker (planned)
- **Deployment**: Vercel, Docker, Kubernetes

## 📁 Project Structure

```
src/
├── app/
│   ├── chat/                 # Chat interface (planned)
│   └── environment/          # Environment management
│       ├── _components/      # Environment-specific components
│       ├── _lib/            # Business logic and data access
│       └── [id]/            # Dynamic environment pages
├── components/
│   ├── ui/                  # Base UI components (shadcn/ui)
│   └── data-table/          # Reusable data table components
└── lib/
    ├── supabase/            # Database client configuration
    └── utils.ts             # Utility functions
```

## 🤝 Contributing

We welcome contributions!

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Write tests for new functionality
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by OpenAI Codex and similar cloud development platforms
- Built with amazing open-source tools and libraries
- Thanks to all contributors and the developer community

**Star ⭐ this repository if you find it helpful!**
