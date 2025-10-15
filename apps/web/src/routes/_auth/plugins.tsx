import Plugins from '@/components/pages/Plugins';
import { createFileRoute } from '@tanstack/react-router';
import { pluginQueryOptions } from '@/queries/plugin.query-options';

export const Route = createFileRoute('/_auth/plugins')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context;
    
    // Prefetch plugins data
    queryClient.prefetchQuery(pluginQueryOptions.all());
    queryClient.prefetchQuery(pluginQueryOptions.updates);
    
    return {};
  },
});

function RouteComponent() {
  return <Plugins />;
}
