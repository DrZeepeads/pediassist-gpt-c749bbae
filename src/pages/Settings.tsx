
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppearanceTab } from '@/components/settings/AppearanceTab';
import { AccessibilityTab } from '@/components/settings/AccessibilityTab';
import { PrivacyTab } from '@/components/settings/PrivacyTab';
import { AboutTab } from '@/components/settings/AboutTab';
import { 
  STORAGE_KEYS, 
  ThemeType, 
  FontSizeType, 
  LanguageType, 
  getStorageItem,
  applyTheme,
  applyFontSize,
  applyHighContrast
} from '@/utils/settingsUtils';

const Settings = () => {
  // State hooks for all settings
  const [theme, setTheme] = useState<ThemeType>(
    getStorageItem<ThemeType>(STORAGE_KEYS.THEME, 'light')
  );
  const [fontSize, setFontSize] = useState<FontSizeType>(
    getStorageItem<FontSizeType>(STORAGE_KEYS.FONT_SIZE, 'medium')
  );
  const [notifications, setNotifications] = useState(
    getStorageItem<boolean>(STORAGE_KEYS.NOTIFICATIONS, false)
  );
  const [language, setLanguage] = useState<LanguageType>(
    getStorageItem<LanguageType>(STORAGE_KEYS.LANGUAGE, 'english')
  );
  const [highContrast, setHighContrast] = useState(
    getStorageItem<boolean>(STORAGE_KEYS.HIGH_CONTRAST, false)
  );
  const [autoReadMode, setAutoReadMode] = useState(
    getStorageItem<boolean>(STORAGE_KEYS.AUTO_READ, false)
  );
  const [soundEffects, setSoundEffects] = useState(
    getStorageItem<boolean>(STORAGE_KEYS.SOUND_EFFECTS, false)
  );

  // Apply settings on initial load
  useEffect(() => {
    applyTheme(theme);
    applyFontSize(fontSize);
    applyHighContrast(highContrast);
  }, [theme, fontSize, highContrast]);

  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-muted-foreground">Customize your Nelson-GPT experience</p>
      
      <Tabs defaultValue="appearance">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <AppearanceTab 
            theme={theme}
            setTheme={setTheme}
            fontSize={fontSize}
            setFontSize={setFontSize}
            language={language}
            setLanguage={setLanguage}
          />
        </TabsContent>
        
        {/* Accessibility Tab */}
        <TabsContent value="accessibility">
          <AccessibilityTab 
            highContrast={highContrast}
            setHighContrast={setHighContrast}
            autoReadMode={autoReadMode}
            setAutoReadMode={setAutoReadMode}
            soundEffects={soundEffects}
            setSoundEffects={setSoundEffects}
          />
        </TabsContent>
        
        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <PrivacyTab 
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </TabsContent>
        
        {/* About Tab */}
        <TabsContent value="about">
          <AboutTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
