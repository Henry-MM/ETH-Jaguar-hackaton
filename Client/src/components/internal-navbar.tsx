import { ThemeSwitch } from "@/components/theme-switch";
import type { TabKey } from "@/types";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Navbar as HUINavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from "@heroui/navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";
import { FaHandPaper, FaHistory, FaMoneyBillWave, FaUserCog } from "react-icons/fa";
import logo from "../../public/logo.png";

type Props = {
  active: TabKey;
  onChange: (key: TabKey) => void;
};

export const InternalNavbar = ({ active, onChange }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const items: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "request", label: "Solicitar", icon: <FaHandPaper size={18} /> },
    { key: "payment", label: "Pagar", icon: <FaMoneyBillWave size={18} /> },
    { key: "history", label: "Historial", icon: <FaHistory size={18} /> },
    { key: "account", label: "Mi cuenta", icon: <FaUserCog size={18} /> },
  ];

  return (
    <HUINavbar
      isBordered
      maxWidth="full"
      onMenuOpenChange={setIsMenuOpen}
      className="backdrop-blur bg-background/70 supports-[backdrop-filter]:bg-background/60"
    >
      {/* Brand */}
      <NavbarContent>
        <img src={logo} alt="Prestamigo" className="w-10 h-10" />
        <Link
          href="/"
          onClick={() => onChange("request")}
          className="cursor-pointer select-none"
          aria-label="Prestamigo inicio"
        >
          <span className="text-xl font-extrabold tracking-tight from-neutral-950 to-neutral-500 bg-clip-text text-transparent bg-gradient-to-r">
            Prest<span className="text-[#22c2ab]">amigo</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="ml-4 hidden md:flex items-center gap-1">
          {items.map((it) => (
            <NavbarItem key={it.key} isActive={active === it.key}>
              <button
                onClick={() => onChange(it.key)}
                aria-current={active === it.key ? "page" : undefined}
                className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition
                  ${active === it.key
                    ? "text-[#22c2ab] bg-[#22c2ab]/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"}`}
              >
                {it.icon}
                <span>{it.label}</span>
              </button>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>


      {/* Right actions (desktop) */}
      <NavbarContent className="hidden sm:flex">
        <ConnectButton />
      </NavbarContent>

      {/* Mobile toggle */}
      <NavbarContent className="md:hidden">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        />
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu>
        {items.map((it) => (
          <NavbarMenuItem key={it.key}>
            <button
              onClick={() => {
                onChange(it.key);
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2 rounded-xl px-3 py-3 text-base
                ${active === it.key
                  ? "text-[#22c2ab] bg-[#22c2ab]/10"
                  : "text-foreground/80 hover:bg-foreground/5"}`}
              aria-current={active === it.key ? "page" : undefined}
            >
              {it.icon}
              <span>{it.label}</span>
            </button>
          </NavbarMenuItem>
        ))}

        <NavbarMenuItem className="mt-2 flex items-center justify-between">
          <ThemeSwitch />
          <Button as={Link} color="danger" href="#" variant="flat">
            Cerrar sesión
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </HUINavbar>
  );
};
