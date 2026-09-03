import { test, expect, TodoPage } from './fixtures/todo-fixtures';
import { TODO, TODO_2 } from './data/todo-data';

/**
 * Notes.md: the app never tells the user their list is stored locally, or that
 * clearing site data loses it. These tests pin the behavior that promise rests on.
 */
test.describe('Persistence', () => {
  test('todos and their state survive a reload', async ({ todoPage }) => {
    await todoPage.addTodos(TODO, TODO_2);
    await todoPage.complete(TODO_2);

    await todoPage.page.reload();

    await todoPage.expectTitles([TODO, TODO_2]);
    await todoPage.expectCompleted(TODO_2);
    await todoPage.expectCounter('1 item left');
  });

  test('what is displayed matches what was stored', async ({ todoPage }) => {
    await todoPage.addTodos(TODO, TODO_2);
    await todoPage.complete(TODO);

    const stored = await todoPage.storedTodos();

    expect(stored.map((todo) => todo.title)).toEqual([TODO, TODO_2]);
    expect(stored.map((todo) => todo.completed)).toEqual([true, false]);
  });

  test('deletions are persisted, not just hidden', async ({ todoPage }) => {
    await todoPage.addTodos(TODO, TODO_2);

    await todoPage.remove(TODO);
    await todoPage.page.reload();

    await todoPage.expectTitles([TODO_2]);
  });

  test('clearing site data loses the list', async ({ todoPage }) => {
    await todoPage.addTodo(TODO);

    await todoPage.page.evaluate((key) => window.localStorage.removeItem(key), TodoPage.STORAGE_KEY);
    await todoPage.page.reload();

    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test('a second browser context does not see the first list', async ({ todoPage, browser }) => {
    await todoPage.addTodo(TODO);

    const otherContext = await browser.newContext();
    const otherTodoPage = new TodoPage(await otherContext.newPage());
    await otherTodoPage.goto();

    await expect(otherTodoPage.todoItems).toHaveCount(0);

    await otherContext.close();
  });
});
