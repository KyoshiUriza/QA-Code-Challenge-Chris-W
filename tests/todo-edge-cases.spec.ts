import { test, expect } from './fixtures/todo-fixtures';
import {
  AIRPLANE_EMOJI,
  DARK_SKIN_TONE_THUMB_UP,
  LEADING_TRAILING_SPACES,
  LONG_SENTENCE,
  LONG_UNBROKEN_WORD,
  NBSP,
  RTL_TEXT,
  TODO,
  XSS_ATTEMPT,
  ZERO_WIDTH_SPACE,
} from './data/todo-data';

/**
 * Input the app was probably not designed for. The concern behind these is
 * real: apps have crashed on an emoji pasted into a notes field, and invisible
 * characters pasted by accident create rows a user cannot see or explain.
 */
test.describe('Edge cases: input handling', () => {
  test('accepts an emoji', async ({ todoPage }) => {
    await todoPage.addTodo(AIRPLANE_EMOJI);

    await todoPage.expectTitles([AIRPLANE_EMOJI]);
  });

  test('accepts an emoji with a skin-tone modifier as one item', async ({ todoPage }) => {
    await todoPage.addTodo(DARK_SKIN_TONE_THUMB_UP);

    await todoPage.expectTitles([DARK_SKIN_TONE_THUMB_UP]);
    await todoPage.expectCounter('1 item left');
  });

  test('rejects an empty submission', async ({ todoPage }) => {
    await todoPage.addTodo('');

    await expect(todoPage.todoItems).toHaveCount(0);
    await expect(todoPage.footer).toBeHidden();
  });

  test('rejects a submission of only spaces', async ({ todoPage }) => {
    await todoPage.addTodo('     ');

    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test('rejects a non-breaking space (U+00A0), which trim() treats as whitespace', async ({ todoPage }) => {
    await todoPage.addTodo(NBSP);

    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test('rejects a zero-width space (U+200B)', async ({ todoPage }) => {
    // DEFECT: U+200B is invisible but `String.prototype.trim()` does not treat
    // it as whitespace, so the app accepts it and creates a todo with no
    // visible text that still counts toward "items left" — a row the user can
    // neither read nor explain. The assertion below is the correct behavior.
    test.fail();

    await todoPage.addTodo(ZERO_WIDTH_SPACE);

    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test('trims leading and trailing whitespace from a new todo', async ({ todoPage }) => {
    await todoPage.addTodo(LEADING_TRAILING_SPACES);

    await todoPage.expectTitles([LEADING_TRAILING_SPACES.trim()]);
  });

  test('renders markup as text rather than executing it', async ({ todoPage }) => {
    const dialogs: string[] = [];
    todoPage.page.on('dialog', async (dialog) => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });

    await todoPage.addTodo(XSS_ATTEMPT);

    await todoPage.expectTitles([XSS_ATTEMPT]);
    expect(dialogs).toEqual([]);
    await expect(todoPage.todoItems.locator('img')).toHaveCount(0);
  });

  test('accepts right-to-left text', async ({ todoPage }) => {
    await todoPage.addTodo(RTL_TEXT);

    await todoPage.expectTitles([RTL_TEXT]);
  });

  test('allows duplicate todos', async ({ todoPage }) => {
    // Notes.md flags this as a usability risk rather than a defect: a daily
    // "brush teeth" entry accumulates. Pinned so a future change is deliberate.
    await todoPage.addTodo(TODO);
    await todoPage.addTodo(TODO);

    await expect(todoPage.todoItems).toHaveCount(2);
    await todoPage.expectCounter('2 items left');
  });

  test('keeps a long unbroken word inside the list', async ({ todoPage }) => {
    await todoPage.addTodo(LONG_UNBROKEN_WORD);

    const list = todoPage.page.locator('.todo-list');
    const item = todoPage.todoItems.first();
    const listBox = await list.boundingBox();
    const itemBox = await item.boundingBox();

    expect(listBox).not.toBeNull();
    expect(itemBox).not.toBeNull();
    // Text that overflows its container is unreadable and can push the delete
    // control off screen, so the row must not be wider than the list.
    expect(itemBox!.width).toBeLessThanOrEqual(listBox!.width + 1);
  });

  test('keeps a long sentence readable and deletable', async ({ todoPage }) => {
    await todoPage.addTodo(LONG_SENTENCE);

    await todoPage.expectTitles([LONG_SENTENCE]);
    await todoPage.remove(LONG_SENTENCE);
    await expect(todoPage.todoItems).toHaveCount(0);
  });
});
