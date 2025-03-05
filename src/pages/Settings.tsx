
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw, Moon, Sun, Trash } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [theme, setTheme] = useState(localStorage.getItem('nelson-theme') || 'light');
  const [fontSize, setFontSize] = useState(localStorage.getItem('nelson-font-size') || 'medium');
  const [notifications, setNotifications] = useState(localStorage.getItem('nelson-notifications') === 'true');
  const [clearingHistory, setClearingHistory] = useState(false);

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

  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="text-muted-foreground">Customize your Nelson-GPT experience</p>
      
      <Tabs defaultValue="appearance">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
