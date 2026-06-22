"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Menu,
  MessageSquareMore,
  Search,
  Settings,
  UserCircle2,
} from "lucide-react";
import { getPageByPath } from "@/lib/navigation";

export default function Navbar({ onMenuClick }) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  const page = useMemo(() => getPageByPath(pathname), [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="flex min-h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-2xl border border-slate-200 p-3 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Dispatch Center</p>
          <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900">
            {page?.label ?? "Dispatch Manager"}
          </h1>
        </div>

        <div className="hidden flex-1 md:block">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search container, dispatch, customer..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="rounded-2xl border border-slate-200 p-3 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="rounded-2xl border border-slate-200 p-3 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            aria-label="Messages"
          >
            <MessageSquareMore className="h-5 w-5" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:border-slate-300 hover:bg-slate-50"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">Admin User</p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Dispatcher</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
            </button>

            {profileOpen ? (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] w-60 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">Admin User</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Dispatcher</p>
                </div>
                <button
                  type="button"
                  className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <UserCircle2 className="h-4 w-4" />
                  My Profile
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <Settings className="h-4 w-4" />
                  Account Settings
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
