import React, { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, setOpen, children, className }) => {
  return (
    <div
      className={cn(
        "relative h-full bg-neutral-900 dark:bg-neutral-950 transition-all duration-300 z-40 flex flex-col shrink-0",
        open ? "w-64" : "w-20",
        className
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="absolute -right-4 top-10 z-50 bg-neutral-800 p-1.5 rounded-full"
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

export const SidebarBody: React.FC<SidebarBodyProps> = ({ className, children }) => {
  return (
    <div className={cn("flex flex-col h-full p-4", className)}>
      {children}
    </div>
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

export const SidebarLink: React.FC<SidebarLinkProps> = ({ link, className }) => {
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-300 hover:text-white",
        className
      )}
    >
      <div className="flex-shrink-0">{link.icon}</div>
      <span className="truncate">{link.label}</span>
    </Link>
  );
};
