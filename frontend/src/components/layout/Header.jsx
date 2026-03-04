import ProfileDropdown from "./ProfileDropdown";

function Header({ title }) {
  return (
    <header className="h-20 flex items-center justify-between px-12 border-b border-white/10">

      <h1 className="text-2xl font-bold tracking-tight">
        {title}
      </h1>

      <ProfileDropdown />

    </header>
  );
}

export default Header;