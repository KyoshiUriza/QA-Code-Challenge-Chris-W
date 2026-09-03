import { test, expect } from './fixtures/todo-fixtures';
import { TODO, TODO_2, TODO_3 } from './data/todo-data';

test.describe('Creating, completing and deleting todos', () => {
  test('adds a todo and shows it in the list', async ({ todoPage }) => {
    await todoPage.addTodo(TODO);

    await todoPage.expectTitles([TODO]);
    await todoPage.expectCounter('1 item left');
    await expect(todoPage.newTodoInput).toBeEmpty();
  });

  test('adds several todos and keeps them in entry order', async ({ todoPage }) => {
    await todoPage.addTodos(TODO, TODO_2, TODO_3);

    await todoPage.expectTitles([TODO, TODO_2, TODO_3]);
    await todoPage.expectCounter('3 items left');
  });

  test('marks a todo complete and back to active', async ({ todoPage }) => {
    await todoPage.addTodos(TODO, TODO_2);

    await todoPage.complete(TODO);
    await todoPage.expectCompleted(TODO);
    await todoPage.expectCounter('1 item left');
    await expect(todoPage.clearCompleted).toBeVisible();

    await todoPage.reopen(TODO);
    await todoPage.expectCompleted(TODO, false);
    await todoPage.expectCounter('2 items left');
    await expect(todoPage.clearCompleted).toBeHidden();
  });

  test('deletes an active todo and leaves the rest untouched', async ({ todoPage }) => {
    await todoPage.addTodos(TODO, TODO_2);

    await todoPage.remove(TODO);

    await todoPage.expectTitles([TODO_2]);
    await todoPage.expectCounter('1 item left');
  });

  test('deletes a completed todo', async ({ todoPage }) => {
    await todoPage.addTodo(TODO);
    await todoPage.complete(TODO);

    await todoPage.remove(TODO);

    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test('hides the footer when the last todo is deleted', async ({ todoPage }) => {
    await todoPage.addTodo(TODO);
    await expect(todoPage.footer).toBeVisible();

    await todoPage.remove(TODO);

    await expect(todoPage.footer).toBeHidden();
    await expect(todoPage.toggleAll).toBeHidden();
  });

  test('counter reads "1 item left" in the singular', async ({ todoPage }) => {
    await todoPage.addTodos(TODO, TODO_2);
    await todoPage.expectCounter('2 items left');

    await todoPage.complete(TODO);

    await todoPage.expectCounter('1 item left');
  });
});
