"use client";

import { useState } from "react";
import { useUserSession } from "@/lib/auth";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar5 = () => {
  const { user } = useUserSession();
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };



  return (
    <header className="py-4 px-4 border-b bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold text-white justify-items-start">ProcessShark</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/dashboard" className="hover:text-sky-600 font-medium">Dashboard</Link>
          <Link href="/ai-shark" className="hover:text-sky-600 font-medium">AI-Shark</Link>
          <Link href="/about-blog" className="hover:text-sky-600 font-medium">Blog</Link>
          <Link href="/guideline" className="hover:text-sky-600 font-medium">Rehber</Link>
          <Link href="/pricing" className="hover:text-sky-600 font-medium">Fiyatlandırma</Link>
        </nav>

        {/* Auth */}
        <div className="hidden lg:flex gap-4">
          {user ? (
            <Button variant="outline" onClick={handleLogout}>Çıkış Yap</Button>
          ) : (
            <Link href="/login">
              <Button variant="default">Giriş Yap</Button>
            </Link>
          )}
        </div>

        {/* Hamburger Button - Mobile */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 space-y-4 px-4 animate-slide-down">
          <div className="flex flex-col gap-4">
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
          <Link href="/ai-shark" onClick={() => setMobileMenuOpen(false)}>AI-Shark</Link>
          <Link href="/about-blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
          <Link href="/guideline" onClick={() => setMobileMenuOpen(false)}>Rehber</Link>
          <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>Fiyatlandırma</Link>
        </div>

          <div className="border-t pt-4">
            {user ? (
              <Button variant="outline" onClick={handleLogout} className="w-full">Çıkış Yap</Button>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Giriş Yap</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export { Navbar5 };
