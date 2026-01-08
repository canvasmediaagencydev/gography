"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { IconType } from "react-icons";
import { FiGlobe, FiImage, FiLayout, FiLogOut, FiMap } from "react-icons/fi";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems: Array<{
    href: string;
    label: string;
    Icon: IconType;
  }> = [
    {
      href: "/admin/dashboard",
      label: "Home",
      Icon: FiLayout,
    },
    {
      href: "/admin/trips",
      label: "Trips",
      Icon: FiMap,
    },
    {
      href: "/admin/gallery",
      label: "Gallery",
      Icon: FiImage,
    },
    {
      href: "/admin/countries",
      label: "Countries",
      Icon: FiGlobe,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      alert("ออกจากระบบไม่สำเร็จ");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      {menuItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              active
                ? "text-orange-600 dark:text-orange-500"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <item.Icon className={`text-xl ${active ? "scale-110" : ""}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}

      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50"
      >
        <FiLogOut className="text-xl" />
        <span className="text-[10px] font-medium">Logout</span>
      </button>
    </div>
  );
}
