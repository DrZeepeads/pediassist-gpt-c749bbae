
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Moon, Sun, Globe } from 'lucide-react';
import { 
  STORAGE_KEYS, 
  ThemeType, 
  FontSizeType, 
  LanguageType, 
  setStorageItem, 
  applyTheme, 
  applyFontSize 
} from '@/utils/settingsUtils';

interface AppearanceTabProps {
  theme: ThemeType;
  setTheme: React.Dispatch<React.SetStateAction<ThemeType>>;
  fontSize: FontSizeType;
  setFontSize: React.Dispatch<React.SetStateAction<FontSizeType>>;
  language: LanguageType;
  setLanguage: React.Dispatch<React.SetStateAction<LanguageType>>;
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({
  theme,
  setTheme,
  fontSize,
  setFontSize,
  language,
  setLanguage
}) => {
  const { toast } = useToast();

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    setStorageItem(STORAGE_KEYS.THEME, newTheme);
    applyTheme(newTheme);
    toast({
      title: "Theme updated",
      description: `Theme set to ${newTheme} mode`,
    });
  };

  const handleFontSizeChange = (newSize: FontSizeType) => {
    setFontSize(newSize);
    setStorageItem(STORAGE_KEYS.FONT_SIZE, newSize);
    applyFontSize(newSize);
    toast({
      title: "Font size updated",
      description: `Font size set to ${newSize}`,
    });
  };

  const handleLanguageChange = (newLanguage: LanguageType) => {
    setLanguage(newLanguage);
    setStorageItem(STORAGE_KEYS.LANGUAGE, newLanguage);
    toast({
      title: "Language updated",
      description: `Language set to ${newLanguage}`,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Manage your app theme preference</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun className="h-5 w-5" />
              <Label htmlFor="theme-light">Light Mode</Label>
            </div>
            <Switch 
              id="theme-light"
              checked={theme === 'light'}
              onCheckedChange={() => handleThemeChange('light')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Moon className="h-5 w-5" />
              <Label htmlFor="theme-dark">Dark Mode</Label>
            </div>
            <Switch 
              id="theme-dark"
              checked={theme === 'dark'}
              onCheckedChange={() => handleThemeChange('dark')}
            />
          </div>
          
          <div className="pt-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Select value={fontSize} onValueChange={handleFontSizeChange as (value: string) => void}>
              <SelectTrigger id="font-size" className="mt-1">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>Choose your preferred language</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="h-5 w-5" />
            <Label htmlFor="language-select">Interface Language</Label>
          </div>
          <Select value={language} onValueChange={handleLanguageChange as (value: string) => void}>
            <SelectTrigger id="language-select">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="chinese">Chinese</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
};
