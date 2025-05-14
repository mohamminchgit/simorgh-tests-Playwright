// tests/admin/smoke.spec.ts
import { expect } from '@playwright/test';
import { test, loginAs } from '../fixtures/auth.fixtures';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// ------------------------------------
// تعریف متغیرهای سراسری
// ------------------------------------
const adminPages = [
  { name: 'پنل مدیریت', path: '/admin/administration/panel', api: '/api/administration' },
  { name: 'مدیریت نقش‌های کاربری', path: '/admin/administration/base-management/user-role', api: '/api/roles' },
  { name: 'مدیریت عملیات', path: '/admin/administration/base-management/actions', api: '/api/actions' },
  { name: 'لاگ سیستم', path: '/admin/administration/base-management/log', api: '/api/logs' },
  { name: 'آخرین ورودها', path: '/admin/administration/base-management/last-login', api: '/api/logins' },
  { name: 'تنظیمات', path: '/admin/administration/base-management/setting', api: '/api/settings' },
  { name: 'نشست‌ها', path: '/admin/administration/base-management/sessions', api: '/api/sessions' },
  { name: 'تاریخچه تغییرات', path: '/admin/pages/change-log', api: '/api/changelog' },
  { name: 'مسدودسازی IP', path: '/admin/administration/base-management/block-ip', api: '/api/blockip' },
  { name: 'API خارجی', path: '/admin/administration/base-management/external-api', api: '/api/external' },
  { name: 'محلی‌سازی', path: '/admin/administration/base-management/localization/list', api: '/api/localization' },
  { name: 'مدیریت پیامک', path: '/admin/administration/base-sms/panel', api: '/api/sms' },
  { name: 'قالب‌های پیامک', path: '/admin/administration/base-sms/messageTemplate', api: '/api/templates' },
  { name: 'بخش‌بندی پیامک', path: '/admin/administration/base-sms/segment', api: '/api/segments' },
  { name: 'رفتارها', path: '/admin/administration/gamification/behavior', api: '/api/behaviors' },
  { name: 'گروه‌های امتیازدهی', path: '/admin/administration/gamification/scoringGroups', api: '/api/scoring' },
  { name: 'جوایز', path: '/admin/administration/gamification/award', api: '/api/awards' },
  { name: 'سطوح بلوغ', path: '/admin/administration/gamification/maturityLevels', api: '/api/maturity' },
  { name: 'جوایز کاربران', path: '/admin/administration/gamification/personAward', api: '/api/personawards' },
  { name: 'گزارش جوایز کاربران', path: '/admin/administration/gamification/reports/personAwardReport', api: '/api/awardreports' },
  { name: 'گزارش رفتارهای کاربران', path: '/admin/administration/gamification/reports/personBehaviorReport', api: '/api/behaviorreports' },
  { name: 'گزارشات جمعیتی', path: '/admin/reports/demographic', api: '/api/demographic' },
];

// ------------------------------------
// تعریف Base URL
// ------------------------------------
const baseUrl = 'https://crm7.simorgh34000.test';

// ایجاد پوشه‌های مورد نیاز
const setupDirectories = () => {
  const dirs = [
    './test-results/videos',
    './test-results/screenshots',
    './test-results/errors'
  ];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
};

// تولید یک نام فایل امن
const createSafeFileName = (pagePath) => {
  return pagePath.split('/').filter(p => p).join('-') || 'index';
};

// ------------------------------------
// تست‌های اصلی
// ------------------------------------
test.describe.serial('Smoke test پنل ادمین', () => {
  // متغیر برای حفظ وضعیت صفحه بین تست‌ها
  let adminPage;
  let context;

  // ------------------------------------
  // تنظیمات اولیه و لاگین - فقط یک بار
  // ------------------------------------
  test.beforeAll(async ({ browser }) => {
    // ایجاد پوشه‌های لازم
    setupDirectories();
    
    // ایجاد کانتکست جدید با تنظیمات ویدیو
    context = await browser.newContext({
      recordVideo: {
        dir: './test-results/videos/',
        size: { width: 1920, height: 1080 }
      },
      ignoreHTTPSErrors: true
    });
    
    // افزایش زمان انتظار برای بارگذاری صفحات
    context.setDefaultNavigationTimeout(120000); // 2 دقیقه
    context.setDefaultTimeout(120000); // 2 دقیقه
    
    // ایجاد صفحه برای استفاده در تمام تست‌ها
    adminPage = await context.newPage();
    
    try {
      // لاگین با ادمین
      console.log('🔑 در حال لاگین به عنوان ادمین...');
      await loginAs(adminPage, 'admin');
      
      // بررسی موفقیت لاگین
      await expect(adminPage).toHaveURL(/.*\/admin\/dashboard/);
      console.log('✅ لاگین با موفقیت انجام شد');
      
      // مکث کوتاه برای اطمینان از بارگذاری کامل داشبورد
      await adminPage.waitForLoadState('networkidle');
      await adminPage.waitForTimeout(2000);
      
    } catch (error) {
      console.error('❌ خطا در لاگین اولیه:', error);
      throw error;
    }
  });

  // ------------------------------------
  // تست صفحات ادمین
  // ------------------------------------
  for (const page of adminPages) {
    test(`بررسی صفحه: ${page.name}`, async ({ browser }) => {
      try {
        console.log(`🔍 در حال بررسی صفحه: ${page.name}`);
        
        // ایجاد نام فایل امن برای ویدیو
        const safeName = createSafeFileName(page.path);
        
        // ایجاد پوشه ویدیو اختصاصی برای هر تست
        const videoDir = `./test-results/videos/${safeName}`;
        if (!fs.existsSync(videoDir)) {
          fs.mkdirSync(videoDir, { recursive: true });
        }
        
        // تنظیمات ضبط ویدیو برای این تست
        const testContext = await browser.newContext({
          recordVideo: {
            dir: videoDir,
            size: { width: 1920, height: 1080 }
          },
          ignoreHTTPSErrors: true
        });
        
        // ایجاد صفحه جدید برای ضبط ویدیو
        const videoPage = await testContext.newPage();
        
        // نسخه‌برداری از کوکی‌های لاگین به صفحه جدید
        const cookies = await context.cookies();
        await testContext.addCookies(cookies);
        
        // رفتن به صفحه مورد نظر
        await videoPage.goto(page.path, { 
          waitUntil: 'networkidle',
          timeout: 120000 // 2 دقیقه برای بارگذاری کامل
        });
        
        // رفتن به صفحه اصلی با استفاده از صفحه اشتراکی
        await adminPage.goto(page.path, { 
          waitUntil: 'networkidle',
          timeout: 120000 // 2 دقیقه برای بارگذاری کامل
        });
        
        // انتظار برای بارگذاری کامل صفحه
        await adminPage.waitForLoadState('domcontentloaded');
        await adminPage.waitForLoadState('networkidle');
        
        // صبر اضافی برای صفحات سنگین
        if (page.name === 'پنل مدیریت' || page.name === 'گزارشات جمعیتی') {
          await adminPage.waitForTimeout(5000); // 5 ثانیه برای صفحات سنگین‌تر
        } else {
          await adminPage.waitForTimeout(2000); // 2 ثانیه برای بقیه صفحات
        }
        
        // بررسی موفق بودن درخواست
        const status = await adminPage.evaluate(() => document.readyState);
        expect(status).toBe('complete');
        
        // بررسی وجود محتوا در صفحه
        const hasContent = await adminPage.evaluate(() => {
          const bodyContent = document.body?.textContent || '';
          return bodyContent.length > 100 && 
            !bodyContent.includes('خطای 404') && 
            !bodyContent.includes('500 Internal Server Error');
        });
        expect(hasContent).toBeTruthy();
        
        // گرفتن اسکرین‌شات
        await adminPage.screenshot({ 
          path: `./test-results/screenshots/${safeName}.png`,
          fullPage: true
        });
        
        // کلیک در صفحه برای دیدن تغییرات در ویدیو
        await videoPage.click('body');
        
        // کمی مکث قبل از بستن صفحه برای ذخیره ویدیو
        await videoPage.waitForTimeout(1000);
        
        // بستن صفحه ویدیو 
        await videoPage.close();
        await testContext.close();
        
        console.log(`✅ صفحه ${page.name} با موفقیت بررسی شد`);
        
      } catch (error) {
        console.error(`❌ خطا در بررسی صفحه ${page.name}:`, error);
        
        // اسکرین‌شات در صورت خطا
        const safeName = createSafeFileName(page.path);
        await adminPage.screenshot({ 
          path: `./test-results/errors/${safeName}-error.png`,
          fullPage: true 
        });
        
        throw error;
      }
    });
  }
  
  // ------------------------------------
  // بستن صفحه در پایان تست‌ها
  // ------------------------------------
  test.afterAll(async () => {
    try {
      if (adminPage) {
        console.log('🚪 در حال خروج از سیستم...');
        
        // کلیک روی آواتار کاربر
        await adminPage.locator('img[src*="avatar/man.svg"]').click();
        
        // کلیک روی دکمه خروج
        await adminPage.locator('div.text:has-text("خروج")').click();
        
        // انتظار برای لاگ‌اوت
        await adminPage.waitForLoadState('networkidle');
        
        // بررسی موفقیت لاگ‌اوت
        const url = adminPage.url();
        expect(url).toContain('/login');
        console.log('✅ خروج از سیستم با موفقیت انجام شد');
      }
    } catch (error) {
      console.error('❌ خطا در هنگام خروج از سیستم:', error);
    }
  });
});

