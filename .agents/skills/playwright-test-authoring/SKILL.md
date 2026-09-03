---
name: playwright-test-authoring
description: Write or refactor TypeScript Playwright tests using auto-waiting, role and label locators, web-first assertions, fixtures, and Page Objects — and diagnose flaky tests. Use when writing, reviewing, or debugging Playwright specs in this repo.
---

# Playwright test authoring (TypeScript)

## Commands

```bash
npx playwright test                      # full suite, all projects
npx playwright test --project=chromium   # fastest feedback loop
npx playwright test -g "Deleting"        # filter by title
npx playwright test --ui                 # UI mode for debugging
npx playwright show-report               # last HTML report
npx playwright show-trace <trace.zip>    # inspect a recorded trace
npx eslint . && npx tsc --noEmit         # lint and type-check before calling it done
```

Never report a suite as passing without having run it and seen it pass.

## Locators, in strict order

Playwright locators are lazy handles that re-resolve on every use, so they never go stale.

1. `getByRole('textbox', { name: 'What needs to be done?' })` — accessibility role plus accessible name. Always first: it matches how a real user and a screen reader find the element, so it doubles as an accessibility check.
2. `getByLabel('Email')` — labelled form controls.
3. `getByPlaceholder` / `getByText` / `getByTitle` / `getByAltText`.
4. `getByTestId('todo-title')` — elements with no meaningful role or accessible name. Correct, not a compromise.
5. CSS — only when nothing above works; say why in a comment.
6. XPath — effectively never. Absolute XPath — never.

Chain and filter instead of indexing:

```ts
const item = page.getByTestId('todo-item').filter({ hasText: 'Buy Milk!' });
await item.getByRole('checkbox').check();
```

Use `.nth(0)` only when position is what is under test.

## Auto-waiting

Every action waits for the element to be attached, visible, stable, enabled, and able to receive events. Every `expect(locator)` assertion retries until it passes or times out.

```ts
// good — retries until true or times out
await expect(page.getByTestId('todo-title')).toHaveText(['Buy Milk!']);

// bad — a snapshot that cannot retry
expect(await page.getByTestId('todo-title').textContent()).toBe('Buy Milk!');
```

Wait on conditions, never on durations: `page.waitForURL(...)`, `page.waitForResponse('**/api/*')`. No `waitForTimeout`, no sleeps, no polling loops, no `try/catch` around actions, no `click({ force: true })` to push past a failing actionability check — that failure is the finding.

## Structure

- One `test(...)` per behavior; the title reads as a sentence about the app.
- Group phases with `await test.step('...')` so the report and trace read like a script.
- Shared setup in a fixture (`test.extend`) or a typed helper; prefer fixtures when the setup produces a value the test needs.
- Page Object — a class with locators as fields and user actions as methods — once a flow is reused about three times or a test exceeds ~30 lines.
- Type everything: `Page`, `Locator`, typed data. No `any`.
- Order-independent and parallel-safe; no shared mutable module state.

## Known defects

Assert the **correct** behavior. Where the app is wrong, write the assertion for what should happen and mark it `test.fail()` with a comment naming the defect. A `test.fail()` with no documented defect behind it is hiding a bug.

## Flake

A flaky test passes and fails on the same code — treat it as a real defect:

1. Confirm the rate: `npx playwright test -g "<title>" --repeat-each=20 --project=chromium`.
2. Open the trace from a failing run; find the action that behaved differently.
3. Classify: timing not covered by auto-wait, shared state, non-determinism (dates, random, ordering), animation, or a genuine app race.
4. Fix the cause. Retries are never the fix.
5. Re-run 20–50 times to prove it.

## Repo context

`playwright.config.ts` — `testDir: ./tests`, `fullyParallel: true`, HTML reporter, `trace: 'on-first-retry'`, projects for chromium, firefox, and webkit. `playwright.service.config.ts` targets Azure Playwright Workspaces. CI is `.github/workflows/playwright.yml`. The app under test is the hosted TodoMVC demo, which stores state in localStorage and cannot be fixed from this repo — app problems become reports, not patches.
