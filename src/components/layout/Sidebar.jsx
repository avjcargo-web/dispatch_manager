"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, PanelLeftClose, X } from "lucide-react";
import { navigation } from "@/lib/navigation";

function buildExpandedState(pathname, currentState = {}) {
  return navigation.reduce((accumulator, entry) => {
    if (!entry.items) {
      return accumulator;
    }

    const containsActiveRoute = entry.items.some((item) => item.href === pathname);

    accumulator[entry.label] = containsActiveRoute ? true : currentState[entry.label] ?? false;
    return accumulator;
  }, {});
}

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState(() => buildExpandedState(pathname));

  const toggleSection = (label) => {
    setExpandedSections((currentState) => ({
      ...currentState,
      [label]: !currentState[label],
    }));
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-[#0f172a] text-slate-100 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-900/40">
              DM
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">Dispatch Manager</p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Operations Suite</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <nav className="space-y-2">
            {navigation.map((entry) => {
              const Icon = entry.icon;
              const hasChildren = Boolean(entry.items);
              const isChildActive = hasChildren
                ? entry.items.some((item) => item.href === pathname)
                : false;
              const isExpanded = expandedSections[entry.label] || isChildActive;

              if (!hasChildren) {
                const isActive = pathname === entry.href;

                return (
                  <Link
                    key={entry.label}
                    href={entry.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                        : "text-slate-300 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{entry.label}</span>
                  </Link>
                );
              }

              return (
                <div key={entry.label} className="rounded-2xl">
                  <button
                    type="button"
                    onClick={() => toggleSection(entry.label)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                      isChildActive
                        ? "bg-white/10 text-white"
                        : "text-slate-300 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{entry.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isExpanded ? (
                    <div className="mt-2 space-y-1 border-l border-white/10 py-1 pl-5">
                      {entry.items.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : "text-slate-400 hover:bg-white/8 hover:text-white"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                isActive ? "bg-white" : "bg-slate-500"
                              }`}
                            />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 px-4 py-4">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-2xl bg-white/6 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            <span className="flex items-center gap-3">
              <LogOut className="h-5 w-5" />
              Logout
            </span>
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
