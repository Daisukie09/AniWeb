"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

import Container from "./container";
import { Separator } from "./ui/separator";

import { nightTokyo } from "@/utils/fonts";
import { ROUTES } from "@/constants/routes";
import React, { ReactNode, useEffect, useState } from "react";

import SearchBar from "./search-bar";
import { MenuIcon, X, Sparkles } from "lucide-react";
import useScrollPosition from "@/hooks/use-scroll-position";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";
import LoginPopoverButton from "./login-popover-button";
import { useAuthStore } from "@/store/auth-store";
import { pb } from "@/lib/pocketbase";
import NavbarAvatar from "./navbar-avatar";
import { toast } from "sonner";

const menuItems: Array<{ title: string; href?: string }> = [
  {
    title: "Home",
    href: ROUTES.HOME,
  },
];

const NavBar = () => {
  const auth = useAuthStore();
  const { y } = useScrollPosition();
  const isHeaderFixed = true;
  const isHeaderSticky = y > 0;

  useEffect(() => {
    const refreshAuth = async () => {
      const auth_token = JSON.parse(
        localStorage.getItem("pocketbase_auth") as string,
      );
      if (auth_token) {
        try {
          const user = await pb.collection("users").authRefresh();
          if (user) {
            auth.setAuth({
              id: user.record.id,
              email: user.record.email,
              username: user.record.username,
              avatar: user.record.avatar,
              collectionId: user.record.collectionId,
              collectionName: user.record.collectionName,
              autoSkip: user.record.autoSkip,
            });
          }
        } catch (e) {
          console.error("Auth refresh error:", e);
          localStorage.removeItem("pocketbase_auth");
          auth.clearAuth();
          toast.error("Login session expired.", {
            style: { background: "red" },
          });
        }
      }
    };
    refreshAuth();
  }, []);

  return (
    <div
      className={cn([
        "h-fit w-full",
        "sticky top-0 z-[100] duration-500",
        isHeaderFixed ? "fixed" : "",
        isHeaderSticky
          ? "bg-anime-dark/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-purple-500/5"
          : "bg-gradient-to-b from-anime-dark/90 via-anime-dark/50 to-transparent",
      ])}
    >
      <Container className="flex items-center justify-between py-3 gap-10">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <Image 
              src="/icon.png" 
              alt="VinAnime logo" 
              width={50} 
              height={50} 
              className="rounded-xl transition-transform duration-300 group-hover:scale-110"
              suppressHydrationWarning 
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col">
            <h1
              className={cn([
                nightTokyo.className,
                "text-2xl font-bold gradient-text-primary tracking-wider",
              ])}
            >
              VinAnime
            </h1>
            <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase hidden sm:block">
              Watch Free HD
            </span>
          </div>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          {menuItems.map((menu, idx) => (
            <Link 
              href={menu.href || "#"} 
              key={idx}
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors duration-300 relative group"
            >
              {menu.title}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:block w-72">
            <SearchBar />
          </div>
          <div className="hidden lg:flex items-center">
            {auth.auth ? (
              <NavbarAvatar auth={auth} />
            ) : (
              <LoginPopoverButton />
            )}
          </div>
        </div>
        
        <div className="lg:hidden flex items-center gap-3">
          <MobileMenuSheet trigger={
            <button className="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <MenuIcon className="w-6 h-6" suppressHydrationWarning />
            </button>
          } />
          {auth.auth ? <NavbarAvatar auth={auth} /> : <LoginPopoverButton />}
        </div>
      </Container>
    </div>
  );
};

const MobileMenuSheet = ({ trigger }: { trigger: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        className="flex flex-col w-[85vw] sm:w-[400px] z-[150] bg-anime-dark border-l border-white/10"
        hideCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="w-full h-full relative flex flex-col">
          <div className="flex items-center justify-between py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Image 
                src="/icon.png" 
                alt="VinAnime logo" 
                width={40} 
                height={40} 
                className="rounded-lg"
                suppressHydrationWarning 
              />
              <span className={cn([nightTokyo.className, "text-xl gradient-text-primary"])}>
                VinAnime
              </span>
            </div>
            <SheetClose className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <X className="w-5 h-5" />
            </SheetClose>
          </div>
          
          <div className="flex flex-col gap-2 mt-6">
            {menuItems.map((menu, idx) => (
              <Link
                href={menu.href || "#"}
                key={idx}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                {menu.title}
              </Link>
            ))}
          </div>
          
          <Separator className="my-6 bg-white/10" />
          
          <div className="px-4">
            <SearchBar onAnimeClick={() => setOpen(false)} />
          </div>
          
          <div className="mt-auto p-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Premium Experience</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Watch anime in HD quality with no ads. Completely free!
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavBar;
