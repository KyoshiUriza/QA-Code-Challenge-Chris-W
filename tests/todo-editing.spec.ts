import { test, expect } from './fixtures/todo-fixtures';
import { TODO, TODO_2 } from './data/todo-data';

/**
 * Editing is the flow the app's own instructions describe and the one the
 * original suite did not cover at all.
 */
test.describe('Editing a todo', { tag: '@regression' }, () => {
  test('saves an edit committed with Enter', { tag: '@smoke' }, async ({ todoPage }) => {
    await todoPage.addTodos(TODO, TODO_2);

    await todoPage.editTodo(TODO, 'Buy Oat Milk', 'enter');

    await todoPage.expectTitles(['Buy Oat Milk', TODO_2]);
    await todoPage.expectCounter('2 items left');
  });

  test('saves an edit committed by clicking away', async ({ todoPage }) => {
    await todoPage.addTodo(TODO);

    await todoPage.editTodo(TODO, 'Buy Oat Milk', 'blur');

    await todoPage.expectTitles(['Buy Oat Milk']);
  });

  test('discards an edit cancelled with Escape', async ({ todoPage }) => {
    await todoPage.addTodo(TODO);

    await todoPage.editTodo(TODO, 'Buy Oat Milk', 'escape');

    await todoPage.expectTitles([TODO]);
  });

  test('deletes the todo when its text is edited to empty', async ({ todoPage }) => {
    await todoPage.addTodos(TODO, TODO_2);

    await todoPage.editTodo(TODO, '', 'enter');

    await todoPage.expectTitles([TODO_2]);
    await todoPage.expectCounter('1 item left');
  });

  test('trims surrounding whitespace from an edited title', async ({ todoPage }) => {
    await todoPage.addTodo(TODO);

    await todoPage.editTodo(TODO, '   Buy Oat Milk   ', 'enter');

    await todoPage.expectTitles(['Buy Oat Milk']);
  });

  test('keeps a todo complete after it is edited', async ({ todoPage }) => {
    await todoPage.addTodo(TODO);
    await todoPage.complete(TODO);

    await todoPage.editTodo(TODO, 'Buy Oat Milk', 'enter');

    await todoPage.expectCompleted('Buy Oat Milk');
    await todoPage.expectCounter('0 items left');
  });

  test('opens the editor prefilled with the current title', async ({ todoPage }) => {
    await todoPage.addTodo(TODO);

    const editBox = await todoPage.startEditing(TODO);

    await expect(editBox).toHaveValue(TODO);
  });
});
