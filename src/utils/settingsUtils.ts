
// Utility functions for handling settings storage and retrieval

export const STORAGE_KEYS = {
  THEME: 'nelson-theme',
  FONT_SIZE: 'nelson-font-size',
  NOTIFICATIONS: 'nelson-notifications',
  LANGUAGE: 'nelson-language',
  HIGH_CONTRAST: 'nelson-high-contrast',
  AUTO_READ: 'nelson-auto-read',
  SOUND_EFFECTS: 'nelson-sound-effects',
  CHAT_MESSAGES: 'nelson-chat-messages',
  SEARCH_HISTORY: 'nelson-search-history'
};

export type ThemeType = 'light' | 'dark';
export type FontSizeType = 'small' | 'medium' | 'large';
export type LanguageType = 'english' | 'spanish' | 'french' | 'german' | 'chinese';

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  const storedValue = localStorage.getItem(key);
  if (storedValue === null) return defaultValue;
  
  try {
    if (typeof defaultValue === 'boolean') {
      return (storedValue === 'true') as unknown as T;
    }
    return storedValue as unknown as T;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setStorageItem = (key: string, value: string | boolean): void => {
  try {
    localStorage.setItem(key, String(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

export const applyTheme = (theme: ThemeType): void => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
};

export const applyFontSize = (fontSize: FontSizeType): void => {
  const sizeMap: Record<FontSizeType, string> = {
    small: '14px',
    medium: '16px',
    large: '18px',
  };
  document.documentElement.style.fontSize = sizeMap[fontSize];
};

export const applyHighContrast = (enabled: boolean): void => {
  document.documentElement.classList.toggle('high-contrast', enabled);
};

export const clearUserData = (): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate clearing with a delay
    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
      localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
      resolve();
    }, 1000);
  });
};

export const exportUserData = (): void => {
  // Collect all user data from localStorage
  const userData = {
    settings: {
      theme: getStorageItem<ThemeType>(STORAGE_KEYS.THEME, 'light'),
      fontSize: getStorageItem<FontSizeType>(STORAGE_KEYS.FONT_SIZE, 'medium'),
      notifications: getStorageItem<boolean>(STORAGE_KEYS.NOTIFICATIONS, false),
      language: getStorageItem<LanguageType>(STORAGE_KEYS.LANGUAGE, 'english'),
      highContrast: getStorageItem<boolean>(STORAGE_KEYS.HIGH_CONTRAST, false),
      autoReadMode: getStorageItem<boolean>(STORAGE_KEYS.AUTO_READ, false),
      soundEffects: getStorageItem<boolean>(STORAGE_KEYS.SOUND_EFFECTS, false)
    },
    chatMessages: JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES) || '[]'),
    searchHistory: JSON.parse(localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY) || '[]')
  };
  
  // Convert to JSON and create download link
  const dataStr = JSON.stringify(userData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'nelson-gpt-data.json';
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};
