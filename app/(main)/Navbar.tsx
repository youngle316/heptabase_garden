"use client";
import Logo from "@/app/logo.png";
import Image from "next/image";

export default function Navbar() {
  const handleLogoClick = () => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("cardId");
    window.history.replaceState({}, "", `?${searchParams.toString()}`);
    window.dispatchEvent(new Event("urlchange"));
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-zinc-300 border-b px-8 py-2">
      <div onClick={handleLogoClick}>
        <Image
          width={24}
          height={24}
          priority
          src={Logo}
          alt="Follow me on Github"
          className="cursor-pointer"
        />
      </div>
      <div>theme</div>
    </nav>
  );
}
