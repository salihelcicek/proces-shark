"use client";

import { useUserSession } from "@/lib/auth"; // Kullanıcı bilgisini almak için
import { createClient } from "@/utils/supabase/client"; // Çıkış yapmak için
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; 
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar5 = () => {
  const { user } = useUserSession(); // Kullanıcıyı kontrol et
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Oturumu kapat
    window.location.href = "/"; // Ana sayfaya yönlendir
  };

  const features = [
    {
      title: "Dashboard",
      description: "Missionlarını takip et",
      href: "/dashboard",
    },
    {
      title: "Analitikler",
      description: "Performansını incele",
      href: "#",
    },
    {
      title: "Ayarlar",
      description: "Kendine göre özelleştir",
      href: "#",
    },
    {
      title: "Destek",
      description: "Yardıma ihtiyacın mı var?",
      href: "#",
    },
  ];

  return (
    <section className="py-4 px-4">
      <div className="container border-b-2 border-black mx-auto">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href={"/"} className="cursor-pointer flex items-center gap-2">
              <Image src="/favicon.png" alt="ProcesShark Logo" width={40} height={40}></Image>
              <span className="text-lg font-semibold">ProcesShark</span>
            </Link>
          </div>
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Özellikler</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {features.map((feature, index) => (
                      <NavigationMenuLink
                        href={feature.href}
                        key={index}
                        className="rounded-md p-3 transition-colors hover:bg-muted/70"
                      >
                        <div key={feature.title}>
                          <p className="mb-1 font-semibold">{feature.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/dashboard"
                  className={navigationMenuTriggerStyle()}
                >
                  Hedeflerim
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={navigationMenuTriggerStyle()}
                >
                  İletişim
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="hidden items-center gap-4 lg:flex">
            {user ? (
              <Button onClick={handleLogout} className="cursor-pointer">
                Çıkış Yap
              </Button>
            ) : (
              <Link href="/login">
                <Button className="cursor-pointer">Giriş Yap</Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </section>
  );
};

export { Navbar5 };
