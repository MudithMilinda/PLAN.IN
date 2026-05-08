import React, { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  open,
  setOpen,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative z-40 flex h-full shrink-0 flex-col bg-neutral-900 transition-all duration-300 dark:bg-neutral-950",
        open ? "w-64" : "w-20",
        className,
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-10 -right-4 z-50 rounded-full bg-neutral-800 p-1.5"
      >
        {open ? "←" : "→"}
      </button>
      {children}
    </div>
  );
};

interface SidebarBodyProps {
  className?: string;
  children: ReactNode;
}

export const SidebarBody: React.FC<SidebarBodyProps> = ({
  className,
  children,
}) => {
  return (
    <div className={cn("flex h-full flex-col p-4", className)}>{children}</div>
  );
};

interface SidebarLinkProps {
  link: {
    label: string;
    href: string;
    icon: ReactNode;
  };
  className?: string;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  link,
  className,
}) => {
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white",
        className,
      )}
    >
      <div className="flex-shrink-0">{link.icon}</div>
      <span className="truncate">{link.label}</span>
    </Link>
  );
};
