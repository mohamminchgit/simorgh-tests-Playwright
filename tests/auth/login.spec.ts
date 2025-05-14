// import { test, expect } from '@playwright/test';

// test.describe('USER-LOGIN', () => {
//   test('MODIR', async ({ page }) => {
//     await page.goto('/auth/login');
//     await page.locator('#username').fill('modir');
//     await page.locator('#password').fill('123456');
//     await page.locator('button.ant-btn-primary:has-text("ورود")').click();
//     await page.waitForNavigation();
//     await expect(page).toHaveURL('/dashboard/workspace');
//   });

//   test('USER', async ({ page }) => {
//     await page.goto('/auth/login');
//     await page.locator('#username').fill('3');
//     await page.locator('#password').fill('123456');
//     await page.locator('button.ant-btn-primary:has-text("ورود")').click();
//     await page.waitForNavigation();
//     await expect(
//       ['/performance/personal-dashboard', '/dashboard/workspace']
//     ).toContain(new URL(await page.url()).pathname);
    
//   });

// });

// test.describe('ADMIN-LOGIN', () => {
//   test('ADMIN', async ({ page }) => {
//     await page.goto('/admin/auth/login');
//     await page.locator('#username').fill('admin');
//     await page.locator('#password').fill('123456');
//     await page.locator('button.ant-btn-primary:has-text("ورود")').click();
//     await page.waitForNavigation();
//     await expect(page).toHaveURL('/admin/dashboard/workspace');
//   });


// });

//----------------------------تست بالا بدون فیکچر نوشته شده ، پایین با استفاده از فیکچر نوشته شده ------------------------//

import { expect } from '@playwright/test';
import { test, loginAs } from '../fixtures/auth.fixtures';


//----------------------------یوزر-------------------------------------//

// استفاده از تابع loginAs برای لاگین با کاربر خاص
test('بررسی لاگین یوزر', async ({ page }) => {
  // لاگین با کاربر عادی
  await loginAs(page, 'user');
  
  // بررسی اینکه به داشبورد منتقل شده‌ایم
  await expect(page).toHaveURL('/dashboard/workspace');
  
  // انجام تست‌های مربوط به داشبورد کاربر عادی
});


//----------------------------مدیر---------------------------------------//

// استفاده از تابع loginAs برای تست صفحه ادمین
test('بررسی لاگین مدیر', async ({ page }) => {
  // لاگین با ادمین
  await loginAs(page, 'modir');
  
  // بررسی اینکه به داشبورد ادمین منتقل شده‌ایم
  await expect(page).toHaveURL('/dashboard/workspace');
  

});

//----------------------------ادمین---------------------------------------//

// استفاده از تابع loginAs برای تست صفحه ادمین
test('بررسی لاگین ادمین', async ({ page }) => {
  // لاگین با ادمین
  await loginAs(page, 'admin');
  
  // بررسی اینکه به داشبورد ادمین منتقل شده‌ایم
  await expect(page).toHaveURL('/admin/dashboard/workspace');
  

});