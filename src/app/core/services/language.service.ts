import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'en' | 'ka' | 'ru';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translate = inject(TranslateService);

  private readonly LANGUAGE_KEY = 'app-language';

  currentLanguage = signal<Language>(this.getInitialLanguage());

  readonly availableLanguages: LanguageOption[] = [
    { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  constructor() {
    // Initialize translate service
    this.translate.addLangs(['en', 'ka', 'ru']);
    this.translate.setDefaultLang('ka');
    this.setLanguage(this.currentLanguage());
  }

  private getInitialLanguage(): Language {
    // Check localStorage first
    const savedLang = localStorage.getItem(this.LANGUAGE_KEY) as Language;
    if (savedLang && ['en', 'ka', 'ru'].includes(savedLang)) {
      return savedLang;
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'ka' || browserLang === 'ru') {
      return browserLang as Language;
    }

    // Default to Georgian
    return 'ka';
  }

  setLanguage(lang: Language): void {
    this.translate.use(lang);
    this.currentLanguage.set(lang);
    localStorage.setItem(this.LANGUAGE_KEY, lang);
    document.documentElement.lang = lang;
  }

  getCurrentLanguageOption(): LanguageOption {
    return this.availableLanguages.find(l => l.code === this.currentLanguage())
      || this.availableLanguages[0];
  }

  getNextLanguage(): LanguageOption {
    const currentIndex = this.availableLanguages.findIndex(l => l.code === this.currentLanguage());
    const nextIndex = (currentIndex + 1) % this.availableLanguages.length;
    return this.availableLanguages[nextIndex];
  }

  cycleLanguage(): void {
    const nextLang = this.getNextLanguage();
    this.setLanguage(nextLang.code);
  }
}

