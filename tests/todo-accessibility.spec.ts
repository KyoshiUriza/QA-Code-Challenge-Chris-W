import { test, expect } from './fixtures/todo-fixtures';
import { TODO, TODO_2 } from './data/todo-data';

/**
 * Keyboard and accessible-name coverage for the concerns raised in Notes.md.
 * Each test names the WCAG 2.2 AA success criterion it is about.
 */
test.describe('Accessibility', { tag: ['@regression', '@a11y'] }, () => {
  test('the new-todo input is focused on load, so a keyboard user can start typing (2.4.3 Focus Order)', async ({
    todoPage,
  }) => {
    await expect(todoPage.newTodoInput).toBeFocused();
  });

  test('a todo can be completed with the keyboard alone (2.1.1 Keyboard)', async ({ todoPage }) => {
    await todoPage.addTodo(TODO);

    await todoPage.toggleFor(TODO).focus();
    await todoPage.page.keyboard.press('Space');

    await todoPage.expectCompleted(TODO);
  });

  test('focus is never trapped in the edit box (2.1.2 No Keyboard Trap)', async ({ todoPage }) => {
    await todoPage.addTodo(TODO);

    const editBox = await todoPage.startEditing(TODO);
    await editBox.press('Escape');

    await expect(editBox).toBeHidden();
    await todoPage.page.keyboard.press('Tab');
    await expect(todoPage.page.locator(':focus')).toHaveCount(1);
  });

  test('every control exposes an accessible name (4.1.2 Name, Role, Value)', async ({ todoPage }) => {
    await todoPage.addTodos(TODO, TODO_2);
    await todoPage.complete(TODO);

    await expect(todoPage.newTodoInput).toBeVisible();
    await expect(todoPage.toggleAll).toBeVisible();
    await expect(todoPage.toggleFor(TODO)).toBeVisible();
    await expect(todoPage.clearCompleted).toBeVisible();
    // Each of the above is located by role plus accessible name, so resolving
    // them at all is the assertion: an unnamed control would not be found.
  });

  test('filters are links a screen reader can list (1.3.1 Info and Relationships)', async ({ todoPage }) => {
    await todoPage.addTodo(TODO);

    await expect(todoPage.page.locator('.filters').getByRole('link')).toHaveCount(3);
    await expect(todoPage.allFilter).toHaveAttribute('href', '#/');
  });

  test('the page has one top-level heading (2.4.6 Headings and Labels)', async ({ todoPage }) => {
    await expect(todoPage.page.getByRole('heading', { level: 1 })).toHaveText('todos');
  });

  test('the delete control is reachable without a mouse (2.1.1 Keyboard)', async ({ todoPage }) => {
    // DEFECT: the delete button only exists on hover, so a keyboard-only user
    // cannot tab to it and has no way to delete a todo without a pointer.
    // Notes.md: "No 'x' icon until you hover over an item."
    test.fail();

    await todoPage.addTodo(TODO);

    await expect(todoPage.deleteButtonFor(TODO)).toBeVisible();
  });
});
