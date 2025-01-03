import { ThemeToggle } from "./ThemeToggle";
import { NavLogo } from "./navigation/NavLogo";
import { NavLinks } from "./navigation/NavLinks";
import { MobileNav } from "./navigation/MobileNav";

export function NavigationMenu() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <NavLogo />
          <NavLinks />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </nav>
  );
}