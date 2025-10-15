import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PluginStatusBadge } from './PluginStatusBadge';
import type { Plugin } from '@/types/plugin.types';
import { Power, PowerOff, Trash2, RefreshCw, ExternalLink, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface PluginCardProps {
  plugin: Plugin;
  onActivate?: (id: string) => void;
  onDeactivate?: (id: string) => void;
  onUninstall?: (id: string) => void;
  onUpdate?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  isLoading?: boolean;
}

export function PluginCard({
  plugin,
  onActivate,
  onDeactivate,
  onUninstall,
  onUpdate,
  onViewDetails,
  isLoading = false,
}: PluginCardProps) {
  const isActive = plugin.status === 'ACTIVE';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {plugin.displayName}
              {plugin.isSystem && (
                <Badge variant="outline" className="text-xs">
                  System
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1.5">
              <span className="text-xs text-muted-foreground">v{plugin.version}</span>
              {' • '}
              <span className="text-xs">{plugin.author}</span>
            </CardDescription>
          </div>
          <PluginStatusBadge status={plugin.status} />
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{plugin.description}</p>

        <div className="mt-4 space-y-2">
          {plugin.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{plugin.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">• {plugin.downloads.toLocaleString()} downloads</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {plugin.permissions.slice(0, 3).map((perm) => (
              <Badge key={perm} variant="secondary" className="text-xs">
                {perm}
              </Badge>
            ))}
            {plugin.permissions.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{plugin.permissions.length - 3} more
              </Badge>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Installed {formatDistanceToNow(new Date(plugin.installedAt), { addSuffix: true, locale: vi })}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        {isActive ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeactivate?.(plugin.id)}
            disabled={isLoading || plugin.isSystem}
          >
            <PowerOff className="h-4 w-4 mr-1" />
            Deactivate
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={() => onActivate?.(plugin.id)}
            disabled={isLoading}
          >
            <Power className="h-4 w-4 mr-1" />
            Activate
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails?.(plugin.id)}
          disabled={isLoading}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Details
        </Button>

        {!plugin.isSystem && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUpdate?.(plugin.id)}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Update
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUninstall?.(plugin.id)}
              disabled={isLoading || isActive}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Uninstall
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
