# Angular Appgate Technical Assessment

This project is a modern Angular application built to demonstrate best practices, advanced features, and a robust architectural approach. It serves as a comprehensive showcase of skills using Angular 20+, focusing on Standalone Components, Signals for state management, reactive forms, and a CI/CD pipeline.

## Test in Production

**Live Deployment:**
This application has been successfully deployed to **Vercel**. You can access the live version here: [App Gate products](https://appgate-products.vercel.app/)

**Authentication Flow:**
The live deployment is fully integrated with **AWS Cognito**. The authentication flow, including login, logout, and user session management, is completely functional.

**User Roles & Testing:**

- **New Users:** You can create new user accounts through the Cognito sign-up flow. By default, any new user will be assigned the `User` role and will not see administrative UI elements (like the "Delete" or "Create New Product" buttons).

- **Admin Access:** To test the role-based access control, please use the following pre-configured administrator credentials:
  - **Username:** `admin@test.com`
  - **Password:** `Test123456*`

Logging in with this user will grant access to all features, including product creation and deletion.

## Features

- **Modern Angular Architecture:** Built entirely with Standalone Components, eliminating the need for `NgModules`.
- **Reactive State Management:** Uses Angular Signals for efficient, fine-grained, and easy-to-understand state management.
- **Authentication:** Implements a full OIDC authentication flow using AWS Cognito.
- **Role-Based Access Control (RBAC):** A custom structural directive (`*appHasRole`) declaratively shows or hides UI elements and an Angular guard to keep routes protected based on user roles derived from a JWT.
- **Local Data Persistence:** Simulates a full CRUD (Create, Read, Update, Delete) experience by using the browser's `localStorage` as a modification layer on top of a read-only remote API.
- **Reusable UI Components:** Features a shared library of components and directives, including a modal system, navigation, and styled buttons.
- **CI/CD Pipeline:** Includes a production-ready GitHub Actions workflow for automated testing and deployment.

## Tech Stack & Decisions

- **Angular (v20+):** The core framework, utilizing its latest features:
  - **Standalone Components:** To simplify the architecture, improve tree-shaking, and make components more self-contained.
  - **Signals:** Chosen as the primary state management solution for its performance benefits and simpler mental model compared to RxJS for synchronous state.
  - **New Control Flow (`@if`, `@for`):** For more intuitive and performant template logic.
- **TypeScript:** For robust type safety and improved developer experience.
- **SCSS:** Used for styling with a structured approach, including a centralized `_variables.scss` file for design tokens (theming).
- **RxJS:** Used where it excels: handling asynchronous streams, particularly for HTTP requests from `HttpClient`.
- **PNPM:** Chosen as a fast and efficient package manager.

## Getting Started

### Prerequisites

- Node.js (v22.x or later)
- pnpm (v10.x or later)

### Installation & Running

1.**Clone the repository:**

    ```bash
    git clone https://github.com/matew17/appgate-products
    cd appgate-products
    ```

2.**Install dependencies:**

    ```bash
    pnpm install
    ```

3.**Configure Environment Variables:**
This project uses `src/environments/environment.ts` for configuration. Update this file with your AWS Cognito details or other API endpoints only if needed. The production build will automatically use `environment.prod.ts`.

4.**Run the application:**

    - **Development Server:**

      ```bash
      pnpm start
      ```

      The application will be available at `http://localhost:4200/`.

    - **Run Unit Tests:**

      ```bash
      pnpm test
      ```

    - **Build for Production:**
      ```bash
      pnpm run build
      ```
      The output will be in the `dist/` folder.

## Architectural Decisions & Strategies

### Authentication Strategy

Authentication is handled via the **OpenID Connect (OIDC)** implicit flow with **AWS Cognito** as the identity provider.

1. The `AuthService` acts as a facade, wrapping the `angular-auth-oidc-client` library.
2. When a user needs to log in, they are redirected to the Cognito-hosted UI.
3. After successful authentication, Cognito redirects back to a dedicated `/authorize` callback route in our app.
4. The `AuthorizeComponent` uses the `AuthService` to handle the callback, exchange the authorization code for a JWT (ID Token), and establish a local session.

### Role-Based Access Control

UI-level authorization is managed by a custom structural directive, `*appHasRole`.

1. Upon login, the user's roles are extracted from the `cognito:groups` claim within the JWT. (This is basically the groups configuration that cognito provides). Notice that the `admins` group was assigned to specific users manually.
2. The `AuthService` decodes the token and exposes a signal (`userRoles`) with the user's groups.
3. The `*appHasRole="['admins']"` directive is designed to react to this signal and dynamically add or remove its host element from the DOM based on whether the user possesses the required role(s).
4. The `roles.guard.ts` guard is designed to protect routes for creating and editing proudtcs of unauthorized roles, by using the auth service as source of thruth.

### State Management

The primary state management strategy is built on **Angular Signals**.

- **Why Signals?** For a project of this scale, Signals provide a perfect balance of performance and simplicity. They offer fine-grained reactivity without the boilerplate of more extensive libraries like NgRx. State changes are propagated efficiently and predictably.
- **Component State:** Local component state (e.g., `isLoading`, `error`) is managed with `signal()`.
- **Shared State:** Shared state (e.g., authentication status, user data) is exposed from services as `signals` or `computed` signals. This provides a single source of truth that any component can react to.
- **RxJS:** Is used for its intended purpose: handling asynchronous event streams, primarily with `HttpClient`.

### Security Considerations

- **JWT Storage:** The OIDC library handles token storage, typically in `sessionStorage`, which mitigates risks from persistent Cross-Site Scripting (XSS) attacks compared to `localStorage`.
- **Frontend vs. Backend Authorization:** It is understood that the `*appHasRole` directive is a **UI convenience feature**, not a true security measure. Real security must be enforced on the backend. Any sensitive data or actions would require the API to validate the user's JWT on every request.
- **Logout:** The logout process clears the local session and then redirects to the Cognito logout endpoint to invalidate the server-side session, ensuring a full sign-out.

## CI/CD Pipeline

The project includes a CI/CD pipeline using **GitHub Actions**. The workflow is defined in `.github/workflows`.

1. **Trigger:** The workflow runs on every `push` and `pull_request` to the `main` branch.
2. **Job: Build & Test:**

- Installs dependencies using `pnpm`.
- Runs all unit tests using `ng test` in headless mode.
- Runs a production build (`ng build`) to ensure the application compiles successfully.

## Trade-offs & Future Improvements

### Scaling the Application

- **State Management:** If the application grew significantly, introducing a more structured state management library like **NgRx (or SignalStore)** would be beneficial for handling complex, cross-component state.
- **Architecture (Option 1):** For a larger platform, a MFE system could be implemented using Module Native federation, a new way to build MFEs without webpack, and closed to web standards. We could have a system with several repos and apps, and have a shared npm package with all shared components and directives.
- **Architecture (Option 2):** For a larger platform, a **monorepo architecture (using Nx)** would be adopted to manage shared libraries, services, and multiple applications (e.g., a customer-facing app and an admin app).
- **Backend:** The local CRUD simulation would be replaced by a real backend API (e.g., Node.js, .NET, Go) with a database, which would be the single source of truth.

### Trade-offs Made

- **Local CRUD:** The current implementation of creating, updating, and deleting products in `localStorage` is purely a simulation for this assessment. It works well but is not suitable for a real multi-user production environment.
- **Dynamic Modal System:** The modal service uses Angular's `createComponent` API. This is extremely powerful and decoupled but is more complex than a simpler approach using an `@if` in a host component. The trade-off was made in favor of demonstrating advanced architectural patterns.

### Potential Future Improvements

- **Roles**: We could potentially add features to our app to manage roles and permissions without depeding on cognito.
- **End-to-End (E2E) Testing:** Add a suite of E2E tests using a framework like **Cypress** or **Playwright** to test full user flows.
- **Enhanced Error Handling:** Implement a global HTTP interceptor to handle API errors more gracefully and provide user-friendly feedback.
- **Accessibility (a11y):** Conduct a full accessibility audit and implement ARIA attributes to ensure the application is usable by everyone.
- **Optimistic UI Updates:** For a smoother user experience, the UI could be updated instantly after a create/update/delete action, and then reverted only if the subsequent API call (in a real backend scenario) fails.
