import { test as base } from '@playwright/test';

// تعریف نوع اطلاعات برای کاربر
type UserData = {
  username: string;
  password: string;
  role: 'modir' | 'user' | 'admin';
};

// تعریف فیکسچر با کاربران مختلف
export const test = base.extend<{
  authenticatedPage: {
    page: any;
    role: string;
  };
}>({
  authenticatedPage: async ({ page }, use) => {
    // کاربر پیش‌فرض: مدیر
    const userData: UserData = {
      username: 'modir',
      password: '123456',
      role: 'modir'
    };

    // انجام لاگین
    if (userData.role === 'admin') {
      await page.goto('/admin/auth/login');
    } else {
      await page.goto('/auth/login');
    }
    
    await page.locator('#username').fill(userData.username);
    await page.locator('#password').fill(userData.password);
    await page.locator('button.ant-btn-primary:has-text("ورود")').click();
    await page.waitForNavigation();

    // استفاده از صفحه لاگین شده
    await use({ page, role: userData.role });
  },
});

// ایجاد فیکسچر برای لاگین با نقش مشخص
export const loginAs = async (page: any, role: 'modir' | 'user' | 'admin') => {
  let userData: UserData;
  
  switch (role) {
    case 'modir':
      userData = { username: 'modir', password: '123456', role: 'modir' };
      break;
    case 'user':
      userData = { username: '3', password: '123456', role: 'user' };
      break;
    case 'admin':
      userData = { username: 'admin', password: '123456', role: 'admin' };
      break;
  }

  // انجام لاگین
  if (userData.role === 'admin') {
    await page.goto('/admin/auth/login');
  } else {
    await page.goto('/auth/login');
  }
  
  await page.locator('#username').fill(userData.username);
  await page.locator('#password').fill(userData.password);
  await page.locator('button.ant-btn-primary:has-text("ورود")').click();
  await page.waitForNavigation();
  
  return { page, role: userData.role };
}; 