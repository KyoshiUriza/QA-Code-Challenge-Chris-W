# QA sub-agent team

Two Claude Code sub-agents that cover the QA process for this repo: one who decides what to test and one who automates it. Each is an expert in their own lane, and each reviews the other's output.

| Agent | Lane | Invoke for |
|---|---|---|
| **[qa-manual-engineer](qa-manual-engineer.md)** | Test thinking | Test plans and test cases, exploratory sessions, bug reports, risk and accessibility analysis, release-readiness calls |
| **[qa-automation-engineer](qa-automation-engineer.md)** | Test code | TypeScript + Playwright specs, locators, fixtures and Page Objects, flake diagnosis, CI and config changes |

Claude Code invokes them automatically when a request matches their `description` (both are marked "Use PROACTIVELY"), or you can name one directly:

> "Have the qa-manual-engineer design boundary cases for the edit-todo flow."
> "Ask the qa-automation-engineer to automate TC-EDIT-03 and TC-EDIT-04."

## Running them at the same time

The two agents are independent for their *own* work, so give both a task in one message and they run in parallel — for example, manual explores the edit flow while automation refactors locators into a Page Object.

They are **not** independent when one is reviewing the other: a review needs the thing being reviewed to exist first. Sequence those.

Safe to parallelize:
- Both authoring in different areas (manual writes cases for filters, automation writes specs for delete).
- Both reviewing the same third artifact (a PR, a new feature).
- Multiple exploratory charters at once.

Sequence instead:
- Author → review → revise on the same artifact.
- Two agents editing the same file. Split the file or take turns; concurrent edits to one spec collide.

## The review loop

```
qa-manual-engineer   → test cases, charters, bug reports
   ↓
qa-automation-engineer → reviews for automatability, precision, duplication, right test level
   ↓                     then automates the agreed cases in TypeScript + Playwright
qa-manual-engineer   → reviews the specs and the run results for wrong expected results,
                       coverage gaps, weak assertions, undocumented test.fail()
   ↓
whoever owns the finding revises; disagreements are surfaced to the user, not averaged away
```

Two tie-breakers keep reviews from stalling:

1. On **what matters to a user** — coverage, severity, whether a behavior is a defect — qa-manual-engineer decides.
2. On **what a test can reliably assert** — locators, waiting, determinism, test level — qa-automation-engineer decides.

If the disagreement is outside both (a product decision, a deadline trade-off), they state both positions and hand it to the user rather than picking one.

## Two rules both agents follow

1. **Plain English by default.** QA and Playwright terms of art are used when they are the right word, and defined inline the first time they appear in a response. No unexplained acronyms.
2. **Assert correct behavior, never current behavior.** When the app is wrong, the test says what *should* happen and the defect is written up. A `test.fail()` without a documented defect behind it is not allowed.

## Project context both agents share

- System under test: the public TodoMVC demo at `https://demo.playwright.dev/todomvc/#/`. No backend; state lives in browser localStorage. The app cannot be fixed from this repo, so app problems become reports, not patches.
- Stack: TypeScript, `@playwright/test`, ESLint with `eslint-plugin-playwright`. Config in `playwright.config.ts` (chromium, firefox, webkit; `fullyParallel: true`; trace on first retry). CI in `.github/workflows/playwright.yml`.
- Existing coverage: `tests/ToDos Demo Page.spec.ts`. Existing manual findings: `Notes.md` — read it before reporting anything as new.

## Editing the team

Each file's frontmatter:
- `name` — kebab-case, matches the filename.
- `description` — the invocation heuristic; be specific about triggers and about what *not* to invoke it for.
- `tools` — comma-separated Claude Code tools the agent may use.
- Optional `model:` to override the default.

Add a `.md` here to add a role; delete one to retire it.
