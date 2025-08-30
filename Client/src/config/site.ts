export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vite + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Documentos",
      href: "/docs",
    },
    {
      label: "Sobre nosotros",
      href: "/about",
    },
    {
      label: "Contacto",
      href: "/contact",
    },
  ],
  navMenuItems: [
    {
      label: "Perfil",
      href: "/profile",
    },
    {
      label: "Dashboard", // TODO: Cambiar a "Historial"
      href: "/dashboard",
    },
    {
      label: "Calendario",
      href: "/calendar",
    },
    {
      label: "Configuraciones",
      href: "/settings",
    },
    {
      label: "Ayuda y feedback",
      href: "/help-feedback",
    },
    {
      label: "Cerrar sesión",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/frontio-ai/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
  },
};
