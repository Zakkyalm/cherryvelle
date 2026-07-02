import { ClientLayout } from '@/components/ClientLayout';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
