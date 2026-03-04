import React from "react";
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart, ExternalLink } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Browse",
      links: [
        { name: "Popular Anime", href: "/search?sort=popular" },
        { name: "Trending Now", href: "/search?sort=trending" },
        { name: "Latest Episodes", href: "/" },
        { name: "Upcoming", href: "/" },
      ]
    },
    {
      title: "Community",
      links: [
        { name: "Discord", href: "https://discord.gg/6yAJ3XDHTt", external: true },
        { name: "GitHub", href: "https://github.com/Dovakiin0/Kitsune", external: true },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "DMCA", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
      ]
    }
  ];

  return (
    <footer className="w-full bg-gradient-to-t from-anime-dark to-anime-dark-light border-t border-white/5">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
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
              <div>
                <h3 className="text-xl font-bold gradient-text-primary">VinAnime</h3>
                <span className="text-xs text-muted-foreground">Watch Anime Free HD</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
              Your ultimate destination for streaming anime in HD quality. 
              Watch thousands of anime series and movies for free, anytime, anywhere.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com/Dovakiin0/Kitsune" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <GitHubLogoIcon className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
              </a>
              <a 
                href="https://discord.gg/6yAJ3XDHTt" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <DiscordLogoIcon className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                {section.title}
                <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent max-w-[30px]" />
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted-foreground hover:text-white transition-colors duration-300 flex items-center gap-1 group"
                    >
                      {link.name}
                      {link.external && (
                        <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>&copy; {currentYear} VinAnime.</span>
              <span className="hidden sm:inline">Made with</span>
              <Heart className="w-3 h-3 text-pink-500 fill-pink-500 hidden sm:inline" />
              <span className="hidden sm:inline">for anime lovers</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-purple-400" />
                HD Quality Streaming
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>No Ads</span>
            </div>
          </div>
          
          {/* Disclaimer */}
          <p className="text-[10px] text-muted-foreground/60 text-center mt-4 max-w-3xl mx-auto">
            VinAnime does not store any files on our server. All content is hosted on third-party services. 
            We only provide links to media that is already available on the internet.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
