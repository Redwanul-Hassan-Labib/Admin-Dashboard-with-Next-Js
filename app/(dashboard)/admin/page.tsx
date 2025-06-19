export const dynamic = 'force-dynamic';

import { AdminStats } from '@/components/dashboard/admin/admin-stats';
import { SidebarInset } from '@/components/ui/sidebar';

export default async function Dashboard() {
  return (
    <SidebarInset>
      {/* <SiteHeader /> */}
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AdminStats />
        </div>
      </div>
    </SidebarInset>
  );
}
