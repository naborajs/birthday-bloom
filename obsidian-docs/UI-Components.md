---
tags: [ui, components, shadcn, radix, tailwind, design-system]
aliases: [UI Components, Shadcn Components]
---

# UI Components Engine
[[DOCUMENTATION_INDEX|Back to Home]]

The Birthday Bloom repository contains a robust, reusable Design System composed of 49 distinct generic UI components. These components are strictly located in the `src/components/ui/` directory.

These components are built using **[Shadcn UI](https://ui.shadcn.com/)**, which is essentially a beautifully styled wrapper around **[Radix UI Primitives](https://www.radix-ui.com/)**. This means all components are accessible (WAI-ARIA compliant), keyboard-navigable, and unstyled by default until composed with **Tailwind CSS**.

Below is the exhaustive breakdown of **every single UI component** and its purpose in the repository.

---

## 1. Layout & Structure
- **[[accordion.tsx]]**: Vertically collapsing accordion panels. Used for the FAQ section.
- **[[aspect-ratio.tsx]]**: Maintains consistent dimensions for media (like photos in the gallery).
- **[[breadcrumb.tsx]]**: Navigational trail for deep settings menus (if applicable).
- **[[card.tsx]]**: The standard container for grouped content (headers, titles, content, footers).
- **[[collapsible.tsx]]**: A simpler version of accordion for toggling visibility of content.
- **[[drawer.tsx]]**: A slide-out panel, often used on mobile for settings or menus.
- **[[resizable.tsx]]**: Draggable panels that can be resized by the user.
- **[[scroll-area.tsx]]**: Custom scrollbars that look consistent across all browsers (used in long text reveals or terms).
- **[[separator.tsx]]**: A visual divider (`<hr>` equivalent) for grouping elements.
- **[[sheet.tsx]]**: A modal that slides in from the side of the screen (similar to a drawer, but for desktop).
- **[[sidebar.tsx]]**: A full sidebar navigation layout (often used in admin/config views).
- **[[tabs.tsx]]**: Tabbed interface for switching between different views (e.g., Image config vs Text config).

## 2. Navigation & Menus
- **[[context-menu.tsx]]**: Right-click menus (useful for desktop interactions).
- **[[dropdown-menu.tsx]]**: Standard click-to-open dropdowns for actions or settings.
- **[[menubar.tsx]]**: A desktop-style horizontal menu bar.
- **[[navigation-menu.tsx]]**: A complex Radix-powered navigation menu with dropdowns and animations.
- **[[pagination.tsx]]**: Controls for navigating through pages of items (e.g., in a massive photo gallery).

## 3. Forms & Inputs
The backbone of configuration and customization inputs.
- **[[button.tsx]]**: The primary interactive element. Supports variants (default, outline, ghost, link, destructive).
- **[[checkbox.tsx]]**: Boolean toggle input.
- **[[form.tsx]]**: A massive wrapper integrating `react-hook-form` and `zod` for strictly typed form validation.
- **[[input.tsx]]**: Standard text input field.
- **[[input-otp.tsx]]**: One-Time Password input field (used for the `PasswordUnlock.tsx` feature).
- **[[label.tsx]]**: Accessible labels tied to inputs.
- **[[radio-group.tsx]]**: A set of mutually exclusive radio buttons.
- **[[select.tsx]]**: A custom-styled select dropdown (replacing the native `<select>`).
- **[[slider.tsx]]**: A draggable slider for ranges (e.g., adjusting music volume).
- **[[switch.tsx]]**: A toggle switch (iOS style) for boolean preferences.
- **[[textarea.tsx]]**: Multi-line text input (used for custom birthday messages).
- **[[toggle.tsx]]**: A two-state button (on/off).
- **[[toggle-group.tsx]]**: A set of mutually exclusive toggle buttons.

## 4. Feedback & Alerts
- **[[alert.tsx]]**: Static callout boxes (info, warning, destructive) to show inline messages.
- **[[alert-dialog.tsx]]**: A modal dialog that interrupts the user and demands an action (e.g., "Are you sure you want to reset?").
- **[[dialog.tsx]]**: A standard modal window for presenting information or capturing input without leaving the page.
- **[[hover-card.tsx]]**: A tooltip-like card that appears on hover to show preview information.
- **[[popover.tsx]]**: A floating panel anchored to a trigger element (often used with date pickers or complex selects).
- **[[progress.tsx]]**: A progress bar indicator (used in the `SplashScreen.tsx` loading phase).
- **[[skeleton.tsx]]**: A pulsing placeholder used while images or data are loading.
- **[[sonner.tsx]]**: An implementation of the `sonner` toast library for beautiful toast notifications.
- **[[toast.tsx]] & [[toaster.tsx]] & [[use-toast.ts]]**: The legacy/standard toast notification system (often being replaced by sonner).
- **[[tooltip.tsx]]**: Small text labels that appear on hover.

## 5. Data Display
- **[[avatar.tsx]]**: Renders user profile pictures with fallbacks to initials.
- **[[badge.tsx]]**: Small tag-like elements for status indicators.
- **[[calendar.tsx]]**: A date picker component built on top of `react-day-picker` (useful for selecting the actual birthday).
- **[[chart.tsx]]**: A complex wrapper for rendering data visualization (useful in admin analytics dashboards).
- **[[table.tsx]]**: Responsive data tables.

## 6. Utilities
- **[[command.tsx]]**: A fast, composable command menu (Cmd+K interface) built on `cmdk`.

---
#obsidian #documentation #birthday-bloom #vault #ui #components
