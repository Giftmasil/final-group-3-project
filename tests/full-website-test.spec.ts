import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://final-group-3-project.vercel.app/');
  await page.goto('https://final-group-3-project.vercel.app/#/login');
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
  await page.locator('div').filter({ hasText: /^PasswordShow$/ }).getByRole('button').click();
  await page.getByPlaceholder('Your phone number').click();
  await page.getByPlaceholder('Your phone number').fill('0101122345');
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await page.getByRole('button', { name: 'Back To Login' }).click();
  await page.getByPlaceholder('angela@gmail.com').click();
  await page.getByPlaceholder('angela@gmail.com').fill('testing@gmail.com');
  await page.getByPlaceholder('Enter password').click();
  await page.getByPlaceholder('Enter password').fill('testing');
  await page.getByRole('button', { name: 'Show' }).click();
  await page.getByRole('button', { name: 'Login' }).click();
  await page.goto('https://final-group-3-project.vercel.app/#/login');
  await page.goto('https://final-group-3-project.vercel.app/#/');
  
  // Ensure the element is visible before clicking
  await page.waitForSelector('role=link[name="Alerts"]', { state: 'visible', timeout: 5000 });
  await page.getByRole('link', { name: 'Alerts' }).click();

  await page.getByRole('link', { name: 'Records' }).click();
  await page.getByRole('link').nth(3).click();
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByRole('button', { name: 'learn first aid' }).click();
  await page.getByLabel('Close').click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: ' Emergency' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();
  await page.goto('https://final-group-3-project.vercel.app/#/login');
});
