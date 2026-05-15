# UI Components

<cite>
**Referenced Files in This Document**
- [button.tsx](file://components/ui/button.tsx)
- [input.tsx](file://components/ui/input.tsx)
- [card.tsx](file://components/ui/card.tsx)
- [dialog.tsx](file://components/ui/dialog.tsx)
- [form.tsx](file://components/ui/form.tsx)
- [select.tsx](file://components/ui/select.tsx)
- [tabs.tsx](file://components/ui/tabs.tsx)
- [badge.tsx](file://components/ui/badge.tsx)
- [avatar.tsx](file://components/ui/avatar.tsx)
- [switch.tsx](file://components/ui/switch.tsx)
- [table.tsx](file://components/ui/table.tsx)
- [alert.tsx](file://components/ui/alert.tsx)
- [toast.tsx](file://components/ui/toast.tsx)
- [skeleton.tsx](file://components/ui/skeleton.tsx)
- [tooltip.tsx](file://components/ui/tooltip.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document describes the Muse UI component library built with shadcn/ui and Tailwind CSS. It focuses on the reusable UI primitives and composite components under components/ui, detailing their props, attributes, states, animations, customization, accessibility, and integration patterns. Where applicable, we map animations and transitions to Radix UI primitives and Tailwind utilities. We also provide guidance for responsive design, theming, cross-browser compatibility, and performance.

## Project Structure
The UI components are organized under components/ui and grouped by domain (inputs, overlays, surfaces, feedback, navigation, etc.). Each component is self-contained, composes Tailwind classes via a shared utility, and integrates with Radix UI for accessible behavior.

```mermaid
graph TB
subgraph "UI Components"
B["Button"]
I["Input"]
C["Card (header/body/footer/title/description)"]
D["Dialog (root/overlay/content/trigger/close)"]
F["Form (provider/item/label/control/description/message)"]
S["Select (root/trigger/content/item/label)"]
T["Tabs (root/list/trigger/content)"]
Bad["Badge"]
Ava["Avatar (root/image/fallback)"]
Sw["Switch"]
Tab["Table (table/header/body/footer/head/body/caption)"]
A["Alert (title/description)"]
Ts["Toast (provider/viewport/root/action/close/title/description)"]
Sk["Skeleton"]
TT["Tooltip (provider/root/trigger/content)"]
end
B --> |"variant/size"| B
D --> |"Radix UI portal/overlay"| D
F --> |"react-hook-form provider/context"| F
S --> |"Radix UI select"| S
T --> |"Radix UI tabs"| T
Ts --> |"Radix UI toast"| Ts
TT --> |"Radix UI tooltip"| TT
```

**Diagram sources**
- [button.tsx:1-58](file://components/ui/button.tsx#L1-L58)
- [input.tsx:1-23](file://components/ui/input.tsx#L1-L23)
- [card.tsx:1-80](file://components/ui/card.tsx#L1-L80)
- [dialog.tsx:1-123](file://components/ui/dialog.tsx#L1-L123)
- [form.tsx:1-179](file://components/ui/form.tsx#L1-L179)
- [select.tsx:1-161](file://components/ui/select.tsx#L1-L161)
- [tabs.tsx:1-56](file://components/ui/tabs.tsx#L1-L56)
- [badge.tsx:1-38](file://components/ui/badge.tsx#L1-L38)
- [avatar.tsx:1-51](file://components/ui/avatar.tsx#L1-L51)
- [switch.tsx:1-30](file://components/ui/switch.tsx#L1-L30)
- [table.tsx:1-118](file://components/ui/table.tsx#L1-L118)
- [alert.tsx:1-60](file://components/ui/alert.tsx#L1-L60)
- [toast.tsx:1-130](file://components/ui/toast.tsx#L1-L130)
- [skeleton.tsx:1-16](file://components/ui/skeleton.tsx#L1-L16)
- [tooltip.tsx:1-31](file://components/ui/tooltip.tsx#L1-L31)

**Section sources**
- [button.tsx:1-58](file://components/ui/button.tsx#L1-L58)
- [input.tsx:1-23](file://components/ui/input.tsx#L1-L23)
- [card.tsx:1-80](file://components/ui/card.tsx#L1-L80)
- [dialog.tsx:1-123](file://components/ui/dialog.tsx#L1-L123)
- [form.tsx:1-179](file://components/ui/form.tsx#L1-L179)
- [select.tsx:1-161](file://components/ui/select.tsx#L1-L161)
- [tabs.tsx:1-56](file://components/ui/tabs.tsx#L1-L56)
- [badge.tsx:1-38](file://components/ui/badge.tsx#L1-L38)
- [avatar.tsx:1-51](file://components/ui/avatar.tsx#L1-L51)
- [switch.tsx:1-30](file://components/ui/switch.tsx#L1-L30)
- [table.tsx:1-118](file://components/ui/table.tsx#L1-L118)
- [alert.tsx:1-60](file://components/ui/alert.tsx#L1-L60)
- [toast.tsx:1-130](file://components/ui/toast.tsx#L1-L130)
- [skeleton.tsx:1-16](file://components/ui/skeleton.tsx#L1-L16)
- [tooltip.tsx:1-31](file://components/ui/tooltip.tsx#L1-L31)

## Core Components
This section summarizes the primary UI building blocks and their customization surface.

- Button
  - Purpose: Primary action with variants and sizes.
  - Props: variant (default, destructive, outline, secondary, ghost, link), size (default, sm, lg, icon), asChild (render as child element), plus native button attributes.
  - States: disabled, focus-visible ring, hover states mapped to variant tokens.
  - Accessibility: Inherits native semantics; focus-visible ring for keyboard navigation.
  - Customization: Extend variants/sizes via class variance authority; Tailwind classes merge with defaults.

- Input
  - Purpose: Text, password, email, number inputs.
  - Props: type, plus native input attributes.
  - States: disabled, focus-visible ring, placeholder color.
  - Accessibility: Proper labeling via parent form components recommended.
  - Customization: Tailwind classes override default styles.

- Card
  - Purpose: Content container with header, title, description, content, footer.
  - Composition: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter.
  - Props: Standard HTML div attributes; spacing and typography applied internally.
  - Accessibility: Wrap interactive elements inside content/footer as needed.

- Dialog
  - Purpose: Modal overlay with content area and close trigger.
  - Composition: Root, Portal, Overlay, Content, Trigger, Close, Header/Footer, Title, Description.
  - States: open/closed; animated via data-state attributes (fade/zoom/slide).
  - Accessibility: Focus trapping, Escape handling, ARIA roles managed by Radix UI.

- Form
  - Purpose: Integration with react-hook-form for labels, controls, descriptions, and messages.
  - Composition: Form (provider), FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField.
  - Props: Uses react-hook-form Controller props; aria-* attributes auto-bound.
  - Accessibility: Associates labels, descriptions, and error messages via generated IDs.

- Select
  - Purpose: Dropdown selection with scroll areas and item indicators.
  - Composition: Root, Group, Value, Trigger, Content, ScrollUp/Down buttons, Label, Item, Separator.
  - States: open/closed; popper positioning; scroll indicators.
  - Accessibility: Keyboard navigation, ARIA listbox/option semantics.

- Tabs
  - Purpose: Organize content into selectable sections.
  - Composition: Root, List, Trigger, Content.
  - States: active tab via data-state; focus-visible ring.
  - Accessibility: Keyboard navigation per WAI-ARIA Tabs pattern.

- Badge
  - Purpose: Short labels or indicators.
  - Props: variant (default, secondary, destructive, outline).
  - Customization: Variant-driven styling via class variance authority.

- Avatar
  - Purpose: User or entity image with fallback.
  - Composition: Root, Image, Fallback.
  - Accessibility: Ensure alt text on image when available.

- Switch
  - Purpose: Binary on/off control.
  - Props: Native input attributes; data-state reflects checked/unchecked.
  - States: focus-visible ring; thumb translation indicates state.

- Table
  - Purpose: Present structured data with responsive wrapper.
  - Composition: Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption.
  - Accessibility: Use proper semantic markup (thead, tbody, th scope).

- Alert
  - Purpose: Convey contextual information.
  - Props: variant (default, destructive).
  - Accessibility: Role set to alert; ensure contrast for destructive variant.

- Toast
  - Purpose: Non-modal notifications with actions and swipe gestures.
  - Composition: Provider, Viewport, Root, Action, Close, Title, Description.
  - States: open/closed; swipe-to-dismiss; destructive variant styling.
  - Animations: Fade/zoom/slide transitions driven by data-state.

- Skeleton
  - Purpose: Visual placeholder during async loading.
  - Props: Standard HTML div attributes.
  - Animation: Pulse animation via Tailwind.

- Tooltip
  - Purpose: Brief help text on hover/focus.
  - Composition: Provider, Root, Trigger, Content.
  - States: open/closed; directional slide animations.

**Section sources**
- [button.tsx:36-55](file://components/ui/button.tsx#L36-L55)
- [input.tsx:5-22](file://components/ui/input.tsx#L5-L22)
- [card.tsx:5-79](file://components/ui/card.tsx#L5-L79)
- [dialog.tsx:9-122](file://components/ui/dialog.tsx#L9-L122)
- [form.tsx:18-178](file://components/ui/form.tsx#L18-L178)
- [select.tsx:9-160](file://components/ui/select.tsx#L9-L160)
- [tabs.tsx:8-55](file://components/ui/tabs.tsx#L8-L55)
- [badge.tsx:26-37](file://components/ui/badge.tsx#L26-L37)
- [avatar.tsx:8-50](file://components/ui/avatar.tsx#L8-L50)
- [switch.tsx:8-29](file://components/ui/switch.tsx#L8-L29)
- [table.tsx:5-117](file://components/ui/table.tsx#L5-L117)
- [alert.tsx:22-59](file://components/ui/alert.tsx#L22-L59)
- [toast.tsx:10-129](file://components/ui/toast.tsx#L10-L129)
- [skeleton.tsx:3-15](file://components/ui/skeleton.tsx#L3-L15)
- [tooltip.tsx:8-30](file://components/ui/tooltip.tsx#L8-L30)

## Architecture Overview
The UI library leverages:
- Radix UI for accessible base behaviors (dialogs, selects, tooltips, toasts, tabs, avatars).
- Class Variance Authority (CVA) for variant/state-driven styling.
- Tailwind CSS for utility-first styling and responsive breakpoints.
- react-hook-form for form composition and validation messaging.

```mermaid
graph TB
subgraph "Styling Layer"
TW["Tailwind Utilities"]
CVA["Class Variance Authority"]
end
subgraph "Behavior Layer"
RUI["Radix UI Primitives"]
RH["React Hook Form"]
end
subgraph "Components"
Btn["Button"]
Inp["Input"]
Dlg["Dialog"]
Sel["Select"]
Frm["Form"]
Tbs["Tabs"]
Tst["Toast"]
Ttp["Tooltip"]
end
Btn --> CVA
Btn --> TW
Inp --> TW
Dlg --> RUI
Sel --> RUI
Frm --> RH
Tbs --> RUI
Tst --> RUI
Ttp --> RUI
```

**Diagram sources**
- [button.tsx:7-34](file://components/ui/button.tsx#L7-L34)
- [input.tsx:10-11](file://components/ui/input.tsx#L10-L11)
- [dialog.tsx:17-54](file://components/ui/dialog.tsx#L17-L54)
- [select.tsx:15-100](file://components/ui/select.tsx#L15-L100)
- [form.tsx:1-179](file://components/ui/form.tsx#L1-L179)
- [tabs.tsx:10-38](file://components/ui/tabs.tsx#L10-L38)
- [toast.tsx:12-56](file://components/ui/toast.tsx#L12-L56)
- [tooltip.tsx:14-27](file://components/ui/tooltip.tsx#L14-L27)

## Detailed Component Analysis

### Button
- Props
  - variant: default | destructive | outline | secondary | ghost | link
  - size: default | sm | lg | icon
  - asChild: render underlying element as a child slot
  - Additional button attributes (type, onClick, disabled, etc.)
- States and Animations
  - Hover/focus-visible ring controlled by Tailwind utilities.
  - Disabled state reduces opacity and disables pointer events.
- Accessibility
  - Inherits native button semantics; ensure meaningful text or icon with aria-label.
- Customization
  - Add new variants/sizes via cva; merge className with defaults.

```mermaid
classDiagram
class Button {
+variant : "default|destructive|outline|secondary|ghost|link"
+size : "default|sm|lg|icon"
+asChild : boolean
+...button attributes
}
```

**Diagram sources**
- [button.tsx:36-55](file://components/ui/button.tsx#L36-L55)

**Section sources**
- [button.tsx:7-55](file://components/ui/button.tsx#L7-L55)

### Input
- Props
  - type: text, email, password, number, etc.
  - Additional input attributes (value, onChange, placeholder, etc.)
- States and Animations
  - Focus-visible ring; disabled state handled.
- Accessibility
  - Pair with a label; avoid relying solely on placeholder text.

```mermaid
classDiagram
class Input {
+type : string
+...input attributes
}
```

**Diagram sources**
- [input.tsx:5-22](file://components/ui/input.tsx#L5-L22)

**Section sources**
- [input.tsx:5-22](file://components/ui/input.tsx#L5-L22)

### Card
- Composition
  - Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Props
  - All accept standard HTML div attributes; internal spacing and typography applied.
- Accessibility
  - Structure content with semantic headings and paragraphs.

```mermaid
classDiagram
class Card
class CardHeader
class CardTitle
class CardDescription
class CardContent
class CardFooter
Card <|-- CardHeader
Card <|-- CardTitle
Card <|-- CardDescription
Card <|-- CardContent
Card <|-- CardFooter
```

**Diagram sources**
- [card.tsx:5-79](file://components/ui/card.tsx#L5-L79)

**Section sources**
- [card.tsx:5-79](file://components/ui/card.tsx#L5-L79)

### Dialog
- Composition
  - Root, Portal, Overlay, Content, Trigger, Close, Header/Footer, Title, Description
- States and Animations
  - Data-state open/closed drives fade-in/out, zoom-in/zoom-out, and slide-in/slide-out.
- Accessibility
  - Focus management and Escape key handling via Radix UI; ensure content is labeled.

```mermaid
sequenceDiagram
participant U as "User"
participant T as "Trigger"
participant P as "Portal"
participant O as "Overlay"
participant C as "Content"
participant X as "Close"
U->>T : Click
T->>P : Open dialog
P->>O : Render overlay
O->>C : Render content
U->>X : Click close
X->>P : Close dialog
```

**Diagram sources**
- [dialog.tsx:9-54](file://components/ui/dialog.tsx#L9-L54)

**Section sources**
- [dialog.tsx:9-122](file://components/ui/dialog.tsx#L9-L122)

### Form
- Composition
  - Form (provider), FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField
- Behavior
  - Provides context for field IDs and error messaging; binds aria-* attributes automatically.
- Accessibility
  - Ensures labels, descriptions, and error messages are associated with controls.

```mermaid
flowchart TD
Start(["Render Form"]) --> Item["FormItem creates unique ID"]
Item --> Label["FormLabel binds to control"]
Label --> Control["FormControl wraps input"]
Control --> Desc["FormDescription renders help text"]
Control --> Msg["FormMessage renders errors"]
Msg --> End(["Accessible form state"])
```

**Diagram sources**
- [form.tsx:75-167](file://components/ui/form.tsx#L75-L167)

**Section sources**
- [form.tsx:18-178](file://components/ui/form.tsx#L18-L178)

### Select
- Composition
  - Root, Trigger, Content, Viewport, ScrollUp/Down buttons, Label, Item, Separator
- States and Animations
  - Position prop supports "popper" placement; content animates open/close with fade/zoom/slide.
- Accessibility
  - Keyboard navigation and ARIA listbox semantics.

```mermaid
sequenceDiagram
participant U as "User"
participant Trg as "Trigger"
participant Cnt as "Content"
participant Vp as "Viewport"
participant Itm as "Item"
U->>Trg : Click
Trg->>Cnt : Open content
Cnt->>Vp : Render viewport
U->>Itm : Select option
Itm->>Trg : Set value
Itm->>Cnt : Close content
```

**Diagram sources**
- [select.tsx:15-100](file://components/ui/select.tsx#L15-L100)

**Section sources**
- [select.tsx:9-160](file://components/ui/select.tsx#L9-L160)

### Tabs
- Composition
  - Root, List, Trigger, Content
- States and Animations
  - Active state via data-state; focus-visible ring and transitions.

```mermaid
flowchart TD
A["Click TabTrigger"] --> B["Root sets active tab"]
B --> C["Active content visible"]
C --> D["Inactive content hidden"]
```

**Diagram sources**
- [tabs.tsx:10-38](file://components/ui/tabs.tsx#L10-L38)

**Section sources**
- [tabs.tsx:8-55](file://components/ui/tabs.tsx#L8-L55)

### Badge
- Props
  - variant: default | secondary | destructive | outline
- Customization
  - Variant-driven styling via cva.

```mermaid
classDiagram
class Badge {
+variant : "default|secondary|destructive|outline"
}
```

**Diagram sources**
- [badge.tsx:26-37](file://components/ui/badge.tsx#L26-L37)

**Section sources**
- [badge.tsx:6-37](file://components/ui/badge.tsx#L6-L37)

### Avatar
- Composition
  - Root, Image, Fallback
- Accessibility
  - Provide alt text on image when appropriate.

```mermaid
classDiagram
class Avatar
class AvatarImage
class AvatarFallback
Avatar <|-- AvatarImage
Avatar <|-- AvatarFallback
```

**Diagram sources**
- [avatar.tsx:8-50](file://components/ui/avatar.tsx#L8-L50)

**Section sources**
- [avatar.tsx:1-51](file://components/ui/avatar.tsx#L1-L51)

### Switch
- Props
  - Native input attributes; data-state indicates checked/unchecked.
- States and Animations
  - Thumb translates horizontally; focus-visible ring.

```mermaid
flowchart TD
Start(["Render Switch"]) --> Checked{"Checked?"}
Checked --> |Yes| ThumbRight["Thumb translated right"]
Checked --> |No| ThumbLeft["Thumb translated left"]
ThumbRight --> End(["Apply variant color"])
ThumbLeft --> End
```

**Diagram sources**
- [switch.tsx:8-29](file://components/ui/switch.tsx#L8-L29)

**Section sources**
- [switch.tsx:1-30](file://components/ui/switch.tsx#L1-L30)

### Table
- Composition
  - Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption
- Accessibility
  - Use thead/tbody and th scope for screen readers.

```mermaid
classDiagram
class Table
class TableHeader
class TableBody
class TableFooter
class TableRow
class TableHead
class TableCell
class TableCaption
Table <|-- TableHeader
Table <|-- TableBody
Table <|-- TableFooter
Table <|-- TableRow
TableRow <|-- TableHead
TableRow <|-- TableCell
Table <|-- TableCaption
```

**Diagram sources**
- [table.tsx:5-117](file://components/ui/table.tsx#L5-L117)

**Section sources**
- [table.tsx:1-118](file://components/ui/table.tsx#L1-L118)

### Alert
- Props
  - variant: default | destructive
- Accessibility
  - Role set to alert; ensure sufficient color contrast.

```mermaid
classDiagram
class Alert {
+variant : "default|destructive"
}
class AlertTitle
class AlertDescription
Alert <|-- AlertTitle
Alert <|-- AlertDescription
```

**Diagram sources**
- [alert.tsx:22-59](file://components/ui/alert.tsx#L22-L59)

**Section sources**
- [alert.tsx:1-60](file://components/ui/alert.tsx#L1-L60)

### Toast
- Composition
  - Provider, Viewport, Root, Action, Close, Title, Description
- States and Animations
  - Open/close animations; swipe-to-dismiss; destructive variant styling.

```mermaid
sequenceDiagram
participant App as "App"
participant Prov as "ToastProvider"
participant View as "Viewport"
participant Toast as "Toast"
App->>Prov : Create toast
Prov->>View : Render toast
View->>Toast : Show with animation
Toast->>View : Dismiss after timeout or swipe
```

**Diagram sources**
- [toast.tsx:10-56](file://components/ui/toast.tsx#L10-L56)

**Section sources**
- [toast.tsx:1-130](file://components/ui/toast.tsx#L1-L130)

### Skeleton
- Props
  - Standard HTML div attributes.
- Animation
  - Pulse animation for loading placeholders.

```mermaid
flowchart TD
Start(["Render Skeleton"]) --> Pulse["Apply pulse animation"]
Pulse --> End(["Visual loading indicator"])
```

**Diagram sources**
- [skeleton.tsx:3-15](file://components/ui/skeleton.tsx#L3-L15)

**Section sources**
- [skeleton.tsx:1-16](file://components/ui/skeleton.tsx#L1-L16)

### Tooltip
- Composition
  - Provider, Root, Trigger, Content
- States and Animations
  - Directional slide and fade transitions; sideOffset configurable.

```mermaid
sequenceDiagram
participant U as "User"
participant Trg as "Trigger"
participant Cnt as "Content"
U->>Trg : Hover/Focus
Trg->>Cnt : Show tooltip
U->>Trg : Leave
Trg->>Cnt : Hide tooltip
```

**Diagram sources**
- [tooltip.tsx:14-27](file://components/ui/tooltip.tsx#L14-L27)

**Section sources**
- [tooltip.tsx:1-31](file://components/ui/tooltip.tsx#L1-L31)

## Dependency Analysis
- Internal dependencies
  - All components import a shared cn utility for merging Tailwind classes.
  - Many components depend on Radix UI primitives for accessible behavior.
  - Form components integrate with react-hook-form for validation and messaging.
- External dependencies
  - @radix-ui/react-* for accessible primitives.
  - lucide-react for icons.
  - class-variance-authority for variant/state styling.
  - react-hook-form for form composition.

```mermaid
graph LR
CN["cn (shared utility)"] --> Btn["Button"]
CN --> Inp["Input"]
CN --> Card["Card"]
CN --> Dlg["Dialog"]
CN --> Sel["Select"]
CN --> Tabs["Tabs"]
CN --> Bad["Badge"]
CN --> Ava["Avatar"]
CN --> Sw["Switch"]
CN --> Tab["Table"]
CN --> A["Alert"]
CN --> Ts["Toast"]
CN --> Sk["Skeleton"]
CN --> TT["Tooltip"]
RUI["@radix-ui/react-*"] --> Dlg
RUI --> Sel
RUI --> Tabs
RUI --> Ava
RUI --> Sw
RUI --> TT
RUI --> Ts
LUC["@lucide/react icons"] --> Dlg
LUC --> Sel
LUC --> Ts
LUC --> TT
CVA["class-variance-authority"] --> Btn
CVA --> Bad
CVA --> A
CVA --> Sw
CVA --> Ts
RH["react-hook-form"] --> Frm["Form"]
```

**Diagram sources**
- [button.tsx:1-5](file://components/ui/button.tsx#L1-L5)
- [input.tsx:1-3](file://components/ui/input.tsx#L1-L3)
- [card.tsx:1-3](file://components/ui/card.tsx#L1-L3)
- [dialog.tsx:1-7](file://components/ui/dialog.tsx#L1-L7)
- [select.tsx:1-7](file://components/ui/select.tsx#L1-L7)
- [tabs.tsx:1-6](file://components/ui/tabs.tsx#L1-L6)
- [badge.tsx:1-4](file://components/ui/badge.tsx#L1-L4)
- [avatar.tsx:1-6](file://components/ui/avatar.tsx#L1-L6)
- [switch.tsx:1-6](file://components/ui/switch.tsx#L1-L6)
- [table.tsx:1-3](file://components/ui/table.tsx#L1-L3)
- [alert.tsx:1-4](file://components/ui/alert.tsx#L1-L4)
- [toast.tsx:1-8](file://components/ui/toast.tsx#L1-L8)
- [skeleton.tsx](file://components/ui/skeleton.tsx#L1)
- [tooltip.tsx:1-6](file://components/ui/tooltip.tsx#L1-L6)
- [form.tsx:1-16](file://components/ui/form.tsx#L1-L16)

**Section sources**
- [button.tsx:1-5](file://components/ui/button.tsx#L1-L5)
- [input.tsx:1-3](file://components/ui/input.tsx#L1-L3)
- [card.tsx:1-3](file://components/ui/card.tsx#L1-L3)
- [dialog.tsx:1-7](file://components/ui/dialog.tsx#L1-L7)
- [select.tsx:1-7](file://components/ui/select.tsx#L1-L7)
- [tabs.tsx:1-6](file://components/ui/tabs.tsx#L1-L6)
- [badge.tsx:1-4](file://components/ui/badge.tsx#L1-L4)
- [avatar.tsx:1-6](file://components/ui/avatar.tsx#L1-L6)
- [switch.tsx:1-6](file://components/ui/switch.tsx#L1-L6)
- [table.tsx:1-3](file://components/ui/table.tsx#L1-L3)
- [alert.tsx:1-4](file://components/ui/alert.tsx#L1-L4)
- [toast.tsx:1-8](file://components/ui/toast.tsx#L1-L8)
- [skeleton.tsx](file://components/ui/skeleton.tsx#L1)
- [tooltip.tsx:1-6](file://components/ui/tooltip.tsx#L1-L6)
- [form.tsx:1-16](file://components/ui/form.tsx#L1-L16)

## Performance Considerations
- Prefer variant props over ad-hoc Tailwind classes to keep the component API stable and minimize runtime class merging.
- Use Skeleton for async content to reduce layout shifts.
- Limit deep nesting in Dialog/Select/Tooltip to reduce DOM tree size.
- Avoid excessive re-renders by memoizing heavy props passed to form controls.
- Keep animations minimal; rely on data-state-driven transitions already present in overlays and toasts.

## Troubleshooting Guide
- Dialog does not close on Escape or click outside
  - Ensure the component is mounted client-side and the Root is properly initialized.
  - Verify Portal rendering and Overlay click-to-close behavior.
- Select scrolls unexpectedly
  - Confirm viewport sizing and popper positioning; adjust position prop if needed.
- Form label or error message not associated with input
  - Wrap the control in FormControl and pair FormLabel with the control’s id.
- Toast not dismissing
  - Check timeout configuration and swipe gesture handling; ensure Provider is present.
- Tooltip not visible
  - Confirm TooltipProvider is wrapping content and Trigger is used correctly.

**Section sources**
- [dialog.tsx:1-123](file://components/ui/dialog.tsx#L1-L123)
- [select.tsx:1-161](file://components/ui/select.tsx#L1-L161)
- [form.tsx:1-179](file://components/ui/form.tsx#L1-L179)
- [toast.tsx:1-130](file://components/ui/toast.tsx#L1-L130)
- [tooltip.tsx:1-31](file://components/ui/tooltip.tsx#L1-L31)

## Conclusion
Muse’s UI library combines accessible primitives from Radix UI, expressive styling via Tailwind and CVA, and robust form integration with react-hook-form. Components are designed for composability, customization, and predictable behavior across devices and assistive technologies.

## Appendices
- Theming and customization
  - Override default tokens by adjusting Tailwind theme colors and spacing; variants can be extended via CVA.
- Responsive design
  - Use responsive utilities (sm:, md:, lg:) on component props and container layouts.
- Accessibility checklist
  - Ensure labels, descriptions, and error messages are programmatically associated; provide keyboard navigation; maintain sufficient color contrast.
- Cross-browser compatibility
  - Test with latest Chrome, Firefox, Safari, and Edge; verify Radix UI polyfills if targeting older browsers.