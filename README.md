# GenUI Playground

A generative UI application that creates React components dynamically from natural language. Describe what you need, and the AI builds it live.

---

## The Problem

Building user interfaces is slow. Every new screen, every variant, every design iteration requires a developer to manually write code. This creates bottlenecks:

- Designers can't experiment without developer involvement
- Prototyping takes hours instead of minutes
- Users can't customize interfaces to their preferences
- Static UIs force everyone into the same workflow

## The Solution

GenUI Playground flips this model. Instead of writing components, you describe them:

> "Create a pricing card with three tiers"

The AI generates a working React component, renders it live, and lets you refine it through conversation:

> "Make the middle tier stand out more"
> "Change the color scheme to purple"
> "Add a comparison table below"

The interface adapts to the user, not the other way around.

---

## Features

### Live Component Generation

Describe any UI element and watch it render in real-time. The AI generates complete React components with Tailwind CSS styling, then executes them directly in the browser using react-live.

Components are not templates or pre-built blocks. They're generated fresh based on your specific requirements.

### Interactive Customization

Generated components can include live controls for tweaking properties without regenerating. Users can adjust:

- Primary and secondary colors via preset swatches
- Layout density (compact, detailed, minimal)
- Typography scale
- Border radius styling

These controls work two ways: click to change, or tell the AI "make it more compact" and watch it update.

### AI-Generated Images

When a component needs visuals, the AI can generate them. Request a travel card for Paris and it creates both the component and a destination image to match.

Images are stored server-side and referenced by short URLs, keeping the AI context clean and responsive.

### Component Variations

Ask for "different approaches" or "multiple options" and the system generates several distinct designs side-by-side. Compare a minimal card against a detailed one. Pick your favorite or ask for refinements.

---

## How It Works

The application combines three technologies:

**Tambo SDK** handles the AI orchestration. It decides which component to render based on the conversation, manages streaming props, and coordinates tool execution. Components register with schemas that tell the AI what props they accept.

**react-live** enables runtime rendering. Generated code executes in the browser without a build step. Users see working components, not static previews.

**Gemini API** provides image generation. When visuals are needed, a Tambo tool calls Gemini, stores the result, and passes a reference to the component.

### Architecture

```
User prompt
    │
    ▼
┌─────────────────────────────────────────────────┐
│  Tambo SDK                                      │
│  - Selects component (Generated, Interactive,  │
│    or Comparison)                               │
│  - Generates props from natural language        │
│  - Executes tools (image generation)            │
└─────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────┐
│  Component Layer                                │
│  - GeneratedComponent: Basic live preview       │
│  - InteractiveGeneratedComponent: With controls │
│  - ComponentComparison: Multiple variations     │
└─────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────┐
│  react-live                                     │
│  - Parses generated JSX                         │
│  - Executes in sandboxed environment            │
│  - Renders live preview                         │
└─────────────────────────────────────────────────┘
```

---

## Tambo Features Used

This project demonstrates several Tambo SDK capabilities:

| Feature | Usage |
|---------|-------|
| Component Registration | Three component types with detailed schemas and AI-friendly descriptions |
| Props Streaming | Generated code streams in progressively as the AI writes |
| useTamboComponentState | Interactive component properties sync with AI-driven updates |
| Tools | Image generation tool with schema validation |
| TamboProvider | Central configuration with components and tools |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Tambo API key from [tambo.co/dashboard](https://tambo.co/dashboard)
- Gemini API key (optional, for image generation)

### Installation

Clone the repository:

```bash
git clone https://github.com/mutaician/genui-playground.git
cd genui-playground
npm install
```

Create `.env.local` in the project root:

```
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_key
GEMINI_API_KEY=your_gemini_key
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000/chat](http://localhost:3000/chat) to start generating components.

---

## Example Prompts

**Simple components:**
- "Create a user profile card with avatar, name, and bio"
- "Build a notification banner with dismiss button"
- "Make a stats dashboard with three metrics"

**Interactive components:**
- "Create a customizable product card"
- "Build an interactive pricing table I can tweak"

**With images:**
- "Create a travel booking card for Tokyo with a destination image"
- "Build a recipe card with a food photo"

**Variations:**
- "Show me three different styles for a login form"
- "Compare minimal vs detailed approaches for a task list"

---

## Project Structure

```
src/
├── app/
│   ├── chat/page.tsx          # Main chat interface
│   ├── api/generate-image/    # Image generation endpoint
│   └── page.tsx               # Landing page
├── components/
│   └── genui/
│       ├── GeneratedComponent.tsx
│       ├── InteractiveGeneratedComponent.tsx
│       ├── ComponentComparison.tsx
│       └── CodePreview.tsx
└── lib/
    ├── tambo.ts               # Component and tool registration
    └── image-tools.ts         # Image generation tool
```

---

## Technical Notes

**Why react-live?** It enables true runtime execution of generated code. The AI outputs JSX strings that become real React components without preprocessing.

**Why store images server-side?** The Gemini API returns base64-encoded images. Sending these back through the AI context would overflow it. Instead, we store images with short IDs and pass just the reference.

**Why useTamboComponentState?** It creates bidirectional binding between UI controls and AI commands. The user can click a color swatch OR say "change to blue" and both work.

---

## Built With

- [Next.js 15](https://nextjs.org/) - React framework
- [Tambo SDK](https://tambo.co/) - Generative UI orchestration
- [react-live](https://github.com/FormidableLabs/react-live) - Live code editor and preview
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Gemini API](https://ai.google.dev/) - Image generation

---

## License

MIT
