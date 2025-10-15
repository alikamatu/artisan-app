import NavbarMenu from "@/_components/dashboard/general/navbar-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <main className="pb-20">
        {children}
      </main>
      
      {/* Floating Navigation Menu */}
      <NavbarMenu />
    </div>
  );
}