# i18n Implementation Plan — Multi-language CV Builder (فارسی & English)

## Overview
Comprehensive internationalization (i18n) strategy for supporting both **Persian (فارسی)** and **English** with:
- RTL (Right-to-Left) for Persian, LTR (Left-to-Right) for English
- Language-aware date/time formatting
- Regional currency handling
- Culturally adapted templates
- Database multilingual content support

---

## Tech Stack

### Frontend
- **Library:** `next-intl` (Next.js 14+ native support)
- **Styling:** Tailwind CSS with RTL plugin (`tailwindcss-rtl`)
- **Date/Time:** `date-fns` with Persian locale
- **Forms:** React Hook Form + Zod (translated validation messages)
- **Icons:** Heroicons (direction-agnostic SVGs)
- **UI Components:** shadcn/ui with RTL wrapper

### Backend
- **Library:** `i18next` (Node.js/Express)
- **Storage:** Prisma + PostgreSQL (localized content in DB)
- **Validation:** Zod with localized error messages

### DevOps
- **Translation Management:** Crowdin or i18next-locize (optional cloud sync)
- **Static Export:** JSON files in `/public/locales`

---

## Project Structure

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── [locale]/
│   │   │   │   ├── (public)/
│   │   │   │   │   ├── page.tsx           (landing)
│   │   │   │   │   ├── login/page.tsx
│   │   │   │   │   ├── register/page.tsx
│   │   │   │   │   └── pricing/page.tsx
│   │   │   │   └── (dashboard)/
│   │   │   │       ├── layout.tsx         (dashboard shell)
│   │   │   │       ├── page.tsx           (dashboard home)
│   │   │   │       ├── resumes/
│   │   │   │       ├── cover-letters/
│   │   │   │       └── settings/
│   │   │   └── layout.tsx                 (root with locale provider)
│   │   ├── components/
│   │   │   ├── locale-switcher/          (language toggle)
│   │   │   ├── ui/                       (all RTL-aware)
│   │   │   ├── resume-builder/
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── useLocale.ts
│   │   │   ├── useTranslations.ts
│   │   │   ├── useRTL.ts
│   │   │   └── useDateFormatter.ts
│   │   ├── lib/
│   │   │   ├── i18n.ts                   (i18n config)
│   │   │   ├── translations.ts           (server-side)
│   │   │   ├── date-locales.ts
│   │   │   └── rtl-utils.ts
│   │   ├── messages/
│   │   │   ├── en.json                   (English translations)
│   │   │   ├── fa.json                   (Persian translations)
│   │   │   └── validation-messages/
│   │   │       ├── en.json
│   │   │       └── fa.json
│   │   ├── styles/
│   │   │   ├── globals.css               (RTL support)
│   │   │   └── rtl.css
│   │   └── types/
│   │       └── i18n.ts
│   ├── public/
│   │   ├── locales/                      (static translation files)
│   │   │   ├── en/
│   │   │   │   ├── common.json
│   │   │   │   ├── auth.json
│   │   │   │   ├── resume.json
│   │   │   │   └── errors.json
│   │   │   └── fa/
│   │   │       ├── common.json
│   │   │       ├── auth.json
│   │   │       ├── resume.json
│   │   │       └── errors.json
│   │   └── templates/
│   │       ├── modern-en/
│   │       └── modern-fa/
│   ├── next.config.js
│   ├── next-intl.config.ts               (next-intl configuration)
│   └── tailwind.config.ts                (RTL plugin)
│
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── app.ts
│   │   ├── config/
│   │   │   ├── i18n.ts                   (i18next config)
│   │   │   └── locales.ts                (supported locales)
│   │   ├── middleware/
│   │   │   ├── i18nMiddleware.ts         (detect & set locale)
│   │   │   ├── errorHandler.ts           (localized error messages)
│   │   │   └── validateBody.ts           (localized validation)
│   │   ├── messages/
│   │   │   ├── en/
│   │   │   │   ├── errors.json
│   │   │   │   └── success.json
│   │   │   └── fa/
│   │   │       ├── errors.json
│   │   │       └── success.json
│   │   ├── services/
│   │   │   ├── i18nService.ts            (translation & locale logic)
│   │   │   ├── templateService.ts        (locale-aware templates)
│   │   │   └── dateFormatter.ts          (Persian/English dates)
│   │   ├── validators/
│   │   │   └── localized-schemas.ts      (Zod with i18n)
│   │   └── types/
│   │       └── i18n.ts
│   ├── prisma/
│   │   └── schema.prisma                 (multilingual support)
│   └── ...
│
└── shared/
    ├── types/
    │   └── i18n.ts                       (shared locale types)
    └── constants/
        └── locales.ts                    (supported languages)
```

---

## Database Schema Updates

### 1. Users Table (Extended)
```sql
ALTER TABLE users ADD COLUMN (
  preferred_language VARCHAR(5) DEFAULT 'en',  -- 'en' or 'fa'
  date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD', -- locale-specific
  timezone VARCHAR(50) DEFAULT 'UTC'
);
```

### 2. Templates Table (Localized)
```sql
ALTER TABLE templates ADD COLUMN (
  translations JSONB -- {"en": {"name":"Modern","description":"..."}, "fa": {...}}
);

-- Example:
-- translations: {
--   "en": {
--     "name": "Modern Professional",
--     "description": "Clean modern design for tech roles"
--   },
--   "fa": {
--     "name": "حرفه‌ای مدرن",
--     "description": "طراحی تمیز و مدرن برای نقش‌های فناوری"
--   }
-- }
```

### 3. Cover Letters Table (Localized)
```sql
ALTER TABLE cover_letters ADD COLUMN (
  language VARCHAR(5) DEFAULT 'en'
);
```

### 4. Audit/Logs Table (for localized messages)
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100),
  resource_type VARCHAR(50),
  resource_id UUID,
  language VARCHAR(5),
  message_key VARCHAR(100),  -- 'auth.login_success', 'resume.created', etc.
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Frontend Implementation

### 1. Next.js 14 Configuration (next-intl)

**next-intl.config.ts:**
```typescript
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'fa'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale)) notFound();

  return {
    messages: (await import(`./src/messages/${locale}.json`)).default,
    timeZone: 'UTC',
    defaultTranslationValues: {
      // Global defaults
      br: () => <br />,
      strong: (chunks) => <strong>{chunks}</strong>,
    },
  };
});
```

**next.config.js:**
```javascript
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./next-intl.config.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'fa'],
    defaultLocale: 'en',
  },
};

module.exports = withNextIntl(nextConfig);
```

### 2. Tailwind RTL Support

**tailwind.config.ts:**
```typescript
import rtlPlugin from 'tailwindcss-rtl';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      direction: ['rtl', 'ltr'],
    },
  },
  plugins: [rtlPlugin],
  corePlugins: {
    direction: true,
  },
};
```

**globals.css:**
```css
/* RTL Support */
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

[dir="ltr"] {
  direction: ltr;
  text-align: left;
}

/* Automatic margin/padding flip for RTL */
[dir="rtl"] .ml-4 { @apply mr-4 ml-0; }
[dir="rtl"] .mr-4 { @apply ml-4 mr-0; }
/* ... etc for all margin/padding utilities */
```

### 3. Root Layout with Locale Provider

**app/layout.tsx:**
```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'fa'];

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {/* Theme Provider, Auth Provider, etc. */}
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 4. Translation Files

**src/messages/en.json:**
```json
{
  "common": {
    "appName": "CV Builder",
    "language": "Language",
    "english": "English",
    "persian": "فارسی",
    "loading": "Loading...",
    "error": "An error occurred",
    "success": "Success!"
  },
  "auth": {
    "login": "Login",
    "register": "Register",
    "email": "Email",
    "password": "Password",
    "forgotPassword": "Forgot Password?",
    "noAccount": "Don't have an account?",
    "loginSuccess": "Logged in successfully",
    "registerSuccess": "Account created successfully"
  },
  "resume": {
    "myResumes": "My Resumes",
    "createNew": "Create New Resume",
    "editResume": "Edit Resume",
    "preview": "Preview",
    "export": "Export",
    "exportPDF": "Export as PDF",
    "sections": {
      "personalDetails": "Personal Details",
      "summary": "Professional Summary",
      "workExperience": "Work Experience",
      "education": "Education",
      "skills": "Skills",
      "languages": "Languages",
      "certifications": "Certifications"
    }
  },
  "validation": {
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email address",
    "passwordTooShort": "Password must be at least 8 characters"
  }
}
```

**src/messages/fa.json:**
```json
{
  "common": {
    "appName": "سازنده رزومه",
    "language": "زبان",
    "english": "English",
    "persian": "فارسی",
    "loading": "در حال بارگیری...",
    "error": "خطایی رخ داد",
    "success": "موفقیت!"
  },
  "auth": {
    "login": "ورود",
    "register": "ثبت‌نام",
    "email": "ایمیل",
    "password": "رمز عبور",
    "forgotPassword": "رمز عبور را فراموش کردید؟",
    "noAccount": "حساب کاربری ندارید؟",
    "loginSuccess": "ورود با موفقیت انجام شد",
    "registerSuccess": "حساب کاربری با موفقیت ایجاد شد"
  },
  "resume": {
    "myResumes": "رزومه‌های من",
    "createNew": "ایجاد رزومه جدید",
    "editResume": "ویرایش رزومه",
    "preview": "پیش‌نمایش",
    "export": "صادر کردن",
    "exportPDF": "صادر کردن به صورت PDF",
    "sections": {
      "personalDetails": "مشخصات شخصی",
      "summary": "خلاصه حرفه‌ای",
      "workExperience": "تجربه کاری",
      "education": "تحصیلات",
      "skills": "مهارت‌ها",
      "languages": "زبان‌ها",
      "certifications": "گواهینامه‌ها"
    }
  },
  "validation": {
    "required": "این فیلد الزامی است",
    "invalidEmail": "لطفاً ایمیل معتبر وارد کنید",
    "passwordTooShort": "رمز عبور باید حداقل ۸ کاراکتر باشد"
  }
}
```

### 5. Custom Hooks

**hooks/useLocale.ts:**
```typescript
'use client';

import { useLocale as useNextIntlLocale } from 'next-intl';

export function useLocale() {
  const locale = useNextIntlLocale();
  return {
    locale,
    isRTL: locale === 'fa',
    dir: locale === 'fa' ? 'rtl' : 'ltr',
  };
}
```

**hooks/useDateFormatter.ts:**
```typescript
'use client';

import { useLocale } from 'next-intl';
import { format } from 'date-fns';
import { fa } from 'date-fns/locale';

export function useDateFormatter() {
  const locale = useLocale();
  const isPersia = locale === 'fa';

  return (date: Date, formatStr: string = 'PPP') => {
    return format(date, formatStr, {
      locale: isPersia ? fa : undefined,
    });
  };
}
```

**hooks/useTranslations.ts:**
```typescript
'use client';

import { useTranslations as useNextIntlTranslations } from 'next-intl';

export function useTranslations(namespace?: string) {
  return useNextIntlTranslations(namespace);
}
```

### 6. Locale Switcher Component

**components/locale-switcher.tsx:**
```typescript
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from '@/hooks/useLocale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();

  const handleChange = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(/^\/(en|fa)/, '');
    router.push(`/${newLocale}${pathWithoutLocale || '/'}`);
  };

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="fa">فارسی</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

---

## Backend Implementation

### 1. i18next Configuration

**config/i18n.ts:**
```typescript
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

const locales = ['en', 'fa'];

i18next.use(Backend).init({
  fallbackLng: 'en',
  ns: ['errors', 'success', 'validation'],
  defaultNS: 'errors',
  backend: {
    loadPath: './src/messages/{{lng}}/{{ns}}.json',
  },
  detection: {
    order: ['header', 'cookie'],
    caches: ['cookie'],
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
```

**config/locales.ts:**
```typescript
export const SUPPORTED_LOCALES = ['en', 'fa'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_CONFIG: Record<Locale, { name: string; dir: 'ltr' | 'rtl' }> = {
  en: { name: 'English', dir: 'ltr' },
  fa: { name: 'فارسی', dir: 'rtl' },
};

export const DEFAULT_LOCALE: Locale = 'en';
```

### 2. Middleware - Auto-detect Locale

**middleware/i18nMiddleware.ts:**
```typescript
import { NextFunction, Request, Response } from 'express';
import i18next from 'i18next';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '../config/locales';

export function i18nMiddleware(req: Request, res: Response, next: NextFunction) {
  // Get locale from header (Accept-Language), cookie, or query param
  const localeFromHeader = req.get('Accept-Language')?.split(',')[0].split('-')[0];
  const localeFromCookie = req.cookies.locale;
  const localeFromQuery = req.query.locale as string;

  let locale = DEFAULT_LOCALE;

  if (SUPPORTED_LOCALES.includes(localeFromQuery as any)) {
    locale = localeFromQuery as any;
  } else if (SUPPORTED_LOCALES.includes(localeFromCookie as any)) {
    locale = localeFromCookie as any;
  } else if (SUPPORTED_LOCALES.includes(localeFromHeader as any)) {
    locale = localeFromHeader as any;
  }

  // Initialize i18next with detected locale
  i18next.changeLanguage(locale);

  // Attach to req object
  req.locale = locale;
  res.setHeader('Content-Language', locale);

  next();
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      locale?: string;
      t?: typeof i18next.t;
    }
  }
}
```

### 3. Error Handler with Localized Messages

**middleware/errorHandler.ts:**
```typescript
import { NextFunction, Request, Response } from 'express';
import i18next from 'i18next';

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const locale = req.locale || 'en';
  i18next.changeLanguage(locale);

  const statusCode = error.statusCode || 500;
  const messageKey = error.messageKey || 'errors.serverError';
  const message = i18next.t(messageKey, { defaultValue: error.message });

  res.status(statusCode).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message,
      ...(process.env.NODE_ENV === 'development' && { details: error.message }),
    },
  });
}
```

### 4. Localized Validation with Zod

**validators/localized-schemas.ts:**
```typescript
import { z } from 'zod';
import i18next from 'i18next';

export function createLocalizedSchema(locale: string) {
  i18next.changeLanguage(locale);

  return {
    registerSchema: z.object({
      email: z.string().email(i18next.t('validation.invalidEmail')),
      password: z
        .string()
        .min(8, i18next.t('validation.passwordTooShort')),
      fullName: z.string().min(2, i18next.t('validation.required')),
    }),
    loginSchema: z.object({
      email: z.string().email(i18next.t('validation.invalidEmail')),
      password: z.string().min(1, i18next.t('validation.required')),
    }),
    // ... more schemas
  };
}

// Middleware integration
export function validateBody(schemaKey: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const locale = req.locale || 'en';
    const schemas = createLocalizedSchema(locale);
    const schema = schemas[schemaKey as keyof ReturnType<typeof createLocalizedSchema>];

    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.flatten().fieldErrors,
      });
    }

    next();
  };
}
```

### 5. Backend Message Files

**src/messages/en/errors.json:**
```json
{
  "auth": {
    "invalidCredentials": "Invalid email or password",
    "emailAlreadyExists": "Email already registered",
    "tokenExpired": "Token has expired",
    "unauthorized": "Unauthorized access"
  },
  "resume": {
    "notFound": "Resume not found",
    "limitExceeded": "Resume limit exceeded for your plan",
    "invalidSection": "Invalid section type"
  },
  "errors": {
    "serverError": "An error occurred on the server"
  }
}
```

**src/messages/fa/errors.json:**
```json
{
  "auth": {
    "invalidCredentials": "ایمیل یا رمز عبور نادرست است",
    "emailAlreadyExists": "این ایمیل قبلاً ثبت شده است",
    "tokenExpired": "توکن منقضی شده است",
    "unauthorized": "دسترسی غیرمجاز"
  },
  "resume": {
    "notFound": "رزومه یافت نشد",
    "limitExceeded": "حد رزومه برای پلن شما تجاوز شده است",
    "invalidSection": "نوع بخش نامعتبر است"
  },
  "errors": {
    "serverError": "خطایی در سرور رخ داد"
  }
}
```

### 6. Date Formatting Service

**services/dateFormatter.ts:**
```typescript
import { format } from 'date-fns';
import { fa } from 'date-fns/locale';

type Locale = 'en' | 'fa';

export class DateFormatterService {
  static format(date: Date, locale: Locale, pattern: string = 'PPP'): string {
    return format(date, pattern, {
      locale: locale === 'fa' ? fa : undefined,
    });
  }

  static shortDate(date: Date, locale: Locale): string {
    return this.format(date, locale, 'PP');
  }

  static fullDateTime(date: Date, locale: Locale): string {
    return this.format(date, locale, 'PPPppp');
  }

  static yearMonth(date: Date, locale: Locale): string {
    return this.format(date, locale, 'MMMM yyyy');
  }
}
```

### 7. Template Service with Localization

**services/templateService.ts:**
```typescript
import { prisma } from '@/db';

export class TemplateService {
  static async getTemplatesForLocale(locale: 'en' | 'fa') {
    const templates = await prisma.template.findMany({
      where: { deleted_at: null },
    });

    return templates.map((template) => ({
      id: template.id,
      name: template.translations?.[locale]?.name || template.name,
      description:
        template.translations?.[locale]?.description || template.name,
      thumbnail_url: template.thumbnail_url,
      is_premium: template.is_premium,
    }));
  }

  static async getTemplateById(id: string, locale: 'en' | 'fa') {
    const template = await prisma.template.findUnique({ where: { id } });

    if (!template) return null;

    return {
      ...template,
      name: template.translations?.[locale]?.name || template.name,
      description:
        template.translations?.[locale]?.description || template.name,
    };
  }
}
```

---

## API Response Format (Localized)

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "locale": "fa",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "ایمیل یا رمز عبور نادرست است",
    "locale": "fa"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## PDF Generation with RTL Support

### Backend - Puppeteer Configuration

**services/exportService.ts:**
```typescript
import puppeteer from 'puppeteer';
import { LOCALE_CONFIG } from '@/config/locales';

export class ExportService {
  static async generatePDF(
    htmlContent: string,
    locale: 'en' | 'fa',
    options: any = {}
  ) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    const isRTL = locale === 'fa';

    // Set HTML with proper direction
    const styledHTML = `
      <!DOCTYPE html>
      <html dir="${isRTL ? 'rtl' : 'ltr'}" lang="${locale}">
      <head>
        <meta charset="UTF-8" />
        <style>
          * { direction: ${isRTL ? 'rtl' : 'ltr'}; }
          body { font-family: ${isRTL ? "'IRANSans', 'Tahoma'" : "'Segoe UI', Arial"}; }
        </style>
      </head>
      <body>${htmlContent}</body>
      </html>
    `;

    await page.setContent(styledHTML, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: 20, bottom: 20, left: 20, right: 20 },
      ...options,
    });

    await browser.close();
    return pdfBuffer;
  }
}
```

---

## Frontend - PDF Export

**components/resume-builder/export-panel.tsx:**
```typescript
'use client';

import { useLocale } from '@/hooks/useLocale';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';

export function ExportPanel({ resumeId }: { resumeId: string }) {
  const { locale, isRTL } = useLocale();
  const t = useTranslations('resume');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(
        `/api/resumes/${resumeId}/export/pdf`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': locale,
          },
        }
      );

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${new Date().getTime()}.pdf`;
      a.click();
    } catch (error) {
      console.error('Export error:', error);
      // Show error toast with localized message
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      <Button onClick={handleExportPDF} disabled={isExporting}>
        {isExporting ? t('common.loading') : t('resume.exportPDF')}
      </Button>
    </div>
  );
}
```

---

## Deployment Checklist

### Frontend
- [ ] Configure `next-intl` with all locales
- [ ] Add Tailwind RTL plugin
- [ ] Create translation files for both languages
- [ ] Test locale switching
- [ ] Verify RTL rendering on all pages
- [ ] Test date/time formatting per locale
- [ ] Verify SEO meta tags include `lang` attribute
- [ ] Test on mobile RTL devices
- [ ] Build and deploy to Vercel/hosting

### Backend
- [ ] Configure i18next with all message files
- [ ] Add i18n middleware to Express
- [ ] Update error handler with localized messages
- [ ] Create localized validation schemas
- [ ] Test Puppeteer with RTL PDF generation
- [ ] Update database schema for multilingual content
- [ ] Test API responses in both languages
- [ ] Configure Content-Language headers
- [ ] Test with different Accept-Language headers

### Testing
- [ ] Test authentication flows in both languages
- [ ] Test resume creation/editing in both languages
- [ ] Test PDF export in both languages (verify RTL)
- [ ] Test form validation messages
- [ ] Test error messages
- [ ] Test date formatting
- [ ] Cross-browser testing (Firefox, Chrome, Safari)
- [ ] Test on iOS/Android (RTL support)
- [ ] End-to-end (Playwright) tests for both locales

### Content & Assets
- [ ] Create Persian-specific templates
- [ ] Use appropriate fonts for Persian text (IRANSans, Tahoma, B Nazanin)
- [ ] Verify all template thumbnails work in both languages
- [ ] Test currency formatting if applicable
- [ ] Review Persian typography (no hyphenation, proper spacing)

---

## Common Persian/English Considerations

### Font Stack
```css
/* Persian-friendly font stack */
font-family: 'IRANSans', 'Segoe UI', Tahoma, sans-serif;

/* Fallback for body text in Persian */
font-family: 'B Nazanin', 'Tahoma', sans-serif;
```

### Date Format Examples
- **English:** January 15, 2024
- **Persian:** ۱۵ ژانویه ۲۰۲۴

### Number Formatting
- **English:** 1,234.56
- **Persian:** ۱۲۳۴٫۵۶

### Text Alignment
- **English:** Left-to-right text aligns left
- **Persian:** Right-to-left text aligns right

### Spacing & Padding Flip
```css
/* Automatically flip for RTL */
[dir="rtl"] .pl-4 { @apply pr-4 pl-0; }
[dir="rtl"] .ml-auto { @apply mr-auto ml-0; }
```

---

## SEO Optimization for i18n

**robots.txt:**
```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
Sitemap: https://yourdomain.com/fa/sitemap.xml
```

**next.config.js - Alternate Links:**
```typescript
export const alternateUrls = (pathname: string) => ({
  en: `https://yourdomain.com/en${pathname}`,
  fa: `https://yourdomain.com/fa${pathname}`,
});
```

---

## Testing Examples

### Unit Test - Date Formatter
```typescript
import { describe, it, expect } from 'vitest';
import { DateFormatterService } from '@/services/dateFormatter';

describe('DateFormatterService', () => {
  it('should format date in English', () => {
    const date = new Date('2024-01-15');
    const result = DateFormatterService.format(date, 'en', 'PP');
    expect(result).toBe('01/15/2024');
  });

  it('should format date in Persian', () => {
    const date = new Date('2024-01-15');
    const result = DateFormatterService.format(date, 'fa', 'PP');
    expect(result).toContain('۱۵');
  });
});
```

### E2E Test - Language Switching
```typescript
import { test, expect } from '@playwright/test';

test('should switch language from EN to FA', async ({ page }) => {
  await page.goto('/en');
  expect(await page.locator('html').getAttribute('dir')).toBe('ltr');
  
  await page.click('[data-test=locale-switcher]');
  await page.click('text=فارسی');
  
  await expect(page).toHaveURL('/fa');
  expect(await page.locator('html').getAttribute('dir')).toBe('rtl');
});
```

---

## Maintenance & Updates

### Adding New Translation Keys
1. Add to `src/messages/en.json`
2. Add equivalent to `src/messages/fa.json`
3. Use `useTranslations()` hook in components
4. Test in both languages

### Updating Translations
1. Use Crowdin for crowdsourced translations (optional)
2. Or manually update JSON files
3. Push to git, deploy
4. No rebuild needed if using dynamic loading

### Common Pitfalls to Avoid
- ❌ Hardcoding text in components
- ❌ Missing RTL styling for Persian
- ❌ Not testing PDF export in RTL
- ❌ Forgetting to translate error messages
- ❌ Using LTR-only UI components
- ❌ Not respecting user's preferred language preference

---

## Summary

This comprehensive i18n plan provides:
✅ Full Persian (فارسی) & English support  
✅ RTL/LTR automatic handling  
✅ Localized API responses  
✅ RTL-aware PDF generation  
✅ Proper date/time formatting per locale  
✅ Centralized translation management  
✅ SEO optimization for both languages  
✅ Scalable architecture for adding more languages  

**Ready to implement!**
