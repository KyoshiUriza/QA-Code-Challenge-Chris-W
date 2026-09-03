import { test as base } from '@playwright/test';
import { TodoPage } from '../pages/todo-page';

/**
 * A fixture is setup Playwright runs for a test and hands to it as an argument.
 * Every spec imports `test` from here, so no test repeats the navigation step
 * and every test starts on a freshly loaded, empty app.
 */
export const test = base.extend<{ todoPage: TodoPage }>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  },
});

export { expect } from '@playwright/test';
export { TodoPage } from '../pages/todo-page';
