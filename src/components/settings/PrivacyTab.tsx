
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw, Trash, Download } from 'lucide-react';
import { STORAGE_KEYS, setStorageItem, clearUserData, exportUserData } from '@/utils/settingsUtils';

interface PrivacyTabProps {
  notifications: boolean;
  setNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PrivacyTab: React.FC<PrivacyTabProps> = ({
  notifications,
  setNotifications
}) => {
  const { toast } = useToast();
  const [clearingHistory, setClearingHistory] = useState(false);
  const [exportingData, setExportingData] = useState(false);

  const handleNotificationsChange = (enabled: boolean) => {
    setNotifications(enabled);
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, enabled);
    toast({
      title: enabled ? "Notifications enabled" : "Notifications disabled",
      description: enabled ? "You will now receive notifications" : "You will no longer receive notifications",
    });
  };

  const handleClearHistory = async () => {
    setClearingHistory(true);
    await clearUserData();
    setClearingHistory(false);
    toast({
      title: "History cleared",
      description: "Your chat and search history has been cleared",
    });
  };

  const handleExportData = () => {
    setExportingData(true);
    exportUserData();
    setTimeout(() => {
      setExportingData(false);
      toast({
        title: "Data exported",
        description: "Your data has been exported successfully",
      });
    }, 1000);
  };

  return (
    <div className="space-y-4">
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
              onClick={handleExportData}
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
              onClick={handleClearHistory}
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
    </div>
  );
};
