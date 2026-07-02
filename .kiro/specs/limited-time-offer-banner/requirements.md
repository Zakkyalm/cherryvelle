# Requirements Document

## Introduction

This feature adds admin panel management for the "Limited Time Offer" promotional banner section on the Cherryvelle customer-facing homepage. Currently, this banner is hardcoded in `src/app/(site)/page.tsx` with a fixed gradient, heading, discount text, coupon code, and CTA button. The goal is to make all banner fields editable through the admin panel, persisted in the existing Zustand admin store, and dynamically rendered on the customer-facing site — consistent with how other admin-managed content (deal banners, promo bar, hero banners) is handled in the codebase.

## Glossary

- **Admin_Panel**: The Next.js admin interface at `/admin/*` used by store administrators to manage site content.
- **Banner**: The "Limited Time Offer" promotional section rendered on the customer-facing homepage, containing a title badge, discount text, description, coupon code, and CTA button.
- **Admin_Store**: The Zustand store (`useAdminStore`) with `persist` middleware that maintains all admin-managed content in browser `localStorage`.
- **Homepage**: The customer-facing page at `/` rendered by `src/app/(site)/page.tsx`.
- **LimitedTimeOfferBanner**: The data model representing the full set of editable fields for the banner.
- **CTA_Button**: The call-to-action button displayed on the banner (e.g., "Shop the Sale") that links to the shop page.

---

## Requirements

### Requirement 1: Banner Data Model

**User Story:** As an admin, I want the limited-time offer banner content to be stored in the admin store, so that it persists across page reloads and is accessible to both the admin panel and the customer-facing site.

#### Acceptance Criteria

1. THE Admin_Store SHALL include a `limitedTimeOfferBanner` field of type `LimitedTimeOfferBanner`.
2. THE `LimitedTimeOfferBanner` type SHALL contain the following fields: `title` (string, max 100 characters), `discountText` (string, max 50 characters), `description` (string, max 100 characters), `couponCode` (string, max 20 characters), `buttonText` (string, max 50 characters), and `active` (boolean, controls whether the banner is visible on the customer-facing site).
3. THE Admin_Store SHALL initialize `limitedTimeOfferBanner` with `active: true` and the following default values matching the currently hardcoded banner content: `title: "Limited Time Offer"`, `discountText: "Flat 20% Off"`, `description: "on Entire Range"`, `couponCode: "CHERRY20"`, `buttonText: "Shop the Sale"`.
4. THE Admin_Store SHALL expose an `updateLimitedTimeOfferBanner` action that accepts a `Partial<LimitedTimeOfferBanner>` argument and merges the provided fields into the existing `limitedTimeOfferBanner` state, leaving unspecified fields unchanged.
5. WHEN `updateLimitedTimeOfferBanner` is called, THE Admin_Store SHALL persist the resulting `limitedTimeOfferBanner` state to `localStorage` via the existing Zustand `persist` middleware, using the existing `admin-store` key.

---

### Requirement 2: Admin Management Page

**User Story:** As an admin, I want a dedicated page in the admin panel to edit the limited-time offer banner fields, so that I can update the banner content without touching the source code.

#### Acceptance Criteria

1. THE Admin_Panel SHALL provide a page at the route `/admin/limited-time-offer` for managing the banner.
2. THE Admin_Panel SHALL render the `/admin/limited-time-offer` page using the existing `AdminShell` component, consistent with other admin pages.
3. WHEN the `/admin/limited-time-offer` page mounts, THE Admin_Panel SHALL initialize all five form fields (`title`, `discountText`, `description`, `couponCode`, `buttonText`) and the active toggle with the current values from `useAdminStore().limitedTimeOfferBanner`.
4. THE `/admin/limited-time-offer` page SHALL include an editable text input field for each of the five content fields: `title`, `discountText`, `description`, `couponCode`, and `buttonText`, each accepting a maximum of its respective character limit as defined in the data model.
5. THE `/admin/limited-time-offer` page SHALL include a toggle (checkbox) to set the `active` state of the banner, labelled "Active (visible on homepage)".
6. WHEN an admin clicks the Save button, THE Admin_Panel SHALL call the `updateLimitedTimeOfferBanner` action on the Admin_Store with the current form values.
7. WHEN any of the five required form fields is empty after trimming whitespace, THE Admin_Panel SHALL disable the Save button.
8. WHEN the admin clicks the Save button and the store update succeeds, THE Admin_Panel SHALL display a toast notification with the text "Banner updated" in a fixed bottom-right overlay that auto-dismisses after 2500 ms, consistent with the toast pattern used on other admin pages.
9. WHILE the admin is editing form fields, THE `/admin/limited-time-offer` page SHALL render a live preview of the banner reflecting the current form values in real time, before the admin saves.

---

### Requirement 3: Admin Sidebar Navigation

**User Story:** As an admin, I want the limited-time offer banner page to appear in the admin sidebar, so that I can navigate to it from any admin page.

#### Acceptance Criteria

1. THE Admin_Panel SHALL include a navigation entry labelled "Limited Time Offer" in the `AdminSidebar` component's `navItems` array.
2. THE navigation entry SHALL link to `/admin/limited-time-offer`.
3. WHEN the current pathname is exactly `/admin/limited-time-offer`, THE Admin_Panel SHALL render the navigation entry with the same active highlight style (cherry-700 background, white text, ChevronRight indicator) applied to other active nav entries.

---

### Requirement 4: Customer-Facing Banner Rendering

**User Story:** As a customer, I want to see the latest banner content set by the admin, so that the promotional offer displayed on the homepage is always current.

#### Acceptance Criteria

1. IF `limitedTimeOfferBanner.active` is `true`, THEN THE Homepage SHALL render the Limited Time Offer banner section displaying the `title`, `discountText`, `description`, `couponCode`, and `buttonText` values from `useAdminStore().limitedTimeOfferBanner`.
2. IF `limitedTimeOfferBanner.active` is `false`, THEN THE Homepage SHALL not render the Limited Time Offer banner section.
3. THE Homepage SHALL remove the currently hardcoded banner values and instead read all display values from `useAdminStore().limitedTimeOfferBanner`.
4. WHEN `limitedTimeOfferBanner.couponCode` is non-empty, THE Homepage SHALL display the coupon code visibly within the banner description area (e.g., "Use code CHERRY20 at checkout").
5. WHEN `limitedTimeOfferBanner.couponCode` is empty, THE Homepage SHALL not render the coupon code line in the banner description area.
6. THE Homepage SHALL render the CTA button with the label from `limitedTimeOfferBanner.buttonText`, linking to `/shop`. IF `limitedTimeOfferBanner.buttonText` is empty, THE Homepage SHALL not render the CTA button.

---

### Requirement 5: Store Action for Updates

**User Story:** As an admin, I want a dedicated store action to update the banner, so that state changes are handled consistently with the rest of the admin store.

#### Acceptance Criteria

1. THE Admin_Store SHALL expose an `updateLimitedTimeOfferBanner` action typed as `(update: Partial<LimitedTimeOfferBanner>) => void`.
2. WHEN `updateLimitedTimeOfferBanner` is called with a partial object, THE Admin_Store SHALL merge only the supplied keys into the existing `limitedTimeOfferBanner` state, leaving all other keys unchanged.
3. WHEN `updateLimitedTimeOfferBanner` is called, any React component that reads `limitedTimeOfferBanner` from `useAdminStore()` SHALL reflect the updated values on its next render.
4. THE Admin_Store SHALL expose the `LimitedTimeOfferBanner` type as a named export so it can be imported by the admin page and homepage components.
