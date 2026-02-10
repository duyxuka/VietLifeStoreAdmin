export function registerLocale(locale: string) {
  switch (locale) {
    case 'vi':
      return import('@angular/common/locales/vi').then((m) => m.default);
    case 'fr':
      return import('@angular/common/locales/fr').then((m) => m.default);
    default:
      return import('@angular/common/locales/en').then((m) => m.default);
  }
}
