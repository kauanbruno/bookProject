import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  
  private currentLang: string;
  
  private translations: { [lang: string]: { [key: string]: string } } = {
    'pt': {
      'To Read': 'A Ler',
      'Reading': 'Lendo',
      'Completed': 'Concluído',
      'Available': 'Disponível'
    },
    'en': {
      'To Read': 'To Read',
      'Reading': 'Reading',
      'Completed': 'Completed',
      'Available': 'Available'
    },
    'es': {
      'To Read': 'Por Leer',
      'Reading': 'Leyendo',
      'Completed': 'Completado',
      'Available': 'Disponible'
    }
  };

  constructor() {
    const browserLang = navigator.language.split('-')[0];
    this.currentLang = this.translations[browserLang] ? browserLang : 'pt';
  }

  translateStatus(status: string): string {
    const langTranslations = this.translations[this.currentLang];
    return langTranslations[status] || status;
  }

  translateAvailable(): string {
    return this.translations[this.currentLang]['Available'] || 'Available';
  }

  getCurrentLang(): string {
    return this.currentLang;
  }

  setLanguage(lang: string): void {
    if (this.translations[lang]) {
      this.currentLang = lang;
    }
  }

  getStatusLabel(status: string): string {
    return this.translateStatus(status);
  }

  getAvailableLabel(): string {
    return this.translateAvailable();
  }
}