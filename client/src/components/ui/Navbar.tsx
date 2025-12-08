interface NavbarProps {
  navStart?: React.ReactNode[];
  navCenter?: React.ReactNode[];
  navEnd?: React.ReactNode[];
}
export function Navbar({ navStart, navCenter, navEnd }: NavbarProps) {
  return (
    <nav className="navbar bg-base-100 shadow-lg w-full px-4 sm:px-6 lg:px-24 flex items-center justify-center h-16 mx-auto">
      <div className="navbar-start flex gap-2">
        {navStart?.map((item) => (
          <>{item}</>
        ))}
      </div>
      <div className="navbar-center flex gap-3">
        {navCenter?.map((item) => (
          <>{item}</>
        ))}
      </div>
      <div className="navbar-end flex gap-3">
        {navEnd?.map((item) => (
          <>{item}</>
        ))}
      </div>
    </nav>
  );
}
