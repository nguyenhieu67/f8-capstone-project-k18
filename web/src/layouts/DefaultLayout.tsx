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
        {children}
      </div>
      {/* Footer */}
    </div>
  );
}
