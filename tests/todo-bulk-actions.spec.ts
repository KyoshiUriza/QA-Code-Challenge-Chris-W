import { test, expect } from './fixtures/todo-fixtures';
import { TODO, TODO_2, TODO_3 } from './data/todo-data';

/**
 * The toggle-all control and Clear completed. Notes.md flags the toggle-all
 * chevron as unlabeled to the eye; these tests cover what it actually does.
 */
test.describe('Bulk actions', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.addTodos(TODO, TODO_2, TODO_3);
  });

  test('toggle-all completes every todo', async ({ todoPage }) => {
    await todoPage.toggleAll.check();

    await todoPage.expectCounter('0 items left');
    for (const title of [TODO, TODO_2, TODO_3]) {
      await todoPage.expectCompleted(title);
    }
  });

  test('toggle-all reopens every todo when unchecked', async ({ todoPage }) => {
    await todoPage.toggleAll.check();
    await todoPage.toggleAll.uncheck();

    await todoPage.expectCounter('3 items left');
    await todoPage.expectCompleted(TODO, false);
  });

  test('toggle-all becomes checked once the last todo is completed one by one', async ({ todoPage }) => {
    for (const title of [TODO, TODO_2, TODO_3]) {
      await todoPage.complete(title);
    }

    await expect(todoPage.toggleAll).toBeChecked();
  });

  test('reopening one todo unchecks toggle-all', async ({ todoPage }) => {
    await todoPage.toggleAll.check();

    await todoPage.reopen(TODO_2);

    await expect(todoPage.toggleAll).not.toBeChecked();
  });

  test('Clear completed removes finished todos and keeps the rest', async ({ todoPage }) => {
    await todoPage.complete(TODO_2);

    await todoPage.clearCompletedTodos();

    await todoPage.expectTitles([TODO, TODO_3]);
    await expect(todoPage.clearCompleted).toBeHidden();
  });

  test('Clear completed is hidden while nothing is completed', async ({ todoPage }) => {
    await expect(todoPage.clearCompleted).toBeHidden();
  });

  test('clearing every completed todo empties the list and hides the footer', async ({ todoPage }) => {
    await todoPage.toggleAll.check();

    await todoPage.clearCompletedTodos();

    await expect(todoPage.todoItems).toHaveCount(0);
    await expect(todoPage.footer).toBeHidden();
  });
});
