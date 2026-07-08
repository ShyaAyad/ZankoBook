# ZankoBook

A learning and course management system. ZankoBook lets lecturers manage course materials, grades, attendance, and assignment deadlines, while students access materials, submit assignments, and track their own academic progress.

This repository contains the frontend for ZankoBook, one of the modules under the broader Zankolink platform (alongside e-Zanko and Zankoline).

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Shadcn/ui, TanStack Query, React Router DOM, Zustand
- **Backend:** Laravel (REST API), Laravel Sanctum for authentication
- **Database:** MySQL
- **API testing:** Hoppscotch
- **Task tracking:** Jira

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Setup

```bash
git clone https://github.com/ShyaAyad/ZankoBook
cd zankobook
npm install
cp .env.example .env
```

Fill in `.env` with the required values (see `.env.example` for the full list).

### Running locally

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Building for production

```bash
npm run build
```

Output is generated in the `dist/` folder.

## Project Structure

```
src/
├── api/              # functions that call backend endpoints
├── components/
│   ├── ui/            # Shadcn generated components (do not edit manually)
│   └── common/         # shared custom components
├── layouts/           # AppLayout, AuthLayout
├── pages/             # one folder per route
├── store/             # Zustand stores
├── types/              # shared TypeScript types
├── lib/                 # axios instance, query client, utilities
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for branching strategy, commit conventions, and PR rules before opening any pull request.

## Roles in the System

| Role       | Scope                                                                                   |
|------------|------------------------------------------------------------------------------------------|
| Lecturer   | Uploads course materials, tracks grades and attendance, sets assignment deadlines, submits requests to their department |
| Student    | Accesses course materials, uploads assignments, views their own grades and attendance    |

## License

Internal academic/internship project — not licensed for external use.
