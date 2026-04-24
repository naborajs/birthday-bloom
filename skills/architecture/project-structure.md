# Project Architecture & Patterns

Scalable applications require a deliberate structure. If you just throw everything into `src/components`, the project will become unmaintainable.

## 1. Directory Structure: Feature-Based over Type-Based

As projects grow, organizing by type (`/components`, `/hooks`, `/api`) becomes painful. You end up jumping across 5 folders to understand one feature.

**Use Feature-Driven Architecture:** Group files by their domain.

```text
src/
├── features/
│   ├── auth/                # Everything related to Authentication
│   │   ├── api/             # API calls (e.g., login.ts, register.ts)
│   │   ├── components/      # Auth specific UI (LoginForm.tsx)
│   │   ├── hooks/           # useAuth.ts
│   │   ├── store/           # Auth state slice
│   │   └── index.ts         # Public API for this feature
│   ├── dashboard/           # Dashboard feature
│   └── birthday-core/       # Birthday specific logic
├── components/              # ONLY generic, shared UI (Buttons, Inputs, Modals)
├── lib/                     # Setup for third-party libraries (axios setup, formatters)
├── hooks/                   # ONLY generic hooks (useWindowSize, useClickOutside)
└── store/                   # Global store config (root reducer)
```

**Rule of Thumb**: A feature folder should act like its own mini-library. It exports what it needs to via `index.ts` and keeps internal components private.

## 2. Advanced Component Patterns

### Compound Components
Used to create highly flexible UI components that share state implicitly, avoiding prop drilling. Think of `<select>` and `<option>`.

```tsx
import React, { createContext, useContext, useState } from 'react';

const AccordionContext = createContext();

export const Accordion = ({ children }) => {
  const [activeItem, setActiveItem] = useState(null);
  return (
    <AccordionContext.Provider value={{ activeItem, setActiveItem }}>
      <div className="accordion-wrapper">{children}</div>
    </AccordionContext.Provider>
  );
};

Accordion.Item = ({ id, title, children }) => {
  const { activeItem, setActiveItem } = useContext(AccordionContext);
  const isOpen = activeItem === id;

  return (
    <div>
      <button onClick={() => setActiveItem(isOpen ? null : id)}>{title}</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

// Usage:
<Accordion>
  <Accordion.Item id="1" title="Section 1">Content 1</Accordion.Item>
  <Accordion.Item id="2" title="Section 2">Content 2</Accordion.Item>
</Accordion>
```

### Custom Hooks for Logic Separation
Never put complex business logic or data fetching directly inside a UI component. The component should only care about rendering data and firing events.

```tsx
// ❌ BAD: UI and Logic mixed
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  useEffect(() => { fetchUser(userId).then(setUser) }, [userId]);
  return <div>{user.name}</div>;
}

// ✅ GOOD: Logic separated into a hook
const useUserData = (userId) => {
  // TanStack Query is perfect here
  return useQuery({ queryKey: ['user', userId], queryFn: () => fetchUser(userId) });
};

const UserProfile = ({ userId }) => {
  const { data: user, isLoading } = useUserData(userId);
  if (isLoading) return <Spinner />;
  return <div>{user.name}</div>;
}
```

## 3. State Management Strategy

Do not default to Redux for everything. Scale your state management to the problem.

1.  **Local State (`useState`, `useReducer`)**: For UI state that only one component cares about (e.g., is a modal open? what is in this text input?).
2.  **Server State (`TanStack React Query`, `SWR`)**: For anything that comes from an API. Do not use Redux to cache API responses. React Query handles caching, background updates, loading states, and retries automatically.
3.  **Global UI State (`Zustand`, `Jotai`, `Context`)**: For state that must be accessed across the entire app but isn't from the server (e.g., Dark Mode toggle, current language, active user session). Zustand is highly recommended over Redux for its simplicity and lack of boilerplate.
