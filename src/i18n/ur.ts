import type { Translation } from './en';

/**
 * Urdu (RTL). Core navigation strings are translated; the rest are marked TODO and need review by a native
 * speaker (card QA-03). Keys must match en.ts exactly.
 */
const ur: Translation = {
  common: {
    appName: 'کائزن یوگا',
    tagline: 'چھوٹے قدم۔ پرسکون دن۔',
    next: 'آگے',
    back: 'واپس',
    skip: 'چھوڑیں',
    continue: 'جاری رکھیں',
    done: 'مکمل',
    cancel: 'منسوخ',
    close: 'بند کریں',
    save: 'محفوظ کریں',
    start: 'شروع کریں',
    retry: 'دوبارہ کوشش کریں',
    seeAll: 'سب دیکھیں',
    loading: 'لوڈ ہو رہا ہے…',
    comingSoon: 'جلد آ رہا ہے',
    minutes: '{{count}} منٹ',
    prototype: 'پروٹوٹائپ — کوئی حقیقی خریداری نہیں',
  },
  tabs: {
    home: 'ہوم',
    explore: 'دریافت',
    practice: 'مشق',
    progress: 'پیش رفت',
    profile: 'پروفائل',
  },
  a11y: {
    closeSheet: 'بند کریں',
    goBack: 'واپس جائیں',
    skipIntro: 'تعارف چھوڑیں',
    showPassword: 'پاس ورڈ دکھائیں',
    hidePassword: 'پاس ورڈ چھپائیں',
    favorite: 'پسندیدہ میں شامل کریں',
    unfavorite: 'پسندیدہ سے ہٹائیں',
  },
  languages: {
    en: 'English',
    ur: 'اردو',
  },
  comingSoon: {
    title: 'یہ جلد آ رہا ہے',
    body: 'ہم اس حصے پر ابھی کام کر رہے ہیں۔ آپ کے صبر کا شکریہ۔', // TODO review
    cta: 'ہوم پر واپس',
  },
  dev: {
    uiKit: 'UI کٹ',
    characters: 'کردار شیٹ',
  },
};

export default ur;
