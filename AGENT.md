# AGENT.MD

## Project Rules

This project is an Angular application using:

* Angular Standalone Components
* TypeScript strict mode
* Tailwind CSS
* Feature-based architecture
* Clean, simple, maintainable code

Always follow these rules when generating or editing code.

---

## 1. Architecture

Use this structure:

```txt
src/app/
├── core/
│   ├── services/
│   ├── interceptors/
│   ├── guards/
│   ├── models/
│   └── constants/
│
├── shared/
│   ├── components/
│   ├── directives/
│   ├── pipes/
│   └── utils/
│
├── features/
│   └── feature-name/
│       ├── pages/
│       ├── components/
│       ├── services/
│       ├── models/
│       └── feature-name.routes.ts
│
├── layout/
│   ├── main-layout/
│   └── auth-layout/
│
├── app.config.ts
├── app.routes.ts
└── app.ts
```

---

## 2. Folder Rules

### `core/`

Use `core/` for singleton logic used by the whole app.

Examples:

* AuthService
* ApiService
* HTTP interceptors
* Route guards
* Global models
* App constants

Do not put UI components in `core/`.

---

### `shared/`

Use `shared/` for reusable UI and utility code.

Examples:

* ButtonComponent
* InputComponent
* ModalComponent
* CardComponent
* DatePipe
* Form validators
* Helper functions

Shared components must not depend on business-specific feature logic.

---

### `features/`

Use `features/` for business modules.

Each feature should contain its own:

* pages
* components
* services
* models
* routes

Example:

```txt
features/products/
├── pages/
│   ├── product-list-page/
│   └── product-detail-page/
├── components/
│   ├── product-card/
│   └── product-filter/
├── services/
│   └── product.service.ts
├── models/
│   └── product.model.ts
└── products.routes.ts
```

---

## 3. Angular Component Rules

Always use standalone components.

Correct:

```ts
@Component({
  selector: 'app-example',
  imports: [],
  templateUrl: './example.html',
})
export class ExampleComponent {}
```

Do not create NgModules unless the user explicitly asks.

Use external templates for large components.

Use inline templates only for very small components.

Component class files should be simple and readable.

Avoid putting complex business logic inside components.

Move business logic to services.

---

## 4. Naming Rules

Use kebab-case for files and folders.

Correct:

```txt
product-card.component.ts
product-list-page.component.ts
auth.service.ts
user-profile.model.ts
```

Use PascalCase for classes.

Correct:

```ts
export class ProductCardComponent {}
export interface UserProfile {}
export class AuthService {}
```

Use clear names.

Avoid vague names like:

```txt
data.service.ts
helper.ts
common.ts
test.component.ts
```

---

## 5. Routing Rules

Use lazy loading for feature routes.

Root routes should be in:

```txt
src/app/app.routes.ts
```

Feature routes should be in:

```txt
src/app/features/feature-name/feature-name.routes.ts
```

Example:

```ts
export const routes: Routes = [
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.routes').then(m => m.PRODUCTS_ROUTES),
  },
];
```

Feature route example:

```ts
export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/product-list-page/product-list-page.component')
        .then(m => m.ProductListPageComponent),
  },
];
```

---

## 6. State Management Rules

Prefer simple Angular state first.

Use:

* signals
* computed
* effect only when necessary
* services for shared state

Do not add NgRx, Akita, MobX, or other state libraries unless the user explicitly asks.

For local component state, use signals.

Example:

```ts
readonly isLoading = signal(false);
readonly searchKeyword = signal('');
```

For derived state, use computed.

Example:

```ts
readonly filteredProducts = computed(() =>
  this.products().filter(product =>
    product.name.toLowerCase().includes(this.searchKeyword().toLowerCase())
  )
);
```

---

## 7. API Service Rules

API calls should be placed in services, not components.

Correct:

```txt
features/products/services/product.service.ts
```

Example:

```ts
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }
}
```

Components should call services and handle UI state only.

---

## 8. TypeScript Rules

Use strict typing.

Avoid `any`.

Prefer:

```ts
unknown
interface
type
generic types
```

Always create models for API data.

Example:

```ts
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}
```

Do not use magic strings or magic numbers.

Move reusable constants to:

```txt
core/constants/
```

---

## 9. Template Rules

Use modern Angular control flow.

Use:

```html
@if (isLoading()) {
  <p>Loading...</p>
}

@for (item of items(); track item.id) {
  <app-item-card [item]="item" />
}
```

Avoid old syntax unless existing code already uses it:

```html
*ngIf
*ngFor
```

Always use `track` in loops.

Keep templates readable.

Do not write too much logic inside templates.

---

## 10. Tailwind CSS Rules

Use Tailwind CSS for styling.

Prefer utility classes directly in templates.

Example:

```html
<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
  <h2 class="text-lg font-semibold text-slate-900">Title</h2>
</div>
```

Use consistent spacing:

* `p-4`, `p-6`, `p-8`
* `gap-2`, `gap-4`, `gap-6`
* `rounded-lg`, `rounded-xl`, `rounded-2xl`

Use consistent colors:

* Background: `bg-slate-50`, `bg-white`
* Text: `text-slate-900`, `text-slate-600`, `text-slate-400`
* Border: `border-slate-200`
* Primary: `bg-blue-600`, `text-blue-600`, `hover:bg-blue-700`

Do not write custom CSS unless necessary.

Avoid inline styles.

Avoid random colors.

Do not create inconsistent designs across pages.

---

## 11. UI Design Rules

The design should be:

* clean
* modern
* simple
* responsive
* consistent
* easy to read

Use layout patterns like:

```html
<section class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
</section>
```

Cards should usually use:

```html
rounded-xl border border-slate-200 bg-white p-4 shadow-sm
```

Buttons should usually use:

```html
inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition
```

Primary button:

```html
bg-blue-600 text-white hover:bg-blue-700
```

Secondary button:

```html
border border-slate-300 bg-white text-slate-700 hover:bg-slate-50
```

Input:

```html
w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
```

---

## 12. Responsive Rules

Always make UI responsive.

Use mobile-first Tailwind classes.

Example:

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
</div>
```

Do not design only for desktop.

---

## 13. Form Rules

Use Reactive Forms for complex forms.

Use template-driven forms only for very simple cases.

Form validation should be clear and user-friendly.

Do not put large validation logic inside the template.

---

## 14. Error Handling Rules

Show loading, empty, and error states.

Every data page should consider:

* loading state
* error state
* empty state
* success state

Example:

```html
@if (isLoading()) {
  <p>Loading...</p>
} @else if (errorMessage()) {
  <p class="text-sm text-red-600">{{ errorMessage() }}</p>
} @else if (items().length === 0) {
  <p class="text-sm text-slate-500">No data found.</p>
}
```

---

## 15. Performance Rules

Keep components small.

Use lazy-loaded routes.

Avoid unnecessary subscriptions.

Prefer `async` pipe or signals where suitable.

Clean up subscriptions when needed.

Avoid heavy logic in templates.

Avoid large components with too many responsibilities.

---

## 16. Testing Rules

When adding important logic, add tests if the project already has tests.

Do not remove existing tests.

Do not disable tests just to make code pass.

---

## 17. Code Generation Rules for AI

When generating code:

1. Follow the existing project structure.
2. Do not create random folders.
3. Do not mix architecture styles.
4. Do not create NgModules.
5. Use standalone components.
6. Use Tailwind CSS.
7. Keep code simple.
8. Prefer readable code over clever code.
9. Explain important changes briefly.
10. Do not rewrite unrelated files.
11. Do not install new libraries unless necessary.
12. Ask before adding large dependencies.
13. Preserve existing naming conventions.
14. Use TypeScript strict typing.
15. Avoid `any`.

---

## 18. Default Page Pattern

When creating a new page, use this pattern:

```html
<section class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-slate-900">Page Title</h1>
    <p class="mt-1 text-sm text-slate-600">
      Short page description.
    </p>
  </div>

  <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    Page content here.
  </div>
</section>
```

---

## 19. Default Component Pattern

When creating a reusable component, keep it focused.

Example:

```ts
@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
})
export class CardComponent {
  readonly title = input.required<string>();
}
```

---

## 20. Final Rule

Before making changes, always think:

* Is this file in the correct folder?
* Is this component too large?
* Is this logic in the right place?
* Is the UI consistent with Tailwind design rules?
* Is the code easy for a beginner Angular developer to understand?

If not, refactor before finishing.
