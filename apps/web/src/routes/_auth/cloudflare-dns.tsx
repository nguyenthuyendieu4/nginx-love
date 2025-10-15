import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/cloudflare-dns')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/cloudflare-dns"!</div>
}
