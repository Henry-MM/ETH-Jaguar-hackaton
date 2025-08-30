import React, { useState } from "react";
import { Link } from "@heroui/link";
import {
  Navbar as HUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { ThemeSwitch } from "@/components/theme-switch";
import { FaHandPaper, FaHistory, FaUserCog } from "react-icons/fa";
import type { TabKey } from "@/types";

type Props = {
  active: TabKey;
  onChange: (key: TabKey) => void;
};

export const InternalNavbar = ({ active, onChange }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const items: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "request", label: "Solicitar", icon: <FaHandPaper size={18} /> },
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
      <NavbarContent justify="start">
        <NavbarBrand
          onClick={() => onChange("request")}
          className="cursor-pointer select-none"
          aria-label="Prestamigo inicio"
        >
          <span className="text-xl font-extrabold tracking-tight">
            Prest<span className="text-success">amigo</span>
          </span>
        </NavbarBrand>

        {/* Desktop nav */}
        <div className="ml-4 hidden md:flex items-center gap-1">
          {items.map((it) => (
            <NavbarItem key={it.key} isActive={active === it.key}>
              <button
                onClick={() => onChange(it.key)}
                aria-current={active === it.key ? "page" : undefined}
                className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition
                  ${active === it.key
                    ? "text-success bg-success/10"
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
      <NavbarContent justify="end" className="hidden sm:flex">
        <NavbarItem>
          <Link color="foreground" href="#">Francisco Madrid</Link>
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="danger" href="#" variant="flat">
            Cerrar sesión
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile toggle */}
      <NavbarContent justify="end" className="md:hidden">
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
                  ? "text-success bg-success/10"
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
