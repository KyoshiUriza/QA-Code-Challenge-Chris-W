import { test, expect } from './fixtures/todo-fixtures';
import { TODO, TODO_2, TODO_3 } from './data/todo-data';

test.describe('Filtering', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.addTodos(TODO, TODO_2, TODO_3);
    await todoPage.complete(TODO_2);
  });

  test('Active shows only unfinished todos', async ({ todoPage }) => {
    await todoPage.filterBy('Active');

    await todoPage.expectTitles([TODO, TODO_3]);
    await expect(todoPage.page).toHaveURL(/#\/active$/);
  });

  test('Completed shows only finished todos', async ({ todoPage }) => {
    await todoPage.filterBy('Completed');

    await todoPage.expectTitles([TODO_2]);
    await expect(todoPage.page).toHaveURL(/#\/completed$/);
  });

  test('All shows everything again', async ({ todoPage }) => {
    await todoPage.filterBy('Active');
    await todoPage.filterBy('All');

    await todoPage.expectTitles([TODO, TODO_2, TODO_3]);
  });

  test('the selected filter is highlighted', async ({ todoPage }) => {
    await todoPage.filterBy('Active');

    await expect(todoPage.activeFilter).toHaveClass(/selected/);
    await expect(todoPage.completedFilter).not.toHaveClass(/selected/);
  });

  test('the counter always counts every active todo, not just visible ones', async ({ todoPage }) => {
    await todoPage.filterBy('Completed');

    await todoPage.expectCounter('2 items left');
  });

  test('completing a todo removes it from the Active view', async ({ todoPage }) => {
    await todoPage.filterBy('Active');

    // Click rather than check(): the row leaves the Active view as soon as it
    // is completed, so there is no checkbox left for check() to verify.
    await todoPage.toggleFor(TODO).click();

    await todoPage.expectTitles([TODO_3]);
  });

  test('a filtered URL restores that filter on reload', async ({ todoPage }) => {
    await todoPage.filterBy('Completed');

    await todoPage.page.reload();

    await expect(todoPage.completedFilter).toHaveClass(/selected/);
    await todoPage.expectTitles([TODO_2]);
  });
});
