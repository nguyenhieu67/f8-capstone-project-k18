import Sidebar from "@/components/ui/Sidebar";

interface Props {
  children: React.ReactNode;
}

export default function DefaultLayout({ children }: Props) {
  return (
    <div>
      {/* Header */}
      {/* Main */}
      <div>
        {/* SideBar */}
        <Sidebar />
        {children}
      </div>
      {/* Footer */}
    </div>
  );
}
