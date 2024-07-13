import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://final-group-3-project.onrender.com/');
  await page.goto('https://final-group-3-project.onrender.com/#/login');
  await page.getByPlaceholder('angela@gmail.com').click();
  await page.getByPlaceholder('angela@gmail.com').fill('');
  await page.getByRole('button', { name: 'Signup' }).click();
  await page.getByPlaceholder('angie@gmail.com').click();
  await page.getByPlaceholder('angie@gmail.com').fill('testing@gmail.com');
  await page.getByPlaceholder('angela').click();
  await page.getByPlaceholder('angela').fill('testing');
  await page.getByLabel('Password', { exact: true }).click();
  await page.getByLabel('Password', { exact: true }).fill('testing');
  await page.getByLabel('Confirm password').click();
  await page.getByLabel('Confirm password').fill('testing');
  await page.locator('div').filter({ hasText: /^Confirm passwordShow$/ }).getByRole('button').click();
  await page.getByPlaceholder('Your phone number').click();
  await page.getByPlaceholder('Your phone number').fill('0112334567');
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await page.getByRole('button', { name: 'Back To Login' }).click();
  await page.getByPlaceholder('angela@gmail.com').click();
  await page.getByPlaceholder('angela@gmail.com').fill('testing@gmail.com');
  await page.getByPlaceholder('Enter password').click();
  await page.getByPlaceholder('Enter password').fill('testing');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('div').filter({ hasText: 'Email' }).nth(2).click({
    button: 'right'
  });
  await page.goto('https://final-group-3-project.onrender.com/#/login');
  await page.goto('https://final-group-3-project.onrender.com/#/');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: ' Emergency' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('link', { name: 'Alerts' }).click();
  await page.getByRole('link', { name: 'Records' }).click();
  await page.getByRole('link').nth(3).click();
  await page.getByPlaceholder('20', { exact: true }).click();
  await page.getByPlaceholder('20', { exact: true }).fill('18');
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByRole('button', { name: 'learn first aid' }).click();
  await page.getByPlaceholder('Type here...').click();
  await page.getByPlaceholder('Type here...').fill('i am bleeading');
  await page.getByPlaceholder('Type here...').press('Enter');
  await page.getByLabel('Close').click();
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.goto('https://final-group-3-project.onrender.com/#/login');
});