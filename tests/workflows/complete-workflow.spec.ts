import { expect, test } from '@playwright/test';
import { loginAs } from '../fixtures/auth.fixtures';

// تست جریان کاری کامل
test.describe('جریان کاری کامل از ابتدا تا انتها', () => {
  
  test('ثبت درخواست جدید و بررسی آن توسط مدیر', async ({ page, browser }) => {
    // مرحله ۱: لاگین با کاربر عادی و ایجاد یک درخواست
    await loginAs(page, 'user');
    
    // بررسی اینکه به داشبورد منتقل شده‌ایم
    await expect(page).toHaveURL('/dashboard/workspace');
    
    // اینجا کد مربوط به ایجاد درخواست را می‌نویسید
    // مثال:
    await page.locator('a:has-text("ثبت درخواست")').click();
    // تکمیل فرم درخواست...
    
    // ذخیره شناسه درخواست برای مراحل بعدی
    const requestId = await page.locator('.request-id').textContent();
    
    // مرحله ۲: خروج از سیستم
    await page.locator('button:has-text("خروج")').click();
    
    // مرحله ۳: لاگین با کاربر مدیر و بررسی درخواست
    await loginAs(page, 'modir');
    
    // رفتن به صفحه درخواست‌ها
    await page.locator('a:has-text("درخواست‌ها")').click();
    
    // جستجوی درخواست با شناسه
    await page.locator('#search-input').fill(requestId || '');
    await page.locator('button:has-text("جستجو")').click();
    
    // بررسی وجود درخواست
    await expect(page.locator(`tr:has-text("${requestId}")`)).toBeVisible();
    
    // تایید درخواست
    await page.locator(`tr:has-text("${requestId}") button:has-text("تایید")`).click();
    
    // مرحله ۴: ایجاد کاربر جدید (مثال دیگر)
    // این بخش نمونه دیگری از انجام عملیات پس از لاگین است
    await page.locator('a:has-text("مدیریت کاربران")').click();
    await page.locator('button:has-text("افزودن کاربر")').click();
    
    // تکمیل فرم کاربر جدید
    await page.locator('#name').fill('کاربر تست');
    await page.locator('#username').fill('testuser');
    await page.locator('#password').fill('123456');
    await page.locator('button:has-text("ذخیره")').click();
    
    // بررسی ایجاد موفق کاربر
    await expect(page.locator('.ant-message-success')).toContainText('کاربر با موفقیت ایجاد شد');
  });
  
}); 