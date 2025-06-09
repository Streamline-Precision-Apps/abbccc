---
applyTo: "**/*.ts"
---

Coding standards, domain knowledge, and preferences that AI should follow.

# 🧅 Clean Architecture Quick Reference (Next.js 14 Functional Style)

Copy and paste this for future reference:

## The Four Layers (Dependencies flow INWARD):

### 1. 🔵 DOMAIN (Entities & Business Logic)

- **Purpose**: Business objects, types, and pure functions
- **Dependencies**: None (completely independent)
- **Contains**: TypeScript types, interfaces, business rules
- **Examples**: `User`, `Equipment`, validation functions

### 2. 🟢 APPLICATION (Use Cases)

- **Purpose**: Business workflows as pure functions
- **Dependencies**: Only depends on Domain
- **Contains**: Function-based use cases that take repositories as params
- **Examples**: `createUser(repo, userData)`, `updateEquipment(repo, id, data)`

### 3. 🟡 API & UI (Interface Layer)

- **Purpose**: Next.js API routes and React components
- **Dependencies**: Depends on Application (use cases)
- **Contains**: API route handlers, React components with hooks
- **Examples**: `app/api/users/route.ts`, React components with `useEffect`

### 4. 🔴 INFRASTRUCTURE (External Concerns)

- **Purpose**: Database implementations, external services
- **Dependencies**: Implements Domain interfaces
- **Contains**: Repository implementations, API clients
- **Examples**: Prisma implementations, email services

## 🔄 Key Principles (Functional Style):

### Functional Use Cases 🎯

```typescript
// Use cases are pure functions that take repository as parameter
export const createUser = async (
  repo: UserRepository,
  userData: CreateUserData
) => {
  // Validation
  if (!isValidEmail(userData.email)) {
    throw new Error("Invalid email");
  }

  // Business logic
  const existingUser = await repo.findByEmail(userData.email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Execute
  return await repo.create(userData);
};
```

### Repository Pattern 🗄️

```typescript
// Domain defines the interface
export interface UserRepository {
  findByEmail: (email: string) => Promise<User | null>;
  create: (userData: CreateUserData) => Promise<User>;
}

// Infrastructure implements it
export const UserRepositoryImpl: UserRepository = {
  findByEmail: async (email) => {
    return await prisma.user.findUnique({ where: { email } });
  },
  create: async (userData) => {
    return await prisma.user.create({ data: userData });
  },
};
```

### React Integration 📱

```typescript
// Use in API routes
export async function POST(req: Request) {
  const userData = await req.json();
  const user = await createUser(UserRepositoryImpl, userData);
  return NextResponse.json(user);
}

// Use in React components
const [users, setUsers] = useState([]);
useEffect(() => {
  getUsers(UserRepositoryImpl).then(setUsers);
}, []);
```

## 📁 Next.js 14 Folder Structure:

```
src/
├── domain/
│   ├── entities/          # TypeScript types & interfaces
│   │   ├── User.ts
│   │   ├── Equipment.ts
│   │   └── index.ts
│   └── repositories/      # Repository interfaces
│       ├── UserRepository.ts
│       ├── EquipmentRepository.ts
│       └── index.ts
├── application/
│   └── useCases/          # Pure functions for business logic
│       ├── createUser.ts
│       ├── getUsers.ts
│       ├── updateEquipment.ts
│       └── index.ts
├── infrastructure/
│   └── repositories/      # Concrete implementations
│       ├── UserRepositoryImpl.ts
│       ├── EquipmentRepositoryImpl.ts
│       └── index.ts
├── app/                   # Next.js 14 App Router
│   ├── api/               # API routes using use cases
│   │   ├── users/
│   │   └── equipment/
│   └── (routes)/          # Pages
├── components/            # React components (presentation only)
└── lib/                   # Utilities and shared code
```

## 🎯 Benefits Checklist:

- ✅ Easy to test (mockable interfaces)
- ✅ Easy to maintain (clear boundaries)
- ✅ Framework independent (swap Next.js for anything)
- ✅ Database independent (swap Prisma for anything)
- ✅ External service independent
- ✅ Postpone technology decisions
- ✅ Team collaboration (clear ownership)

## 🚨 Remember:

- Dependencies flow INWARD only
- Inner layers define interfaces, outer layers implement them
- Business logic stays in the center
- UI and external concerns stay on the outside
- Use dependency injection everywhere

## 📝 Implementation Pattern:

1. Start with Entities (domain models)
2. Create Use Cases (business workflows)
3. Build Controllers (API/UI handlers)
4. Implement Infrastructure (databases, services)
5. Wire everything together with DI

---

_"The architecture should scream the intent of the system, not the frameworks used."_ - Uncle Bob

# Clean Architecture Migration Guide for Next.js 14
