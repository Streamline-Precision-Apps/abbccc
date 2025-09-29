# How to Add a Suspense Boundary for Data Fetching in Next.js

This guide explains how to implement React Suspense boundaries in a Next.js app to enable streaming UI and improved loading states for async data fetching.

---

## 1. When to Use Suspense

- Use `<Suspense>` to stream parts of your UI that depend on async data.
- This allows you to show a fallback (like a skeleton or spinner) while data loads, instead of blocking the whole page.

---

## 2. Basic Usage

1. **Import Suspense:**
   ```tsx
   import { Suspense } from "react";
   ```
2. **Wrap the async component:**

   ```tsx
   // If your page/component already has a custom loading UI, use it as the Suspense fallback:
   <Suspense fallback={<YourLoadingComponentOrJSX />}>
     <YourAsyncComponent />
   </Suspense>
   ```

   - The `fallback` prop is the UI shown while the component inside is loading. Prefer to use the same loading UI as your page/component, not just a generic `<div>Loading...</div>`.

---

## 3. Example: Streaming a Component

Suppose you have a component that fetches data:

```tsx
// components/WidgetList.tsx
export default async function WidgetList() {
  const res = await fetch("/api/widgets");
  const widgets = await res.json();
  return (
    <ul>
      {widgets.map((w) => (
        <li key={w.id}>{w.name}</li>
      ))}
    </ul>
  );
}
```

Wrap it in a Suspense boundary in your page or section:

```tsx
import { Suspense } from "react";
import WidgetList from "@/components/WidgetList";
import WidgetListSkeleton from "@/components/WidgetListSkeleton";

export default function WidgetSection() {
  return (
    <section>
      <Suspense fallback={<WidgetListSkeleton />}>
        <WidgetList />
      </Suspense>
    </section>
  );
}
```

---

## 4. Creating a Fallback UI

- The fallback should be a skeleton, spinner, or partial UI that helps users understand loading is in progress.
- Example: `<WidgetListSkeleton />` can be a placeholder list.

---

## 5. Route-Level Streaming with `loading.js`

- To stream the entire page or route segment, add a `loading.js` (or `loading.tsx`) file in the same folder as your `page.js`.
- Next.js will automatically wrap the page in a Suspense boundary and show the loading UI while the page is being rendered.

Example:

```tsx
// app/widgets/loading.tsx
export default function Loading() {
  return <div>Loading widgets...</div>;
}
```

---

## 6. Tips

- Use Suspense for granular streaming (individual components).
- Use `loading.js` for route-level streaming.
- Design fallback UIs that match your app’s look and feel.
- For client components, you can also use the `use` hook or libraries like SWR/React Query for data fetching and Suspense.

---

## 7. References

- [Next.js Docs: Fetching Data with Suspense](https://nextjs.org/docs/app/getting-started/fetching-data#with-suspense)
- [React Docs: Suspense](https://react.dev/reference/react/Suspense)

---

**Summary:**
Wrap async components in `<Suspense fallback={...}>` to stream their content and show a loading state. For route-level streaming, use a `loading.js` file. Always provide a meaningful fallback UI.
