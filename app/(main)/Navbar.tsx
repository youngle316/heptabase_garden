"use client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Nav } from "@/site.config";
import { Leaf, Menu } from "lucide-react";

function NavContent() {
  const handleNavClick = (pageId: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("cardId", pageId);
    window.history.replaceState({}, "", `?${searchParams.toString()}`);
    window.dispatchEvent(new Event("urlchange"));
  };

  return (
    <div>
      <div className="hidden items-center gap-4 md:flex">
        {Nav.map((nav) => (
          <Button
            key={nav.pageId}
            onClick={() => handleNavClick(nav.pageId)}
            variant="link"
            className="h-6 px-0 py-0"
          >
            {nav.label}
          </Button>
        ))}
      </div>
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="dark:invert" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Nav.map((nav) => (
              <DropdownMenuItem
                key={nav.pageId}
                onClick={() => handleNavClick(nav.pageId)}
              >
                {nav.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function Navbar() {
  const handleLogoClick = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("cardId");
    searchParams.delete("firstVisibleCardId");
    window.history.replaceState({}, "", `?${searchParams.toString()}`);
    window.dispatchEvent(new Event("urlchange"));
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-foreground/10 border-b px-4 py-2">
      <div onClick={handleLogoClick}>
        <Leaf className="cursor-pointer transition-all duration-500 hover:text-green-500 dark:invert" />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {Nav && Nav.length > 0 && <NavContent />}
      </div>
    </nav>
  );
}
