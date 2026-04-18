# Design Document

## High-Level Design

### System Architecture

The frontend-pages-expansion feature extends the existing CodeCollab Next.js application with 10 new pages. The architecture follows Next.js 15 App Router conventions with a component-based structure that maximizes reusability while maintaining strict design system consistency.

```
CodeCollab Application
├── Existing Components (Reused)
│   ├── Header (Navigation)
│   ├── Footer (Links & Social)
│   ├── ProjectCard (Project Display)
│   ├── Hero (Page Headers)
│   └── Design System Utilities
│
├── New Shared Components
│   ├── PageLayout (Wrapper with Grid Background)
│   ├── Sidebar (Navigation for Docs/Settings)
│   ├── CodeBlock (Syntax Highlighted Code)
│   ├── FormInput (Styled Input Fields)
│   └── ContentContainer (Max-width wrapper)
│
└── New Pages
    ├── Dashboard (/dashboard)
    ├── IDE/Editor (/ide or /project/[id])
    ├── Pricing (/pricing)
    ├── Features (/features)
    ├── Documentation (/docs)
    ├── About (/about)
    ├── Contact (/contact)
    ├── Settings (/settings)
    ├── Privacy Policy (/privacy)
    └── Terms of Service (/terms)
```

### Component Hierarchy

```
Page Component
└── PageLayout (Grid Background + Padding)
    ├── Header (Fixed Navigation)
    ├── Main Content Area
    │   ├── Page-Specific Components
    │   └── Reusable UI Components
    └── Footer (Links & Copyright)
```

### Routing Structure

Following Next.js App Router conventions:

```
frontend/app/
├── page.tsx (Home - Already exists)
├── signin/page.tsx (Already exists)
├── signup/page.tsx (Already exists)
├── dashboard/page.tsx (NEW)
├── ide/page.tsx (NEW - Simple IDE)
├── project/[id]/page.tsx (NEW - Project-specific IDE)
├── pricing/page.tsx (NEW)
├── features/page.tsx (NEW)
├── docs/page.tsx (NEW)
├── about/page.tsx (NEW)
├── contact/page.tsx (NEW)
├── settings/page.tsx (NEW)
├── privacy/page.tsx (NEW)
└── terms/page.tsx (NEW)
```

### Data Flow

#### Static Pages (No External Data)
- Features, About, Contact, Privacy, Terms
- Pure presentational components
- No state management needed

#### Dynamic Pages (Client State)
- Dashboard: Display mock project data (future: fetch from API)
- Settings: Form state management with local state
- Contact: Form state for validation and submission

#### Complex Pages (Multiple Concerns)
- IDE/Editor: File tree state, editor content, terminal output, collaborators
- Documentation: Sidebar navigation state, content sections

### Design System Patterns

All pages follow these consistent patterns:

1. **Grid Background**: Applied via PageLayout wrapper
2. **Sharp Corners**: Zero border-radius on all elements
3. **Color Palette**:
   - Background: `bg-black`
   - Cards: `bg-white/[0.02]`
   - Inputs: `bg-white/5`
   - Borders: `border-white/10` (subtle), `border-blue-500/30` (accent)
   - Text: `text-white` (primary), `text-gray-400` (secondary)
   - Accent: `text-blue-500`, `bg-blue-500`
4. **Typography**:
   - UI Text: Inter font
   - Code: JetBrains Mono font
   - Labels: `uppercase tracking-wider`
5. **Animations**:
   - Beam animation on borders
   - Shimmer effect on buttons
   - Hover transitions

## Low-Level Design

### Component Interfaces

#### PageLayout Component

```typescript
interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-black ${className}`}>
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `
              linear-gradient(to right, #3b82f6 1px, transparent 1px),
              linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>
      <Header />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
```

#### Sidebar Component

```typescript
interface SidebarItem {
  label: string;
  href: string;
  active?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
}

export default function Sidebar({ items, title }: SidebarProps) {
  // Renders vertical navigation with active state highlighting
}
```

#### CodeBlock Component

```typescript
interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({ 
  code, 
  language = "typescript", 
  showLineNumbers = true 
}: CodeBlockProps) {
  // Renders code with JetBrains Mono font and syntax highlighting
}
```

#### FormInput Component

```typescript
interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function FormInput({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange,
  required = false 
}: FormInputProps) {
  // Renders styled input with label following design system
}
```

### Page Implementations

#### Dashboard Page Structure

```typescript
// frontend/app/dashboard/page.tsx
export default function Dashboard() {
  const projects = [
    { id: 1, name: "E-Commerce Platform", lastModified: "2 hours ago", collaborators: 3 },
    { id: 2, name: "Mobile App Backend", lastModified: "1 day ago", collaborators: 5 },
    // ... more mock projects
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">
              YOUR WORKSPACE
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your projects and collaborations
            </p>
          </div>
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all relative overflow-hidden group">
            <span className="relative z-10">+ NEW PROJECT</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
```

#### IDE/Editor Page Structure

```typescript
// frontend/app/ide/page.tsx
export default function IDE() {
  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <span className="text-white font-bold">PROJECT_NAME</span>
          <div className="flex items-center gap-2">
            {/* Collaborator avatars */}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-500 text-white text-xs font-bold uppercase">
            SHARE
          </button>
        </div>
      </div>

      {/* Main IDE Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        <div className="w-64 border-r border-white/10 bg-white/[0.02] p-4">
          {/* File tree component */}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2">
            {/* File tabs */}
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-black p-4 font-mono text-sm">
            {/* Monaco editor or textarea with syntax highlighting */}
          </div>

          {/* Terminal */}
          <div className="h-48 border-t border-white/10 bg-white/[0.02] p-4 font-mono text-xs">
            {/* Terminal output */}
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### Pricing Page Structure

```typescript
// frontend/app/pricing/page.tsx
export default function Pricing() {
  const plans = [
    {
      name: "STARTER",
      price: "$0",
      features: ["1 Project", "2 Collaborators", "Basic Support"],
      cta: "GET STARTED"
    },
    {
      name: "PRO",
      price: "$29",
      features: ["Unlimited Projects", "10 Collaborators", "Priority Support", "Advanced Analytics"],
      cta: "START FREE TRIAL",
      recommended: true
    },
    {
      name: "ENTERPRISE",
      price: "Custom",
      features: ["Unlimited Everything", "Dedicated Support", "Custom Integrations", "SLA"],
      cta: "CONTACT SALES"
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-white mb-4 uppercase tracking-tight">
            SIMPLE PRICING
          </h1>
          <p className="text-gray-400 text-lg">
            Choose the plan that fits your team
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {plans.map(plan => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-24">
          <h2 className="text-3xl font-black text-white mb-8 uppercase">
            FEATURE COMPARISON
          </h2>
          {/* Comparison table */}
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-black text-white mb-8 uppercase">
            FREQUENTLY ASKED
          </h2>
          {/* FAQ items */}
        </div>
      </div>
    </PageLayout>
  );
}
```

#### Features Page Structure

```typescript
// frontend/app/features/page.tsx
export default function Features() {
  const features = [
    {
      icon: "...",
      title: "REAL-TIME COLLABORATION",
      description: "Code together with your team in real-time...",
      details: ["Instant sync", "Cursor tracking", "Live edits"]
    },
    // ... more features
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Hero */}
        <div className="text-center mb-24">
          <h1 className="text-6xl font-black text-white mb-4 uppercase tracking-tight">
            POWERFUL FEATURES
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need for modern collaborative development
          </p>
        </div>

        {/* Feature Sections */}
        {features.map((feature, index) => (
          <FeatureSection key={index} {...feature} reverse={index % 2 === 1} />
        ))}
      </div>
    </PageLayout>
  );
}
```

#### Documentation Page Structure

```typescript
// frontend/app/docs/page.tsx
export default function Documentation() {
  const sections = [
    { label: "Getting Started", href: "#getting-started" },
    { label: "API Reference", href: "#api-reference" },
    { label: "Integrations", href: "#integrations" },
    { label: "CLI Tools", href: "#cli-tools" }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-24 flex gap-12">
        {/* Sidebar */}
        <Sidebar items={sections} title="DOCUMENTATION" />

        {/* Content */}
        <div className="flex-1 max-w-3xl">
          <h1 className="text-5xl font-black text-white mb-8 uppercase tracking-tight">
            DOCUMENTATION
          </h1>

          {/* Getting Started Section */}
          <section id="getting-started" className="mb-16">
            <h2 className="text-3xl font-black text-white mb-4 uppercase">
              GETTING STARTED
            </h2>
            <p className="text-gray-400 mb-6">
              Quick start guide to get you up and running...
            </p>
            <CodeBlock code="npm install codecollab-cli" language="bash" />
          </section>

          {/* More sections */}
        </div>
      </div>
    </PageLayout>
  );
}
```

#### Settings Page Structure

```typescript
// frontend/app/settings/page.tsx
"use client";

import { useState } from "react";

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex@codecollab.io"
  });

  const sections = [
    { label: "Profile", href: "#profile", active: true },
    { label: "Security", href: "#security" },
    { label: "Notifications", href: "#notifications" },
    { label: "Billing", href: "#billing" }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-24 flex gap-12">
        {/* Sidebar */}
        <Sidebar items={sections} title="SETTINGS" />

        {/* Content */}
        <div className="flex-1 max-w-2xl">
          <h1 className="text-5xl font-black text-white mb-12 uppercase tracking-tight">
            ACCOUNT SETTINGS
          </h1>

          {/* Profile Section */}
          <section id="profile" className="mb-12">
            <h2 className="text-2xl font-black text-white mb-6 uppercase">
              PROFILE
            </h2>
            <div className="space-y-6">
              <FormInput 
                label="NAME" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
              <FormInput 
                label="EMAIL" 
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
              <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-wider transition-all">
                SAVE CHANGES
              </button>
            </div>
          </section>

          {/* More sections */}
        </div>
      </div>
    </PageLayout>
  );
}
```

#### Legal Pages Structure (Privacy & Terms)

```typescript
// frontend/app/privacy/page.tsx
export default function Privacy() {
  const sections = [
    { title: "Information We Collect", id: "collection" },
    { title: "How We Use Your Information", id: "usage" },
    { title: "Data Security", id: "security" },
    { title: "Your Rights", id: "rights" }
  ];

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-4 uppercase tracking-tight">
            PRIVACY POLICY
          </h1>
          <p className="text-gray-400 text-sm">
            Last updated: April 16, 2026
          </p>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 p-6 bg-white/[0.02] border border-white/10">
          <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
            TABLE OF CONTENTS
          </h2>
          <ul className="space-y-2">
            {sections.map(section => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-blue-500 hover:text-blue-400 text-sm">
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Sections */}
        {sections.map(section => (
          <section key={section.id} id={section.id} className="mb-12">
            <h2 className="text-2xl font-black text-white mb-4 uppercase">
              {section.title}
            </h2>
            <div className="text-gray-400 leading-relaxed space-y-4">
              {/* Legal content */}
            </div>
          </section>
        ))}
      </div>
    </PageLayout>
  );
}
```

### File Structure

```
frontend/
├── app/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── ide/
│   │   └── page.tsx
│   ├── project/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── pricing/
│   │   └── page.tsx
│   ├── features/
│   │   └── page.tsx
│   ├── docs/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   └── terms/
│       └── page.tsx
│
└── components/
    ├── PageLayout.tsx (NEW)
    ├── Sidebar.tsx (NEW)
    ├── CodeBlock.tsx (NEW)
    ├── FormInput.tsx (NEW)
    ├── ContentContainer.tsx (NEW)
    ├── PricingCard.tsx (NEW)
    ├── FeatureSection.tsx (NEW)
    ├── Header.tsx (EXISTS)
    ├── Footer.tsx (EXISTS)
    └── ProjectCard.tsx (EXISTS)
```

### State Management

For this phase, we use React's built-in state management:

- **useState**: For form inputs, toggles, and local UI state
- **No external state library needed**: Pages are mostly static or use local state
- **Future consideration**: Add Zustand or Context API when adding real API integration

### Styling Conventions

All components follow these Tailwind CSS patterns:

```typescript
// Backgrounds
className="bg-black"                    // Page background
className="bg-white/[0.02]"            // Card background
className="bg-white/5"                 // Input background
className="bg-blue-500"                // Primary button

// Borders
className="border border-white/10"     // Subtle border
className="border border-blue-500/30"  // Accent border
className="border-t border-white/10"   // Top border only

// Text
className="text-white"                 // Primary text
className="text-gray-400"              // Secondary text
className="text-blue-500"              // Accent text
className="uppercase tracking-wider"   // Labels

// Spacing
className="px-6 py-3"                  // Button padding
className="p-6"                        // Card padding
className="gap-6"                      // Grid gap
className="mb-12"                      // Section margin

// Transitions
className="transition-all"             // Smooth transitions
className="hover:bg-blue-600"          // Hover states
```

### Responsive Breakpoints

```typescript
// Mobile first approach
className="grid-cols-1"                // Mobile: 1 column
className="md:grid-cols-2"             // Tablet: 2 columns
className="lg:grid-cols-3"             // Desktop: 3 columns

// Hide/show elements
className="hidden md:block"            // Hide on mobile
className="block md:hidden"            // Show only on mobile
```

## Implementation Notes

1. **Start with shared components**: Build PageLayout, Sidebar, FormInput, CodeBlock first
2. **Then build simple pages**: About, Contact, Privacy, Terms (mostly static content)
3. **Then build complex pages**: Dashboard, Features, Pricing (with more components)
4. **Finally build IDE**: Most complex page with multiple panels and state
5. **Update Header navigation**: Add links to new pages
6. **Update Footer**: Add links to legal pages
7. **Test responsive layouts**: Verify all pages work on mobile/tablet/desktop
8. **Add loading states**: Consider adding skeleton loaders for future API integration
