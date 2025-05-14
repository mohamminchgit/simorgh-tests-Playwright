import { defineConfig, chromium } from '@playwright/test';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import fs from 'fs';
import path from 'path';


dayjs.extend(utc);
dayjs.extend(timezone);

// دریافت نسخه سایت از span[smgversion]
async function getVersionFromPage() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--ignore-certificate-errors'],
  });

  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  try {
    await page.goto('https://crm7.simorgh34000.test', { waitUntil: 'domcontentloaded' });
    const version = await page.locator('[smgversion]').innerText();
    await browser.close();
    return version || 'unknown';
  } catch (e) {
    await browser.close();
    return 'unknown';
  }
}

// تابع برای تبدیل تاریخ میلادی به شمسی
function convertToJalali(date) {
  const jalaliDate = dayjs(date).locale('fa').format('YYYY-MM-DD');
  return jalaliDate;
}

// زمان با فرمت ایران
const timestamp = dayjs().tz('Asia/Tehran').format('YYYY-MM-DD_HH-mm-ss');
const jalaliDate = convertToJalali(new Date()); // تاریخ شمسی امروز

export default (async () => {
  const version = await getVersionFromPage();
  const reportDir = `.playwright-report/${jalaliDate}/report-${version}-${timestamp}`;

  // ایجاد پوشه برای ذخیره گزارشات

  const dirPath = path.dirname(reportDir);
  
  if (!fs.existsSync(dirPath)){
      fs.mkdirSync(dirPath, { recursive: true });
  }

  return defineConfig({
    testDir: './tests',
    timeout: 30000,
    retries: 0,
    use: {
      baseURL: 'https://crm7.simorgh34000.test',
      headless: false,
      ignoreHTTPSErrors: true,
      screenshot: 'on',
      video: 'on', // برای تست های شکست خورده retain-on-failure // همیشه on
      viewport: { width: 1920, height: 1080 }
    },
    reporter: [['html', { outputFolder: reportDir, open: 'never' }]],
  });
})();
