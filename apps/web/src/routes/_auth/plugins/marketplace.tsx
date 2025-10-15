import PluginMarketplace from '@/components/pages/PluginMarketplace';
import { createFileRoute } from '@tanstack/react-router';
import { marketplaceQueryOptions, pluginQueryOptions } from '@/queries/plugin.query-options';

export const Route = createFileRoute('/_auth/plugins/marketplace')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context;
    
    // Prefetch marketplace data
    queryClient.prefetchQuery(marketplaceQueryOptions.all());
    queryClient.prefetchQuery(marketplaceQueryOptions.featured);
    queryClient.prefetchQuery(marketplaceQueryOptions.categories);
    queryClient.prefetchQuery(pluginQueryOptions.all());
    
    return {};
  },
});

function RouteComponent() {
  return <PluginMarketplace />;
}
