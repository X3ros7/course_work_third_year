import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SidebarProvider
        style={{
          '--sidebar-width': '10rem',
          '--sidebar-width-mobile': '10rem',
        }}
      >
        <AppSidebar />
        <SidebarInset>
          <SidebarTrigger className="absolute top-0 left-0 text-blue-500" />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
