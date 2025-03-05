
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw, Moon, Sun, Trash, Download, Globe, ToggleLeft, BellRing, Volume2, VolumeX, Languages } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState(localStorage.getItem('nelson-theme') || 'light');
  const [fontSize, setFontSize] = useState(localStorage.getItem('nelson-font-size') || 'medium');
  const [notifications, setNotifications] = useState(localStorage.getItem('nelson-notifications') === 'true');
  const [clearingHistory, setClearingHistory] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('nelson-language') || 'english');
  const [highContrast, setHighContrast] = useState(localStorage.getItem('nelson-high-contrast') === 'true');
  const [autoReadMode, setAutoReadMode] = useState(localStorage.getItem('nelson-auto-read') === 'true');
  const [soundEffects, setSoundEffects] = useState(localStorage.getItem('nelson-sound-effects') === 'true');
  const [exportingData, setExportingData] = useState(false);

  // Apply settings on initial load
  useEffect(() => {
    // Apply theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Apply font size
    const sizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    document.documentElement.style.fontSize = sizeMap[fontSize as keyof typeof sizeMap];
    
    // Apply high contrast if enabled
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [theme, fontSize, highContrast]);

  // Theme handling
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('nelson-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    toast({
      title: "Theme updated",
      description: `Theme set to ${newTheme} mode`,
    });
  };

  // Font size handling
  const handleFontSizeChange = (newSize: string) => {
    setFontSize(newSize);
    localStorage.setItem('nelson-font-size', newSize);
    
    // Apply font size to body
    const sizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    document.documentElement.style.fontSize = sizeMap[newSize as keyof typeof sizeMap];
    
    toast({
      title: "Font size updated",
      description: `Font size set to ${newSize}`,
    });
  };

  // Notifications handling
  const handleNotificationsChange = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem('nelson-notifications', enabled.toString());
    toast({
      title: enabled ? "Notifications enabled" : "Notifications disabled",
      description: enabled ? "You will now receive notifications" : "You will no longer receive notifications",
    });
  };

  // Language handling
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('nelson-language', newLanguage);
    toast({
      title: "Language updated",
      description: `Language set to ${newLanguage}`,
    });
  };

  // High contrast mode
  const handleHighContrastChange = (enabled: boolean) => {
    setHighContrast(enabled);
    localStorage.setItem('nelson-high-contrast', enabled.toString());
    document.documentElement.classList.toggle('high-contrast', enabled);
    toast({
      title: enabled ? "High contrast enabled" : "High contrast disabled",
      description: enabled ? "High contrast mode is now active" : "High contrast mode is now inactive",
    });
  };

  // Auto-read mode
  const handleAutoReadChange = (enabled: boolean) => {
    setAutoReadMode(enabled);
    localStorage.setItem('nelson-auto-read', enabled.toString());
    toast({
      title: enabled ? "Auto-read enabled" : "Auto-read disabled",
      description: enabled ? "Responses will be read aloud automatically" : "Auto-read mode is now disabled",
    });
  };

  // Sound effects
  const handleSoundEffectsChange = (enabled: boolean) => {
    setSoundEffects(enabled);
    localStorage.setItem('nelson-sound-effects', enabled.toString());
    toast({
      title: enabled ? "Sound effects enabled" : "Sound effects disabled",
      description: enabled ? "You will now hear sound effects" : "Sound effects are now disabled",
    });
  };

  // Clear history function
  const clearHistory = () => {
    setClearingHistory(true);
    
    // Simulate clearing with a delay
    setTimeout(() => {
      localStorage.removeItem('nelson-chat-messages');
      localStorage.removeItem('nelson-search-history');
      setClearingHistory(false);
      toast({
        title: "History cleared",
        description: "Your chat and search history has been cleared",
      });
    }, 1000);
  };

  // Export data function
  const exportData = () => {
    setExportingData(true);
    
    // Collect all user data from localStorage
    const userData = {
      settings: {
        theme,
        fontSize,
        notifications,
        language,
        highContrast,
        autoReadMode,
        soundEffects
      },
      chatMessages: JSON.parse(localStorage.getItem('nelson-chat-messages') || '[]'),
      searchHistory: JSON.parse(localStorage.getItem('nelson-search-history') || '[]')
    };
    
    // Convert to JSON and create download link
    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'nelson-gpt-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setTimeout(() => {
      setExportingData(false);
      toast({
        title: "Data exported",
        description: "Your data has been exported successfully",
      });
    }, 1000);
  };

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
        <TabsContent value="appearance" className="space-y-4">
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
                <Select value={fontSize} onValueChange={handleFontSizeChange}>
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
              <Select value={language} onValueChange={handleLanguageChange}>
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
        </TabsContent>
        
        {/* Accessibility Tab */}
        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visual Settings</CardTitle>
              <CardDescription>Customize visual accessibility options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">Increase contrast for better readability</p>
                </div>
                <Switch 
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={handleHighContrastChange}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Audio Settings</CardTitle>
              <CardDescription>Customize audio accessibility options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-read">Auto-Read Responses</Label>
                  <p className="text-sm text-muted-foreground">Have responses read aloud automatically</p>
                </div>
                <Switch 
                  id="auto-read"
                  checked={autoReadMode}
                  onCheckedChange={handleAutoReadChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound-effects">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">Enable or disable interface sound effects</p>
                </div>
                <Switch 
                  id="sound-effects"
                  checked={soundEffects}
                  onCheckedChange={handleSoundEffectsChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>Manage your privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features</p>
                </div>
                <Switch 
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={handleNotificationsChange}
                />
              </div>
              
              <div className="border-t pt-4 mt-4">
                <Label>Export Your Data</Label>
                <p className="text-sm text-muted-foreground mb-2">Download a copy of your personal data</p>
                <Button 
                  variant="outline" 
                  onClick={exportData}
                  disabled={exportingData}
                  className="flex items-center gap-2"
                >
                  {exportingData ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export Data
                    </>
                  )}
                </Button>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <Label>Clear History</Label>
                <p className="text-sm text-muted-foreground mb-2">Remove all your chat and search history</p>
                <Button 
                  variant="destructive" 
                  onClick={clearHistory}
                  disabled={clearingHistory}
                  className="flex items-center gap-2"
                >
                  {clearingHistory ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <Trash className="h-4 w-4" />
                      Clear All History
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* About Tab */}
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Nelson-GPT</CardTitle>
              <CardDescription>Information about this application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Version</h3>
                <p className="text-sm text-muted-foreground">1.0.0</p>
              </div>
              
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">
                  Nelson-GPT is an AI-powered pediatric information assistant based on the Nelson Textbook of Pediatrics.
                  It provides evidence-based information on pediatric conditions, treatments, and guidelines.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Source</h3>
                <p className="text-sm text-muted-foreground">
                  The information provided is sourced from the Nelson Textbook of Pediatrics, a comprehensive reference for pediatric medicine.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Disclaimer</h3>
                <p className="text-sm text-muted-foreground">
                  This application is for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
                  Always seek the advice of your physician or other qualified health provider with any questions you may have.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Contact</h3>
                <p className="text-sm text-muted-foreground">
                  For support or feedback, please contact us at support@nelson-gpt.com
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">Acknowledgements</h3>
                <p className="text-sm text-muted-foreground">
                  We would like to thank the authors and publishers of the Nelson Textbook of Pediatrics for their invaluable contribution to pediatric medicine.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
