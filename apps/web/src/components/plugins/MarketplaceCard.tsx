import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MarketplacePlugin } from '@/types/plugin.types';
import { Download, Star, ExternalLink, Verified } from 'lucide-react';

interface MarketplaceCardProps {
  plugin: MarketplacePlugin;
  onInstall?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  isInstalled?: boolean;
  isLoading?: boolean;
}

export function MarketplaceCard({
  plugin,
  onInstall,
  onViewDetails,
  isInstalled = false,
  isLoading = false,
}: MarketplaceCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {plugin.displayName}
              {plugin.verified && (
                <Badge variant="default" className="text-xs gap-1">
                  <Verified className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1.5">
              <span className="text-xs text-muted-foreground">v{plugin.version}</span>
              {' • '}
              <span className="text-xs">{plugin.author.name}</span>
            </CardDescription>
          </div>
          {plugin.category && (
            <Badge variant="secondary" className="text-xs">
              {plugin.category}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">{plugin.description}</p>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{plugin.rating?.toFixed(1) || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Download className="h-4 w-4" />
              <span>{plugin.downloads.toLocaleString()}</span>
            </div>
          </div>

          {plugin.tags && plugin.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {plugin.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {plugin.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{plugin.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {plugin.requires && (
            <div className="text-xs text-muted-foreground">
              Requires: v{plugin.requires.minAppVersion}
              {plugin.requires.maxAppVersion && ` - v${plugin.requires.maxAppVersion}`}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        {isInstalled ? (
          <Button variant="secondary" size="sm" disabled className="flex-1">
            Installed
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={() => onInstall?.(plugin.id)}
            disabled={isLoading}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-1" />
            Install
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
      </CardFooter>
    </Card>
  );
}
