import { expect, Locator, Page } from '@playwright/test';

/**
 * Page Object for the TodoMVC demo app.
 *
 * A Page Object is a class that holds one screen's locators as fields and its
 * user actions as methods, so a test reads as a description of user behavior
 * and a UI change is fixed in one place.
 *
 * Every field is a Playwright locator: a lazy handle that re-resolves the
 * element on each use, so it never goes stale and it auto-waits.
 */
export class TodoPage {
  static readonly URL = 'https://demo.playwright.dev/todomvc/#/';

  /** localStorage key the app persists its list under. */
  static readonly STORAGE_KEY = 'react-todos';

  readonly page: Page;

  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoTitles: Locator;
  readonly toggleAll: Locator;
  readonly counter: Locator;
  readonly clearCompleted: Locator;
  readonly footer: Locator;
  readonly allFilter: Locator;
  readonly activeFilter: Locator;
  readonly completedFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.getByRole('textbox', { name: 'What needs to be done?' });
    this.todoItems = page.getByTestId('todo-item');
    this.todoTitles = page.getByTestId('todo-title');
    this.toggleAll = page.getByLabel('Mark all as complete');
    this.counter = page.getByTestId('todo-count');
    this.clearCompleted = page.getByRole('button', { name: 'Clear completed' });
    this.footer = page.locator('footer.footer');
    this.allFilter = page.getByRole('link', { name: 'All' });
    this.activeFilter = page.getByRole('link', { name: 'Active' });
    this.completedFilter = page.getByRole('link', { name: 'Completed' });
  }

  async goto(): Promise<void> {
    await this.page.goto(TodoPage.URL);
    await expect(this.newTodoInput).toBeVisible();
  }

  /** One todo row, found by its visible text rather than by position. */
  item(title: string): Locator {
    return this.todoItems.filter({ has: this.page.getByText(title, { exact: true }) });
  }

  toggleFor(title: string): Locator {
    return this.item(title).getByRole('checkbox');
  }

  deleteButtonFor(title: string): Locator {
    return this.item(title).getByRole('button', { name: 'Delete' });
  }

  /** The input that replaces the title while a todo is being edited. */
  editBoxFor(title: string): Locator {
    return this.item(title).getByRole('textbox', { name: 'Edit' });
  }

  async addTodo(title: string): Promise<void> {
    await this.newTodoInput.fill(title);
    await this.newTodoInput.press('Enter');
  }

  async addTodos(...titles: string[]): Promise<void> {
    for (const title of titles) {
      await this.addTodo(title);
    }
  }

  async complete(title: string): Promise<void> {
    await this.toggleFor(title).check();
  }

  async reopen(title: string): Promise<void> {
    await this.toggleFor(title).uncheck();
  }

  async remove(title: string): Promise<void> {
    // The delete control only appears on hover, so hover is part of the flow,
    // not a wait: see Notes.md, "Not clear how to delete an item at a glance".
    await this.item(title).hover();
    await this.deleteButtonFor(title).click();
  }

  /**
   * Double-click opens the editor. `commit` chooses how the user leaves it:
   * Enter and blur save, Escape discards.
   */
  async startEditing(title: string): Promise<Locator> {
    await this.item(title).dblclick();
    const editBox = this.editBoxFor(title);
    await expect(editBox).toBeFocused();
    return editBox;
  }

  async editTodo(title: string, newTitle: string, commit: 'enter' | 'blur' | 'escape' = 'enter'): Promise<void> {
    const editBox = await this.startEditing(title);
    await editBox.fill(newTitle);

    if (commit === 'enter') {
      await editBox.press('Enter');
    } else if (commit === 'escape') {
      await editBox.press('Escape');
    } else {
      await this.newTodoInput.click();
    }
  }

  async clearCompletedTodos(): Promise<void> {
    await this.clearCompleted.click();
  }

  async filterBy(filter: 'All' | 'Active' | 'Completed'): Promise<void> {
    const link = { All: this.allFilter, Active: this.activeFilter, Completed: this.completedFilter }[filter];
    await link.click();
  }

  /** The list as the user sees it right now, in display order. */
  async visibleTitles(): Promise<string[]> {
    return this.todoTitles.allInnerTexts();
  }

  /** What the app persisted, which is what survives a reload. */
  async storedTodos(): Promise<Array<{ title: string; completed: boolean }>> {
    const raw = await this.page.evaluate(
      (key) => window.localStorage.getItem(key),
      TodoPage.STORAGE_KEY,
    );
    return raw === null ? [] : JSON.parse(raw);
  }

  async expectTitles(titles: string[]): Promise<void> {
    await expect(this.todoTitles).toHaveText(titles);
  }

  async expectCounter(text: string): Promise<void> {
    await expect(this.counter).toHaveText(text);
  }

  async expectCompleted(title: string, completed = true): Promise<void> {
    await expect(this.item(title)).toHaveClass(completed ? /completed/ : /^(?!.*completed).*$/);
    await expect(this.toggleFor(title)).toBeChecked({ checked: completed });
  }
}
