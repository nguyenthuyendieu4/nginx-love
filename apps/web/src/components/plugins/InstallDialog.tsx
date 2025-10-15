import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { MarketplacePlugin } from '@/types/plugin.types';
import { Download, Star, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useInstallPlugin } from '@/queries/plugin.query-options';

interface InstallDialogProps {
  plugin: MarketplacePlugin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InstallDialog({ plugin, open, onOpenChange }: InstallDialogProps) {
  const [agreed, setAgreed] = useState(false);
  const installMutation = useInstallPlugin();

  if (!plugin) return null;

  const handleInstall = async () => {
    try {
      await installMutation.mutateAsync({
        id: plugin.id,
        data: { version: plugin.version },
      });
      onOpenChange(false);
      setAgreed(false);
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Install Plugin
          </DialogTitle>
          <DialogDescription>
            Review plugin information before installing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Plugin Info */}
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {plugin.displayName}
              {plugin.verified && (
                <Badge variant="default" className="text-xs">
                  Verified
                </Badge>
              )}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{plugin.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span>Version: {plugin.version}</span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {plugin.rating?.toFixed(1) || 'N/A'}
              </span>
              <span>{plugin.downloads.toLocaleString()} downloads</span>
            </div>
          </div>

          <Separator />

          {/* Author Info */}
          <div>
            <h4 className="font-medium text-sm mb-2">Author</h4>
            <div className="text-sm">
              <p>{plugin.author.name}</p>
              {plugin.author.email && (
                <p className="text-muted-foreground">{plugin.author.email}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Requirements */}
          <div>
            <h4 className="font-medium text-sm mb-2">Requirements</h4>
            <div className="text-sm space-y-1">
              <p>
                App Version: {plugin.requires.minAppVersion}
                {plugin.requires.maxAppVersion && ` - ${plugin.requires.maxAppVersion}`}
              </p>
              {plugin.requires.dependencies && plugin.requires.dependencies.length > 0 && (
                <div>
                  <p className="font-medium">Dependencies:</p>
                  <ul className="list-disc list-inside pl-4 text-muted-foreground">
                    {plugin.requires.dependencies.map((dep) => (
                      <li key={dep}>{dep}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Security Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                  Security Notice
                </h4>
                <p className="text-yellow-700 dark:text-yellow-300/90">
                  Only install plugins from trusted sources. Plugins have access to your system and
                  data according to their requested permissions.
                </p>
              </div>
            </div>
          </div>

          {/* Permissions */}
          {plugin.requires.dependencies && (
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Permissions Required
              </h4>
              <div className="flex flex-wrap gap-2">
                {['network', 'storage', 'database'].map((perm) => (
                  <Badge key={perm} variant="outline">
                    {perm}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="agree" className="text-sm cursor-pointer">
              I understand the risks and agree to install this plugin. I have reviewed the plugin
              information and permissions.
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleInstall}
            disabled={!agreed || installMutation.isPending}
          >
            {installMutation.isPending ? (
              <>
                <Download className="h-4 w-4 mr-2 animate-pulse" />
                Installing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Install Plugin
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
