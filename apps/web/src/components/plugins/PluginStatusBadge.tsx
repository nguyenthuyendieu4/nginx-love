import { Badge } from '@/components/ui/badge';
import { PluginStatus } from '@/types/plugin.types';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PluginStatusBadgeProps {
  status: PluginStatus;
  className?: string;
}

export function PluginStatusBadge({ status, className }: PluginStatusBadgeProps) {
  const variants = {
    [PluginStatus.ACTIVE]: {
      variant: 'default' as const,
      icon: CheckCircle2,
      label: 'Active',
    },
    [PluginStatus.INACTIVE]: {
      variant: 'secondary' as const,
      icon: XCircle,
      label: 'Inactive',
    },
    [PluginStatus.ERROR]: {
      variant: 'destructive' as const,
      icon: AlertCircle,
      label: 'Error',
    },
    [PluginStatus.UPDATING]: {
      variant: 'outline' as const,
      icon: Loader2,
      label: 'Updating',
    },
  };

  const config = variants[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={className}>
      <Icon className={status === PluginStatus.UPDATING ? 'animate-spin' : ''} />
      {config.label}
    </Badge>
  );
}
