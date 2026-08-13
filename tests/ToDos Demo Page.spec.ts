import { test, expect } from '@playwright/test';

let  toDo : string = "Buy Milk!";
let  toDo2 : string = "Buy Bread!";
let  toDo3 : string = "Buy Plane Tickets to Japan";


test('Adding New Todo Item', async ({ page }) => 
  {
await test.step ('Navigate to the App', async() => 
{
  await page.goto('https://demo.playwright.dev/todomvc/#/');
  await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeVisible();
});


await test.step ('Adding ToDo Item', async() => 
{
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('We have things ToDo! :)');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  await expect(page.getByTestId('todo-title')).toBeVisible();
  await expect(page.locator('body')).toContainText('1 item left');
});

  });

test('Marking a Todo Item as Complete', async({page}) => 
{
  await test.step ('Navigate to the App', async() => 

{
  await page.goto('https://demo.playwright.dev/todomvc/#/');
  await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeVisible();
});

  await test.step ('Adding ToDo Item', async() => 
    {
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(toDo);
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  expect (page.locator('footer.footer')).toBeVisible;
  expect (page.getByRole('button', { name: 'Clear completed' })).toBeVisible;

await test.step('Mark Added ToDo as Completed', async() =>
    {
  await page.getByRole('checkbox', { name: 'Toggle Todo' }).click();
   await expect (page.getByText('0 items left')).toBeVisible();
    });

  });
});

test('Deleting a todo item', async({page}) => 
{
  await test.step ('Navigate to the App', async() => 

{
  await page.goto('https://demo.playwright.dev/todomvc/#/');
  await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeVisible();
});

  await test.step ('Adding ToDo Item', async() => 
    {
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Buy Milk!');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  expect (page.locator('footer.footer')).toBeVisible;
  expect (page.getByRole('button', { name: 'Clear completed' })).toBeVisible;
    });

await test.step ('Deleting Active ToDo Item', async() =>
    
        {
        await page.getByTestId('todo-title').hover();
          expect (page.getByRole('button', { name: 'Delete' })).toBeVisible();
        await page.getByRole('button', { name: 'Delete' }).click();
        });

  await test.step ('Adding 2nd ToDo Item', async() => 
    {
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Buy Bread!');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  expect (page.locator('footer.footer')).toBeVisible;
  expect (page.getByRole('button', { name: 'Clear completed' })).toBeVisible;
    });


await test.step('Mark Added ToDo as Completed', async() =>
    {
  await page.getByRole('checkbox', { name: 'Toggle Todo' }).click();
    expect (page.getByText('0 items left')).toBeVisible();
    });
await test.step ('Deleting Compelted ToDo Item', async() =>
    
        {
        await page.getByTestId('todo-title').hover();
          expect (page.getByRole('button', { name: 'Delete' })).toBeVisible();
        await page.getByRole('button', { name: 'Delete' }).click();
        });
      });

 test('Filtering todos by "Active" and "Completed"', async ({ page }) => {
    
  await test.step('Navigate to the App', async () => {
    await page.goto('https://demo.playwright.dev/todomvc/#/');
    await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeVisible();
  });

  await test.step('Add first todo item', async () => {
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(toDo);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    await expect(page.getByTestId('todo-title')).toContainText(toDo);
  });

  await test.step('Add second todo item', async () => {
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(toDo2);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    await expect(page.getByTestId('todo-title').getByText(toDo2)).toBeVisible;
  });

  await test.step('Mark second todo as completed', async () => {
    const completedItem = page.locator('li').filter({ hasText: toDo2 });
    await completedItem.getByRole('checkbox').check();
    await expect(completedItem).toHaveClass(/completed/);
  });

  await test.step('Toggle Active filter', async () => {
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.getByText(toDo2, { exact: true })).toBeHidden();
    await expect(page.getByText(toDo, { exact: true })).toBeVisible();
  });

  await test.step('Toggle Completed filter', async () => {
    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.getByText(toDo2, { exact: true })).toBeVisible();
    await expect(page.getByText(toDo, { exact: true })).toBeHidden();
  });
 });

test('Edge Case: Duplucate ToDos', async ({ page }) => 
  {
await test.step ('Navigate to the App', async() => 
{
  await page.goto('https://demo.playwright.dev/todomvc/#/');
  await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeVisible();
});


await test.step ('Adding ToDo Item', async() => 
{
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(toDo3);
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  await expect(page.getByTestId('todo-title')).toBeVisible();
  await expect(page.locator('body')).toContainText('1 item left');
});

await test.step ('Adding Repeat ToDo Item', async() => 
{
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(toDo3);
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  await expect(page.getByTestId('todo-title')).toBeVisible();
  await expect(page.locator('body')).toContainText('2 item left');
    await expect(page.getByText(toDo2, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(toDo2, { exact: true }).last()).toBeVisible();
});

  });
