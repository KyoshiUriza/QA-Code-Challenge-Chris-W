---
description: "QA conventions for this repo and which skill or subagent to use for each kind of QA work"
trigger: model_decision
---

This is a QA repo: a TypeScript Playwright suite against the hosted TodoMVC demo. The app under test is third-party, so application defects are reported, never patched here.

Use the matching skill instead of improvising:

- What to test, or test cases for a feature → `writing-test-cases`
- Boundary, Unicode, timing, or negative input coverage → `edge-case-design`
- Suite layout, naming, fixtures, test levels, CI tiers → `designing-test-suites`
- Unscripted hunting for unknown problems → `exploratory-testing`
- Writing or triaging a defect → `writing-bug-reports`
- Keyboard, focus, contrast, screen-reader concerns → `accessibility-testing`
- Writing, reviewing, or debugging Playwright specs → `playwright-test-authoring`

Delegate larger pieces of work to the subagents in `.devin/agents/`: `qa-manual-engineer` for test design, exploration, and defect reporting; `qa-automation-engineer` for spec authoring, refactors, and flake diagnosis. They review each other's output — manual decides what matters to a user, automation decides what a test can reliably assert.

Two rules apply to all QA work here:

1. Plain English by default. Use a QA or Playwright term of art when it is the right word, and define it inline the first time it appears in a response.
2. Assert correct behavior, never the app's current buggy behavior. Where the app is wrong, write the assertion for what should happen, mark it `test.fail()`, and document the defect. Never `waitForTimeout`, never `force: true`, never a retry in place of a diagnosis.

Read `Notes.md` before reporting a finding — extend the existing entry rather than filing a duplicate.
