
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { STORAGE_KEYS, setStorageItem, applyHighContrast } from '@/utils/settingsUtils';

interface AccessibilityTabProps {
  highContrast: boolean;
  setHighContrast: React.Dispatch<React.SetStateAction<boolean>>;
  autoReadMode: boolean;
  setAutoReadMode: React.Dispatch<React.SetStateAction<boolean>>;
  soundEffects: boolean;
  setSoundEffects: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AccessibilityTab: React.FC<AccessibilityTabProps> = ({
  highContrast,
  setHighContrast,
  autoReadMode,
  setAutoReadMode,
  soundEffects,
  setSoundEffects
}) => {
  const { toast } = useToast();

  const handleHighContrastChange = (enabled: boolean) => {
    setHighContrast(enabled);
    setStorageItem(STORAGE_KEYS.HIGH_CONTRAST, enabled);
    applyHighContrast(enabled);
    toast({
      title: enabled ? "High contrast enabled" : "High contrast disabled",
      description: enabled ? "High contrast mode is now active" : "High contrast mode is now inactive",
    });
  };

  const handleAutoReadChange = (enabled: boolean) => {
    setAutoReadMode(enabled);
    setStorageItem(STORAGE_KEYS.AUTO_READ, enabled);
    toast({
      title: enabled ? "Auto-read enabled" : "Auto-read disabled",
      description: enabled ? "Responses will be read aloud automatically" : "Auto-read mode is now disabled",
    });
  };

  const handleSoundEffectsChange = (enabled: boolean) => {
    setSoundEffects(enabled);
    setStorageItem(STORAGE_KEYS.SOUND_EFFECTS, enabled);
    toast({
      title: enabled ? "Sound effects enabled" : "Sound effects disabled",
      description: enabled ? "You will now hear sound effects" : "Sound effects are now disabled",
    });
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
};
