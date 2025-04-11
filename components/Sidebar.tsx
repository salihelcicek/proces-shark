"use client";

import { useUserSession as useAuth } from "@/lib/auth";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SunIcon, MoonIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import Image from "next/image";
const Sidebar = () => {
  const { user } = useAuth();
  const supabase = createClient();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 ">
        <Image src="/favicon.png" alt="ProcesShark Logo" width={40} height={40} className="dark:drop-shadow-xl dark:invert"></Image>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-4 flex flex-col h-full">
        <SheetTitle></SheetTitle>
        {/* Kullanıcı Bilgisi */}
        <div className="flex items-center gap-3 mb-6">
          <Avatar>
            <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt="Profil Resmi" />
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{user?.email || "Misafir Kullanıcı"}</p>
            <Button variant="link" className="text-red-500 p-0" onClick={handleLogout}>
              Çıkış Yap
            </Button>
          </div>
        </div>

        {/* Navigasyon */}
        <nav className="flex flex-col gap-4">
          <Link href="/" className="text-lg font-small hover:text-blue-600">Ana Sayfa</Link>
          <Link href="/profile" className="text-lg font-small hover:text-blue-600">Profil</Link>
          <Link href="/dashboard" className="text-lg font-small hover:text-blue-600">Missions Dashboard</Link>
          
          <Link href="/guideline" className="text-lg font-small hover:text-blue-600">Kılavuz</Link>
          <Link href="/about-blog" className="text-lg font-small hover:text-blue-600">Blog</Link>
        </nav>


        {/* Dark Mode Toggle */}
        <Button
          variant="outline"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center gap-2"
        >
          {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          {theme === "dark" ? "Açık Mod" : "Koyu Mod"}
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
