# EmberFest 2025 - WarpDrive Conference Talk Instructions

## 🚨 MANDATORY: Project Context and Guidelines

### Project Overview

This is a conference talk outline for **"WarpDrive: Set Data to Stun"** at EmberFest 2025. The talk demonstrates WarpDrive, a universal data framework, through building a TodoMVC application.

### Key Technologies and Standards

- **WarpDrive** - Universal data framework for ambitious web applications
- **JSON:API v1.1** - ALL API examples must be compliant with this specification
- **TypeScript** - Full type safety throughout examples
- **Modern Ember Polaris** - Latest Ember patterns and practices
- **Universal Architecture** - Shared data layer across multiple frameworks

### 🚨 CRITICAL REQUIREMENTS

#### 1. JSON:API Compliance

- **ALWAYS** use `application/vnd.api+json` content type
- **ALL** request/response examples must follow JSON:API v1.1 document structure
- Use proper resource objects with `type`, `id`, `attributes` structure
- Include top-level `data` wrapper for all payloads
- Resource types should be SINGULAR (e.g., `todo` not `todos`)

#### 2. Architecture Patterns

- **Shared Data Layer First** - Always show framework-agnostic code before framework-specific integration
- **Universal Compatibility** - Emphasize that WarpDrive works across Ember, React, Vue, Svelte
- **Schema-Driven Development** - Schemas define data structure, not classes
- **Request Builders** - Type-safe request construction in shared layer

#### 3. Code Organization

```
📦 shared-data-layer    ← Framework agnostic (show first)
├── 🌌 @warp-drive/core
├── 🛸 builders/
├── 🛸 handlers/
├── 📊 schemas/
└── 💿 store/

🚀 ember-app           ← Framework integration (show second)
└── @warp-drive/ember
```

#### 4. Star Trek Theme Consistency

- Use space/starship metaphors throughout
- Store = "Bridge" or "Mission Control"
- RequestManager = "Communications Officer"
- Data = "Sensors and Readings"
- Universal compatibility = "Separate the saucer section"
- Maintain engaging but professional tone

#### 5. Conference Talk Flow

1. **Simple Overview** → **Detailed Implementation** → **Advanced Patterns**
2. **Build TodoMVC step-by-step** to provide concrete context
3. **Add recap sections** between major chapters
4. **Demonstrate universal framework support**

#### 6. Code Examples Standards

- Always use **complete, runnable examples**
- Include proper **file paths** and **import statements**
- Show **TypeScript types** and **interfaces**
- Demonstrate **error handling** and **loading states**
- Use **meaningful variable names** and **clear comments**

#### 7. Audience Considerations

- Assume **Ember experience** but treat WarpDrive as new
- Explain **why** not just **how**
- DO NOT Show **migration path** from legacy EmberData data patterns
- Emphasize **developer experience** improvements
- Address **real-world concerns** (performance, maintainability, team adoption)

#### 8. Content Quality Standards

- **Accurate technical details** (verify with WarpDrive docs when uncertain)
- **Consistent terminology** throughout
- **Clear section transitions** with recaps
- **Actionable takeaways** for attendees

### Documentation References

- **WarpDrive**: docs.warp-drive.io
- **JSON:API**: https://jsonapi.org/format/
- **Ember Polaris**: Latest Ember patterns
- **TypeScript**: Full type safety approach

### Talk Goals

1. **Introduce WarpDrive** as the future of data management
2. **Demonstrate universal compatibility** across frameworks
3. **Show practical implementation** through TodoMVC
4. **Inspire adoption** with clear benefits and migration path
5. **Position as evolution** from traditional data libraries

### Success Metrics

- Attendees understand WarpDrive's universal value proposition
- Practical knowledge to start experimenting immediately
- Excitement about framework-agnostic data management

---

**Remember**: This talk represents the future of data management in ambitious web applications. Every example should reinforce WarpDrive's core promise of universal compatibility, type safety, and exceptional developer experience.
