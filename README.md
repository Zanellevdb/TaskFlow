# TaskFlow

**A full-stack project and task management application.**

TaskFlow is a web application designed to help users organise workspaces, manage projects, create and track tasks, and collaborate through shared workspaces.

The project is being developed with a focus on maintainable architecture, secure authentication, reliable data management, and a clean user experience.

## Project Status

**Active development — not yet production-ready.**

The backend foundation is implemented, and frontend development is underway. Security hardening, additional frontend functionality, testing, and deployment preparation remain in progress.

### Implemented functionality

- User registration and login
- JWT-based authentication
- Access-token refresh
- Authenticated user profile
- Workspace creation and management
- Workspace access and authorisation
- Project creation and management
- Task creation and management
- Task labels
- Task comments
- Request validation using Zod
- Centralised API error handling
- PostgreSQL database integration
- Prisma ORM
- API integration tests

### Frontend development

The React frontend is being connected to the backend API.

Current frontend work includes:

- Authentication state management
- Workspace interface
- Project interface
- Task list and task creation
- API integration
- Zustand state management

Further interface development and testing are still required.

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Zustand
- Axios

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)
- Zod
- Winston

### Development and tooling
- npm workspaces
- Docker
- Jest
- Supertest
- Vitest
- ESLint
- Prettier
- GitHub

## Project Structure

```text
TaskFlow/
│
├── packages/
│   ├── api/
│   │   ├── prisma/
│   │   └── src/
│   │       ├── config/
│   │       ├── db/
│   │       ├── middlewares/
│   │       ├── modules/
│   │       │   ├── auth/
│   │       │   ├── workspace/
│   │       │   ├── project/
│   │       │   ├── task/
│   │       │   ├── task-label/
│   │       │   └── comment/
│   │       ├── tests/
│   │       └── utils/
│   │
│   └── web/
│       └── src/
│           ├── api/
│           ├── components/
│           ├── store/
│           └──
│
├── docker-compose.dev.yml
├── package.json
└── README.md
```

## Getting Started

### Requirements

- Node.js
- npm
- Docker Desktop
- PostgreSQL (or the included Docker development database)

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd TaskFlow
```

Install dependencies from the project root:

```bash
npm install
```

### Database

Start the development PostgreSQL database:

```bash
npm run docker:up
```

Configure the API environment variables in the API environment file.

Required configuration includes:

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
API_HOST=0.0.0.0
API_PORT=3000
LOG_LEVEL=info
```

Use strong, unique secrets for JWT authentication. Never commit real credentials or secret values to GitHub.

Run database migrations:

```bash
npm run db:migrate --workspace=@taskflow/api
```

### Running the application

Start the development services:

```bash
npm run dev
```

Build the application:

```bash
npm run build
```

### Running tests

Run the API tests:

```bash
npm run test --workspace=@taskflow/api
```

Run the frontend tests:

```bash
npm run test --workspace=@taskflow/web
```

Run the API TypeScript build:

```bash
npm run build --workspace=@taskflow/api
```

## Security

Security is an ongoing development priority.

Current security measures and work include:

- JWT-based authentication
- Password hashing with bcrypt
- Request validation
- Authenticated API routes
- Workspace-level authorisation
- Centralised error handling
- API rate limiting using `express-rate-limit`
- Separate rate limits for login, registration, and token refresh
- GitHub CodeQL security analysis

Further security reviews and hardening are in progress. The application has not yet undergone a complete production security audit.

## Testing

The API test suite currently includes authentication, workspace, project, task, label, comment, and middleware tests.

The latest recorded API test result:

**7 test suites passed — 82 tests passed.**

The frontend production build has also previously completed successfully. Testing and validation will continue as development progresses.

## Development Roadmap

Planned development includes:

- Complete frontend functionality
- Improve authentication and session security
- Complete workspace member management
- Add task editing and deletion interfaces
- Improve project and workspace management interfaces
- Integrate comments and task labels into the frontend
- Expand frontend automated tests
- Review and resolve outstanding CodeQL security alerts
- Review dependencies and vulnerabilities
- Improve application documentation
- Prepare production deployment
- Complete privacy, legal, and compliance requirements

## Development Philosophy

TaskFlow is being developed incrementally, with an emphasis on:

- Clean and maintainable code
- Clear separation of frontend and backend responsibilities
- Secure handling of user information
- Reliable database operations
- Automated testing
- Practical and user-friendly functionality

## Licence

No open-source licence has currently been granted. All rights are reserved unless otherwise stated.

---

**TaskFlow — Building a better way to organise work.**
