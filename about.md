# AI Agent Development Prompts
## Business Diagnostics Platform - Complete Backend & Frontend Prompts

---

# 🔷 PROMPT 1: BACKEND DEVELOPMENT (NestJS + Prisma + PostgreSQL)

```
I need you to build the complete backend for a Business Diagnostics Platform. This is an enterprise-level application for business consulting, diagnostics tests, and management.

## TECHNOLOGY STACK:
- NestJS 
- Prisma ORM 
- PostgreSQL 16
- JWT Authentication with Passport.js
- bcrypt for password hashing
- class-validator and class-transformer for validation
- Exception filters and global guards

## PROJECT STRUCTURE:
Create the backend with this exact structure:

```
apps/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   └── configuration.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── interceptors/
│   │       └── transform.interceptor.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── signup.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwt-refresh.strategy.ts
│   │   └── guards/
│   │       ├── jwt-auth.guard.ts
│   │       └── roles.guard.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       └── update-user.dto.ts
│   ├── tests/
│   │   ├── tests.module.ts
│   │   ├── tests.controller.ts
│   │   ├── tests.service.ts
│   │   └── dto/
│   │       ├── create-test.dto.ts
│   │       ├── update-test.dto.ts
│   │       └── submit-test.dto.ts
│   ├── blog/
│   │   ├── blog.module.ts
│   │   ├── blog.controller.ts
│   │   ├── blog.service.ts
│   │   └── dto/
│   │       ├── create-blog.dto.ts
│   │       └── update-blog.dto.ts
│   ├── cases/
│   │   ├── cases.module.ts
│   │   ├── cases.controller.ts
│   │   ├── cases.service.ts
│   │   └── dto/
│   │       ├── create-case.dto.ts
│   │       └── update-case.dto.ts
│   └── applications/
│       ├── applications.module.ts
│       ├── applications.controller.ts
│       ├── applications.service.ts
│       └── dto/
│           ├── create-application.dto.ts
│           └── update-application.dto.ts
```

## PRISMA SCHEMA:

Create this complete Prisma schema in `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ENUMS
// ============================================

enum Role {
  USER
  ADMIN
}

enum ApplicationStatus {
  PENDING
  CONTACTED
  COMPLETED
  REJECTED
}

enum BlogStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

// ============================================
// USER MANAGEMENT
// ============================================

model User {
  id        String   @id @default(uuid())
  fullName  String   @map("full_name")
  phone     String   @unique
  password  String
  address   String?
  role      Role     @default(USER)
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  testResults TestResult[]
  refreshTokens RefreshToken[]
  
  @@map("users")
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String   @map("user_id")
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("refresh_tokens")
}

// ============================================
// APPLICATION FORMS
// ============================================

model Application {
  id          String            @id @default(uuid())
  fullName    String            @map("full_name")
  phone       String
  companyName String?           @map("company_name")
  message     String?
  status      ApplicationStatus @default(PENDING)
  
  createdAt   DateTime @default(now()) @map("created_at")
  
  @@map("applications")
}

// ============================================
// DIAGNOSTICS / TESTS
// ============================================

model Test {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  description String?
  isActive    Boolean  @default(true) @map("is_active")
  
  questions    Question[]
  resultLogic  ResultLogic[]
  testResults  TestResult[]
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  @@map("tests")
}

model Question {
  id       String   @id @default(uuid())
  testId   String   @map("test_id")
  text     String
  order    Int
  
  options  Option[]
  
  test     Test     @relation(fields: [testId], references: [id], onDelete: Cascade)
  
  @@map("questions")
}

model Option {
  id         String   @id @default(uuid())
  questionId String   @map("question_id")
  text       String
  score      Int
  order      Int
  
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  
  @@map("options")
}

model ResultLogic {
  id             String  @id @default(uuid())
  testId         String  @map("test_id")
  minScore       Int     @map("min_score")
  maxScore       Int     @map("max_score")
  resultText     String  @map("result_text") @db.Text
  recommendation String  @db.Text
  
  test           Test    @relation(fields: [testId], references: [id], onDelete: Cascade)
  
  @@map("result_logic")
}

model TestResult {
  id             String   @id @default(uuid())
  userId         String   @map("user_id")
  testId         String   @map("test_id")
  score          Int
  resultText     String   @map("result_text") @db.Text
  recommendation String   @db.Text
  answers        Json
  
  createdAt      DateTime @default(now()) @map("created_at")
  
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  test           Test     @relation(fields: [testId], references: [id], onDelete: Cascade)
  
  @@map("test_results")
}

// ============================================
// BLOG / CONTENT
// ============================================

model BlogPost {
  id        String     @id @default(uuid())
  title     String
  slug      String     @unique
  image     String?
  content   String     @db.Text
  status    BlogStatus @default(DRAFT)
  
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")
  
  @@map("blog_posts")
}

// ============================================
// BUSINESS CASES
// ============================================

model BusinessCase {
  id       String   @id @default(uuid())
  title    String
  problem  String   @db.Text
  solution String   @db.Text
  result   String   @db.Text
  date     DateTime
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@map("business_cases")
}
```

## REQUIRED API ENDPOINTS:

### Authentication Module (`/api/auth`)
- POST `/auth/signup` - User registration
  - Body: { fullName, phone, password }
  - Response: { user, accessToken, refreshToken }
  
- POST `/auth/login` - User login
  - Body: { phone, password }
  - Response: { user, accessToken, refreshToken }
  
- POST `/auth/refresh` - Refresh access token
  - Body: { refreshToken }
  - Response: { accessToken, refreshToken }
  
- POST `/auth/logout` - Logout user
  - Headers: Authorization Bearer token
  - Response: { message }
  
- GET `/auth/me` - Get current user
  - Headers: Authorization Bearer token
  - Response: { user }

### Users Module (`/api/users`)
- GET `/users/me` - Get my profile [Protected]
- PUT `/users/me` - Update my profile [Protected]
- GET `/users/me/results` - Get my test results [Protected]

### Admin Users Routes (`/api/admin/users`)
- GET `/admin/users` - Get all users [Admin only]
- GET `/admin/users/:id` - Get user details [Admin only]
- GET `/admin/users/:id/results` - Get user test results [Admin only]
- DELETE `/admin/users/:id` - Delete user [Admin only]

### Tests Module (`/api/tests`)
- GET `/tests` - Get all active tests [Public]
- GET `/tests/:slug` - Get test details with questions [Public]
- POST `/tests/:slug/submit` - Submit test answers [Protected]
  - Body: { answers: [{ questionId, optionId }] }
  - Response: { score, resultText, recommendation }

### Admin Tests Routes (`/api/admin/tests`)
- POST `/admin/tests` - Create new test [Admin only]
  - Body: { title, description, questions: [{ text, options: [{ text, score }] }], resultLogic: [{ minScore, maxScore, resultText, recommendation }] }
  
- PUT `/admin/tests/:id` - Update test [Admin only]
- DELETE `/admin/tests/:id` - Delete test [Admin only]
- PUT `/admin/tests/:id/toggle-active` - Activate/deactivate test [Admin only]

### Blog Module (`/api/blog`)
- GET `/blog` - Get all published blog posts [Public]
  - Query params: ?page=1&limit=10&status=PUBLISHED
  
- GET `/blog/:slug` - Get blog post details [Public]

### Admin Blog Routes (`/api/admin/blog`)
- POST `/admin/blog` - Create blog post [Admin only]
- PUT `/admin/blog/:id` - Update blog post [Admin only]
- DELETE `/admin/blog/:id` - Delete blog post [Admin only]
- PUT `/admin/blog/:id/publish` - Publish blog post [Admin only]

### Cases Module (`/api/cases`)
- GET `/cases` - Get all business cases [Public]

### Admin Cases Routes (`/api/admin/cases`)
- POST `/admin/cases` - Create case [Admin only]
- PUT `/admin/cases/:id` - Update case [Admin only]
- DELETE `/admin/cases/:id` - Delete case [Admin only]

### Applications Module (`/api/applications`)
- POST `/applications` - Submit application form [Public]
  - Body: { fullName, phone, companyName?, message? }

### Admin Applications Routes (`/api/admin/applications`)
- GET `/admin/applications` - Get all applications [Admin only]
- GET `/admin/applications/:id` - Get application details [Admin only]
- PUT `/admin/applications/:id/status` - Update application status [Admin only]
- DELETE `/admin/applications/:id` - Delete application [Admin only]

## CRITICAL IMPLEMENTATION REQUIREMENTS:

### 1. Authentication & Security:
- Implement JWT with access token (15 minutes expiry)
- Implement refresh token (7 days expiry) stored in database
- Hash passwords with bcrypt (salt rounds: 10)
- Create JWT Strategy using Passport
- Create Refresh Token Strategy
- Create JwtAuthGuard for protected routes
- Create RolesGuard for admin-only routes
- Create @Public() decorator to bypass auth guards
- Create @Roles(Role.ADMIN) decorator for role-based access

### 2. Validation:
- Use class-validator decorators in all DTOs
- Validate phone format: +998XXXXXXXXX (Uzbekistan format)
- Validate password minimum 8 characters
- Transform and sanitize all inputs

### 3. Error Handling:
- Create global exception filter
- Return consistent error responses:
  ```typescript
  {
    statusCode: number,
    message: string | string[],
    error: string,
    timestamp: string,
    path: string
  }
  ```
- Handle Prisma errors (unique constraint, not found, etc.)

### 4. Response Transform:
- Create response interceptor to standardize success responses:
  ```typescript
  {
    success: true,
    data: any,
    message?: string,
    meta?: { page, limit, total }
  }
  ```

### 5. Test Submission Logic:
- Calculate total score by summing selected option scores
- Find appropriate result based on score range (minScore <= score <= maxScore)
- Save test result with userId, testId, score, resultText, recommendation, and answers JSON
- Return calculated result immediately

### 6. Configuration:
- Use @nestjs/config for environment variables
- Create configuration.ts with typed config object
- Required env variables:
  ```
  DATABASE_URL
  JWT_SECRET
  JWT_REFRESH_SECRET
  JWT_EXPIRES_IN=15m
  JWT_REFRESH_EXPIRES_IN=7d
  PORT=3000
  CORS_ORIGIN=http://localhost:4200
  ```

### 7. Prisma Service:
- Create PrismaService extending PrismaClient
- Implement enableShutdownHooks
- Enable query logging in development
- Handle connection errors gracefully

### 8. Main.ts Setup:
- Enable CORS with credentials
- Apply global validation pipe with transform: true
- Apply global exception filter
- Set global prefix '/api'
- Enable Swagger documentation (optional)

### 9. Slug Generation:
- Auto-generate slugs from titles (lowercase, replace spaces with hyphens)
- Ensure slug uniqueness in database

### 10. Pagination:
- Implement pagination for list endpoints
- Default: page=1, limit=10
- Return meta with total count

## ADDITIONAL FEATURES TO IMPLEMENT:

1. **Admin Seed Data**: Create a script to seed initial admin user:
   - Phone: +998901234567
   - Password: Admin123!
   - Role: ADMIN

2. **Soft Delete**: Implement soft delete for critical entities (optional)

3. **Logging**: Add Winston or Pino logger

4. **Rate Limiting**: Add rate limiting for public endpoints

5. **Request Validation**: Validate all UUIDs, check if resources exist before operations

## CODE QUALITY REQUIREMENTS:

- Use async/await consistently
- Handle all promises with proper error handling
- Use TypeScript strict mode
- Add JSDoc comments for complex functions
- Follow NestJS best practices and conventions
- Use dependency injection properly
- Keep controllers thin, business logic in services
- Use Prisma transactions where needed (test submission, complex operations)

## TESTING REQUIREMENTS:

- Write unit tests for services using Jest
- Mock Prisma Client in tests
- Test authentication flows
- Test authorization (admin vs user)
- Test validation logic
- Test test submission calculation logic

## DELIVERABLES:

Please provide:
1. Complete working code for all modules
2. All DTOs with proper validation
3. All guards, strategies, decorators
4. Prisma schema and migration files
5. Seed script for admin user
6. README with setup instructions
7. Environment variables template (.env.example)

Start with the core modules (Prisma, Auth, Users) and then proceed to feature modules (Tests, Blog, Cases, Applications). Make sure everything is production-ready with proper error handling, validation, and security.
```

---

# 🔷 PROMPT 2: FRONTEND - ADMIN DASHBOARD (Angular 21 + NG-ZORRO)

```
I need you to build a complete Admin Dashboard for a Business Diagnostics Platform using the latest Angular 21 (Zoneless with Signals) and NG-ZORRO UI library.

## TECHNOLOGY STACK:
- Angular 21 (Zoneless, using Signals for state management)
- TypeScript
- NG-ZORRO (Ant Design for Angular)
- Tailwind CSS
- Standalone Components (no NgModules)
- Reactive Forms
- HttpClient with Interceptors
- RxJS where necessary

## PROJECT LOCATION:
- App: `apps/admin-dashboard/`
- Shared Libraries: `libs/shared/`

## APPLICATION STRUCTURE:

```
apps/admin-dashboard/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── layouts/
│   │   │   └── admin-layout/
│   │   │       └── admin-layout.component.ts
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   │   └── login.component.ts
│   │   │   ├── dashboard/
│   │   │   │   └── dashboard.component.ts
│   │   │   ├── users/
│   │   │   │   ├── users-list.component.ts
│   │   │   │   └── user-detail.component.ts
│   │   │   ├── tests/
│   │   │   │   ├── tests-list.component.ts
│   │   │   │   ├── test-create.component.ts
│   │   │   │   └── test-edit.component.ts
│   │   │   ├── blog/
│   │   │   │   ├── blog-list.component.ts
│   │   │   │   ├── blog-create.component.ts
│   │   │   │   └── blog-edit.component.ts
│   │   │   ├── cases/
│   │   │   │   ├── cases-list.component.ts
│   │   │   │   ├── case-create.component.ts
│   │   │   │   └── case-edit.component.ts
│   │   │   └── applications/
│   │   │       ├── applications-list.component.ts
│   │   │       └── application-detail.component.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── admin.guard.ts
│   │   └── components/
│   │       ├── header/
│   │       │   └── header.component.ts
│   │       └── sidebar/
│   │           └── sidebar.component.ts
│   ├── main.ts
│   └── styles.scss
│
libs/shared/
├── data-access/
│   └── src/
│       └── lib/
│           ├── services/
│           │   ├── auth.service.ts
│           │   ├── users.service.ts
│           │   ├── tests.service.ts
│           │   ├── blog.service.ts
│           │   ├── cases.service.ts
│           │   └── applications.service.ts
│           ├── stores/
│           │   └── auth.store.ts
│           └── interceptors/
│               ├── auth.interceptor.ts
│               └── error.interceptor.ts
│
├── models/
│   └── src/
│       └── lib/
│           ├── user.model.ts
│           ├── test.model.ts
│           ├── blog.model.ts
│           ├── case.model.ts
│           └── application.model.ts
│
└── ui/
    └── src/
        └── lib/
            └── components/
                ├── data-table/
                │   └── data-table.component.ts
                └── page-header/
                    └── page-header.component.ts
```

## REQUIRED FEATURES & PAGES:

### 1. Login Page (`/login`)
- Responsive login form
- Fields: phone (+998XXXXXXXXX format), password
- Form validation
- Error handling
- Remember me option (optional)
- Redirect to dashboard on success
- Store tokens in localStorage

### 2. Admin Layout (Main Shell)
- **Sidebar Navigation** with menu items:
  - Dashboard
  - Users Management
  - Tests Management
  - Blog Management
  - Business Cases
  - Applications
  - Logout
- **Header** with:
  - Platform title/logo
  - Admin profile dropdown
  - Logout button
- Responsive design (collapsible sidebar on mobile)
- Active route highlighting

### 3. Dashboard Page (`/dashboard`)
- Statistics cards:
  - Total Users
  - Total Tests
  - Active Tests
  - Pending Applications
  - Published Blog Posts
  - Total Business Cases
- Recent applications table
- Recent test submissions
- Charts (optional): User growth, test completion rates

### 4. Users Management (`/users`)

**Users List Page:**
- NG-ZORRO Table with:
  - Columns: Full Name, Phone, Role, Created Date, Actions
  - Pagination (10, 20, 50 per page)
  - Search by name or phone
  - Filter by role (USER, ADMIN)
  - Sort by date, name
- Actions:
  - View Details (navigate to detail page)
  - Delete user (with confirmation modal)
- "Add User" button (optional)

**User Detail Page (`/users/:id`):**
- Display user information
- List of completed tests with results
- Delete user option

### 5. Tests Management (`/tests`)

**Tests List Page:**
- NG-ZORRO Table with:
  - Columns: Title, Questions Count, Status (Active/Inactive), Created Date, Actions
  - Pagination
  - Search by title
  - Filter by status
- Actions:
  - Edit Test
  - Toggle Active/Inactive
  - Delete Test (with confirmation)
- "Create New Test" button

**Test Create/Edit Page:**
This is the MOST COMPLEX form. Implement carefully:

- **Basic Information Section:**
  - Title (required)
  - Description (textarea)
  - Status toggle (Active/Inactive)

- **Questions Section (Dynamic Form Array):**
  - Add/Remove Questions buttons
  - For each question:
    - Question text (required)
    - Order number (auto-calculated)
    - **Options Sub-section (Nested Form Array):**
      - Add/Remove Options buttons
      - For each option:
        - Option text (required)
        - Score (number input, required)
        - Order number (auto-calculated)
    - Minimum 2 options per question
  - Display questions in cards or accordion

- **Result Logic Section (Dynamic Form Array):**
  - Add/Remove Result Ranges buttons
  - For each result range:
    - Min Score (number, required)
    - Max Score (number, required)
    - Result Text (textarea, required)
    - Recommendation (textarea, required)
  - Validate: no overlapping score ranges
  - Sort by min score automatically

- **Form Validation:**
  - Validate all required fields
  - Ensure at least 1 question exists
  - Ensure each question has at least 2 options
  - Ensure at least 1 result logic exists
  - Validate score ranges don't overlap

- **Save Functionality:**
  - Save button disabled until form is valid
  - Show loading spinner during save
  - Success notification
  - Navigate back to list on success
  - Error handling

### 6. Blog Management (`/blog`)

**Blog List Page:**
- NG-ZORRO Table with:
  - Columns: Title, Status (Draft/Published/Archived), Created Date, Updated Date, Actions
  - Pagination
  - Search by title
  - Filter by status
- Actions:
  - Edit Post
  - Publish/Unpublish toggle
  - Delete Post
- "Create New Post" button

**Blog Create/Edit Page:**
- Title (required)
- Slug (auto-generated from title, editable)
- Image URL or upload (optional)
- Content (rich text editor using NG-ZORRO nz-editor or quill)
- Status dropdown (Draft, Published, Archived)
- Save button
- Preview option

### 7. Business Cases Management (`/cases`)

**Cases List Page:**
- NG-ZORRO Table or Card Grid
- Columns/Fields: Title, Date, Actions
- Pagination
- Search by title
- "Create New Case" button

**Case Create/Edit Page:**
- Title (required)
- Problem (textarea, required)
- Solution (textarea, required)
- Result (textarea, required)
- Date (date picker, required)
- Save button

### 8. Applications Management (`/applications`)

**Applications List Page:**
- NG-ZORRO Table with:
  - Columns: Full Name, Phone, Company Name, Status, Submitted Date, Actions
  - Pagination
  - Filter by status (Pending, Contacted, Completed, Rejected)
  - Sort by date
- Actions:
  - View Details
  - Update Status
  - Delete Application

**Application Detail Modal:**
- Display full application details
- Status dropdown to update
- Save status button
- Close modal

## CRITICAL IMPLEMENTATION REQUIREMENTS:

### 1. Angular 21 Zoneless Configuration:

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { authInterceptor } from '@shared/data-access';

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    // NG-ZORRO providers
  ]
});
```

### 2. Signals-based State Management:

Create `auth.store.ts` using Signals:

```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  // Signals
  private _user = signal<User | null>(null);
  private _loading = signal(false);
  private _accessToken = signal<string | null>(localStorage.getItem('accessToken'));
  private _refreshToken = signal<string | null>(localStorage.getItem('refreshToken'));
  
  // Computed signals
  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'ADMIN');
  
  // Methods
  setUser(user: User | null) {
    this._user.set(user);
  }
  
  setTokens(accessToken: string, refreshToken: string) {
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }
  
  clearAuth() {
    this._user.set(null);
    this._accessToken.set(null);
    this._refreshToken.set(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  
  getAccessToken() {
    return this._accessToken();
  }
}
```

### 3. Auth Interceptor:

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../stores/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.getAccessToken();
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
```

### 4. Route Guards:

```typescript
// auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@shared/data-access';

export const authGuard = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  
  if (authStore.isAuthenticated()) {
    return true;
  }
  
  return router.createUrlTree(['/login']);
};

// admin.guard.ts
export const adminGuard = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  
  if (authStore.isAdmin()) {
    return true;
  }
  
  return router.createUrlTree(['/login']);
};
```

### 5. Routes Configuration:

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users-list.component').then(m => m.UsersListComponent)
      },
      {
        path: 'users/:id',
        loadComponent: () => import('./pages/users/user-detail.component').then(m => m.UserDetailComponent)
      },
      {
        path: 'tests',
        loadComponent: () => import('./pages/tests/tests-list.component').then(m => m.TestsListComponent)
      },
      {
        path: 'tests/create',
        loadComponent: () => import('./pages/tests/test-create.component').then(m => m.TestCreateComponent)
      },
      {
        path: 'tests/:id/edit',
        loadComponent: () => import('./pages/tests/test-edit.component').then(m => m.TestEditComponent)
      },
      // ... other routes
    ]
  }
];
```

### 6. NG-ZORRO + Tailwind CSS:

- Use NG-ZORRO components for:
  - Layout (nz-layout, nz-sider, nz-header, nz-content)
  - Navigation (nz-menu)
  - Tables (nz-table) with pagination, sorting, filtering
  - Forms (nz-form, nz-form-item, nz-form-control)
  - Buttons (nz-button)
  - Modals (nz-modal)
  - Notifications (NzNotificationService)
  - Cards (nz-card)
  - Date Picker (nz-date-picker)
  - Select (nz-select)
  - Icons (nz-icon)

- Use Tailwind CSS for:
  - Custom spacing (p-4, m-4, etc.)
  - Grid layouts (grid, grid-cols-3, gap-4)
  - Flexbox utilities (flex, justify-between, items-center)
  - Custom colors and typography
  - Responsive breakpoints (md:, lg:, etc.)

### 7. Form Handling:

Use Reactive Forms with FormBuilder:

```typescript
// Example for Test Create/Edit
testForm = this.fb.group({
  title: ['', Validators.required],
  description: [''],
  questions: this.fb.array([]),
  resultLogic: this.fb.array([])
});

get questions() {
  return this.testForm.get('questions') as FormArray;
}

addQuestion() {
  const questionGroup = this.fb.group({
    text: ['', Validators.required],
    options: this.fb.array([
      this.createOption(),
      this.createOption()
    ])
  });
  this.questions.push(questionGroup);
}

createOption() {
  return this.fb.group({
    text: ['', Validators.required],
    score: [0, Validators.required]
  });
}
```

### 8. Error Handling & Notifications:

```typescript
import { NzNotificationService } from 'ng-zorro-antd/notification';

constructor(private notification: NzNotificationService) {}

showSuccess(message: string) {
  this.notification.success('Success', message);
}

showError(message: string) {
  this.notification.error('Error', message);
}
```

### 9. Loading States:

Use Signals for loading states:

```typescript
loading = signal(false);

async loadData() {
  this.loading.set(true);
  try {
    const data = await this.service.getData();
    // process data
  } catch (error) {
    this.showError('Failed to load data');
  } finally {
    this.loading.set(false);
  }
}
```

### 10. Services (in shared/data-access):

Create services for each module:

```typescript
// tests.service.ts
@Injectable({ providedIn: 'root' })
export class TestsService {
  private apiUrl = 'http://localhost:3000/api';
  
  constructor(private http: HttpClient) {}
  
  getTests() {
    return this.http.get<Test[]>(`${this.apiUrl}/admin/tests`);
  }
  
  getTest(id: string) {
    return this.http.get<Test>(`${this.apiUrl}/admin/tests/${id}`);
  }
  
  createTest(data: CreateTestDto) {
    return this.http.post<Test>(`${this.apiUrl}/admin/tests`, data);
  }
  
  updateTest(id: string, data: UpdateTestDto) {
    return this.http.put<Test>(`${this.apiUrl}/admin/tests/${id}`, data);
  }
  
  deleteTest(id: string) {
    return this.http.delete(`${this.apiUrl}/admin/tests/${id}`);
  }
  
  toggleActive(id: string) {
    return this.http.put(`${this.apiUrl}/admin/tests/${id}/toggle-active`, {});
  }
}
```

## UI/UX REQUIREMENTS:

1. **Responsive Design**: Works on desktop, tablet, and mobile
2. **Loading States**: Show spinners during API calls
3. **Empty States**: Show appropriate messages when no data
4. **Confirmation Dialogs**: Before destructive actions (delete)
5. **Form Validation Feedback**: Show error messages clearly
6. **Success/Error Notifications**: Toast notifications for actions
7. **Table Features**: Pagination, sorting, filtering, search
8. **Breadcrumbs**: Show current page location (optional)
9. **Action Buttons**: Clear CTAs with icons
10. **Consistent Spacing**: Use Tailwind spacing utilities

## CODE QUALITY REQUIREMENTS:

- Use standalone components (no NgModules)
- Use Signals for local state
- Use RxJS only when necessary (HTTP calls, complex async)
- Use async pipe in templates for observables
- Use @if and @for control flow syntax (Angular 17+)
- Type all variables and functions
- Handle all errors gracefully
- Clean up subscriptions (though async pipe handles this)
- Keep components focused and small
- Extract reusable logic to services

## TESTING:

- Write unit tests for services
- Write component tests for complex components
- Test form validation logic
- Test API error scenarios

## DELIVERABLES:

1. Complete working admin dashboard
2. All pages implemented with NG-ZORRO components
3. All CRUD operations functional
4. Proper error handling and loading states
5. Responsive design
6. Auth guards and interceptors
7. Shared services and stores
8. TypeScript interfaces for all models
9. README with setup and usage instructions

Start with the authentication flow (login, guards, interceptors), then layout and navigation, then implement pages one by one starting with simpler ones (Dashboard, Users, Applications) before moving to complex forms (Tests Management).

Make sure the Test Create/Edit form is particularly robust with proper validation and user experience.
```

---

# 🔷 PROMPT 3: FRONTEND - USER PROFILE AREA (Angular 21)

```
I need you to build a User Profile area for the Business Diagnostics Platform. This is where authenticated users can view their profile, take tests, and see their test results.

## TECHNOLOGY STACK:
- Angular 21 (Zoneless, Signals)
- NG-ZORRO UI library
- Tailwind CSS
- Standalone Components
- Shared services from `libs/shared/data-access`

## PROJECT LOCATION:
- App: `apps/user-profile/`
- Shares services from: `libs/shared/data-access`

## APPLICATION STRUCTURE:

```
apps/user-profile/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── layouts/
│   │   │   └── profile-layout/
│   │   │       └── profile-layout.component.ts
│   │   ├── pages/
│   │   │   ├── profile/
│   │   │   │   └── profile.component.ts
│   │   │   ├── tests/
│   │   │   │   ├── tests-list.component.ts
│   │   │   │   ├── test-take.component.ts
│   │   │   │   └── test-result.component.ts
│   │   │   └── results/
│   │   │       └── results-list.component.ts
│   │   └── guards/
│   │       └── auth.guard.ts
│   ├── main.ts
│   └── styles.scss
```

## REQUIRED FEATURES:

### 1. Profile Layout
- **Sidebar Menu:**
  - My Profile
  - Available Tests
  - My Results
  - Logout
- Responsive design

### 2. My Profile Page (`/profile`)
- Display user information (read-only initially)
- Edit mode toggle button
- **Editable Fields:**
  - Full Name
  - Phone (display only, cannot edit)
  - Address
- Save button (only in edit mode)
- Cancel button to revert changes

### 3. Available Tests Page (`/tests`)
- Card grid showing all active tests
- Each card displays:
  - Test title
  - Description
  - Number of questions
  - "Take Test" button
- Filter/search by title
- Responsive grid (3 columns on desktop, 2 on tablet, 1 on mobile)

### 4. Test Taking Page (`/tests/:slug`)
- Display test title and description
- Progress indicator (Question X of Y)
- Show one question at a time with all options
- **Radio buttons** for option selection
- Previous/Next buttons for navigation
- Submit button on last question
- Confirmation modal before submit
- **Calculate score on frontend** (sum of selected option scores)
- Send answers to backend for verification and storage
- Display result immediately after submission
- Option to view detailed results

### 5. Test Result Page (after submission or `/tests/:slug/result`)
- Display:
  - Total score
  - Result text (from result logic)
  - Recommendations
  - Date taken
- "Back to Tests" button
- "View All Results" button

### 6. My Results Page (`/results`)
- Table or card list of all completed tests
- Columns: Test Name, Score, Date Taken, Actions
- Action: "View Result" button
- Pagination if many results
- Sort by date (newest first)

## IMPLEMENTATION REQUIREMENTS:

### 1. Test Taking Logic:

```typescript
// Test take component
testData = signal<Test | null>(null);
currentQuestionIndex = signal(0);
selectedAnswers = signal<Map<string, string>>(new Map()); // questionId -> optionId

currentQuestion = computed(() => {
  const test = this.testData();
  const index = this.currentQuestionIndex();
  return test?.questions[index];
});

isLastQuestion = computed(() => {
  const test = this.testData();
  const index = this.currentQuestionIndex();
  return index === (test?.questions.length ?? 0) - 1;
});

canGoNext = computed(() => {
  const current = this.currentQuestion();
  const answers = this.selectedAnswers();
  return current ? answers.has(current.id) : false;
});

selectOption(questionId: string, optionId: string) {
  const answers = new Map(this.selectedAnswers());
  answers.set(questionId, optionId);
  this.selectedAnswers.set(answers);
}

nextQuestion() {
  if (this.canGoNext()) {
    this.currentQuestionIndex.update(i => i + 1);
  }
}

previousQuestion() {
  this.currentQuestionIndex.update(i => Math.max(0, i - 1));
}

async submitTest() {
  const answers = Array.from(this.selectedAnswers().entries()).map(([questionId, optionId]) => ({
    questionId,
    optionId
  }));
  
  const result = await this.testsService.submitTest(testSlug, { answers });
  // Show result
}
```

### 2. Profile Edit Logic:

```typescript
profileForm = this.fb.group({
  fullName: ['', Validators.required],
  address: ['']
});

editMode = signal(false);

toggleEditMode() {
  if (this.editMode()) {
    this.cancelEdit();
  } else {
    this.editMode.set(true);
  }
}

cancelEdit() {
  this.profileForm.reset(this.user());
  this.editMode.set(false);
}

async saveProfile() {
  if (this.profileForm.valid) {
    const data = this.profileForm.value;
    await this.usersService.updateProfile(data);
    this.editMode.set(false);
    this.notification.success('Profile updated successfully');
  }
}
```

### 3. Services:

Use existing services from shared library:
- AuthService (for authentication)
- UsersService (for profile operations)
- TestsService (for getting tests, submitting tests)

### 4. Routes:

```typescript
export const routes: Routes = [
  {
    path: '',
    component: ProfileLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'tests',
        loadComponent: () => import('./pages/tests/tests-list.component').then(m => m.TestsListComponent)
      },
      {
        path: 'tests/:slug',
        loadComponent: () => import('./pages/tests/test-take.component').then(m => m.TestTakeComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./pages/results/results-list.component').then(m => m.ResultsListComponent)
      }
    ]
  }
];
```

## UI/UX REQUIREMENTS:

1. Clean, modern interface
2. Clear navigation
3. Progress indicators for multi-step processes
4. Confirmation before destructive actions
5. Success/error notifications
6. Loading states during API calls
7. Responsive design
8. Accessible forms with proper labels

## DELIVERABLES:

1. Complete user profile application
2. All pages implemented
3. Test taking flow working end-to-end
4. Profile edit functionality
5. Results viewing
6. Proper error handling
7. Responsive design
8. README with setup instructions

Focus on creating a smooth user experience especially for the test-taking flow. Make sure the progress is clear and the user can navigate back/forth between questions easily.
```

---

## 📝 USAGE INSTRUCTIONS

### For Claude AI:
1. Copy the entire prompt (including all specifications)
2. Paste into Claude chat
3. Claude will generate the complete code step by step
4. Review and ask for modifications if needed

### For JetBrains AI Assistant:
1. Open your project in JetBrains IDE
2. Open AI Assistant panel
3. Copy and paste the relevant prompt (backend or frontend)
4. Let AI generate the code
5. Review and integrate into your project

### Recommended Approach:
1. **Start with Backend**: Use Backend Prompt first
2. **Then Admin Dashboard**: Use Admin Dashboard Prompt
3. **Then User Profile**: Use User Profile Prompt
4. **Finally Landing**: Let AI design the landing page independently

### Tips:
- You can split prompts into smaller chunks if needed
- Ask for specific files one at a time if overwhelming
- Request explanations for complex parts
- Ask AI to add comments to the code
- Request unit tests for critical functions

Good luck with your development! 🚀
