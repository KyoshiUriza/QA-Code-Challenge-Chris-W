import { test, expect } from '@playwright/test';

const  toDo : string = "Buy Milk!";
const  toDo2 : string = "Buy Bread!";
const zeroWidthSpace: string = '\u200B';
const NBSP: string = '\u00A0';
const airplaneEmoji: any = "✈️";
const darkSkinToneThumbUp: any = "👍🏿";
const thumbUpEmoji: any = "👍";


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
  //As the Footer will only appear once there are ToDos available 
  //we can use this to assert that a ToDo was added succeesfully.
  await expect (page.getByTestId('todo-count')).toBeVisible();

await test.step('Mark Added ToDo as Completed', async() =>
    {
  await page.getByRole('checkbox', { name: 'Toggle Todo' }).click();
   await expect (page.getByText('0 items left')).toBeVisible();
    await expect (page.getByRole('button', { name: 'Clear completed' })).toBeVisible();

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
  await expect (page.locator('footer.footer')).toBeVisible();
    });

await test.step ('Deleting Active ToDo Item', async() =>
    
        {
        await page.getByTestId('todo-title').hover();
        await  expect (page.getByRole('button', { name: 'Delete' })).toBeVisible();
        await page.getByRole('button', { name: 'Delete' }).click();
        });

  await test.step ('Adding 2nd ToDo Item', async() => 
    {
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('Buy Bread!');
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  await expect (page.locator('footer.footer')).toBeVisible();
    });


await test.step('Mark Added ToDo as Completed', async() =>
    {
  await page.getByRole('checkbox', { name: 'Toggle Todo' }).click();
    await expect (page.getByText('0 items left')).toBeVisible();
    await  expect (page.getByRole('button', { name: 'Clear completed' })).toBeVisible();

    });
await test.step ('Deleting Compelted ToDo Item', async() =>
    
        {
        await page.getByTestId('todo-title').hover();
        await expect (page.getByRole('button', { name: 'Delete' })).toBeVisible();
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
    await expect(page.getByTestId('todo-title').getByText(toDo2)).toBeVisible();
  });

  await test.step('Mark second todo as completed', async () => {
    const completedItem = page.locator('li').filter({ hasText: toDo2 });
    await completedItem.getByRole('checkbox').check();
    await expect(completedItem).toHaveClass(/completed/);
    await expect (page.getByRole('button', { name: 'Clear completed' })).toBeVisible();

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

test('Edge Case: Specialized Characters & U+ Characters', async ({ page }) => 
  {
await test.step ('Navigate to the App', async() => 
{
  await page.goto('https://demo.playwright.dev/todomvc/#/');
  await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeVisible();
});

      test.fail();
// Negative Test Case:
// The thought behind this test is using special characters such as emojis or Unicode characters.
// Its known in many apps, and reported that Banks have had their apps crash when a user enters an emoji into
// the comments/note field. This test is made to mimic this idea, as well as a user posible copying and pasting 
// a unicode characer (On purpose or not). This could lead to allowing a ToDo with a leading blank space to be entered
// or worse, a possible application crash, if the app or a database isn't able to accept it.


await test.step ('Adding ToDo Item ✈️', async() => 
{

  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(airplaneEmoji);
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  await expect(page.getByTestId('todo-title')).toHaveCount(1);
    await expect(page.getByTestId('todo-title').getByText(airplaneEmoji, { exact: true })).toBeVisible();

await test.step ('Adding ToDo Item 👍🏿', async() => 
{
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(darkSkinToneThumbUp);
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
  await expect(page.getByTestId('todo-title')).toHaveCount(2);
    await expect(page.getByTestId('todo-title').getByText(darkSkinToneThumbUp, { exact: true })).toBeVisible();

});

await test.step ('Adding ToDo Item with NBSP Space Character', async() => 
{
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(NBSP);
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    await expect(page.getByTestId('todo-title')).toHaveCount(2);
    await expect(page.getByTestId('todo-title').getByText(NBSP, { exact: true })).toBeHidden();

});

await test.step ('Adding ToDo Item with Zero Width Space', async() => 
{
  await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(zeroWidthSpace);
  await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    await expect(page.getByTestId('todo-title')).toHaveCount(2);
    await expect(page.getByTestId('todo-title').getByText(zeroWidthSpace, { exact: true })).toBeHidden();

});

  })

})