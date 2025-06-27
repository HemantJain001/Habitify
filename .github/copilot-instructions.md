<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Next.js Project - Copilot Instructions

This is a Next.js application with the following setup:
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript 
- **Styling**: Tailwind CSS
- **Linting**: ESLint with Next.js configuration
- **Build Tool**: Turbopack for development

## Code Style Guidelines

### TypeScript
- Use strict TypeScript with proper type annotations
- Prefer interfaces over types for object definitions
- Use proper generic types for reusable components
- Always define props interfaces for React components

### React/Next.js
- Use functional components with hooks
- Follow Next.js App Router conventions (app directory structure)
- Use proper file naming: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- Implement proper SEO with metadata API
- Use Server Components by default, Client Components only when needed
- Prefer Server Actions for form submissions and data mutations

### Tailwind CSS
- Use Tailwind utility classes for styling
- Follow mobile-first responsive design patterns
- Use semantic class combinations
- Prefer Tailwind over custom CSS when possible
- Use the `cn()` utility function for conditional classes (if available)

### File Organization
- Keep components in `components/` directory
- Use proper folder structure: `app/` for routes, `lib/` for utilities
- Follow Next.js conventions for special files
- Use barrel exports (`index.ts`) for cleaner imports

### Performance
- Optimize images using Next.js Image component
- Implement proper loading states and error boundaries
- Use dynamic imports for code splitting when appropriate
- Follow React performance best practices

### Accessibility
- Use semantic HTML elements
- Implement proper ARIA labels and roles
- Ensure keyboard navigation support
- Test with screen readers in mind

When generating code:
1. Always use TypeScript with proper types
2. Follow Next.js 15+ App Router patterns
3. Use Tailwind CSS for styling
4. Implement proper error handling
5. Consider performance and accessibility
6. Write clean, maintainable, and well-documented code
