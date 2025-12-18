'use client';
import { useState, useEffect } from 'react';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '@/components/ui/resizable-navbar';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MainNavbar() {
  const navItems = [
    {
      name: 'Özellikler',
      link: '#features',
    },
    {
      name: 'Fiyatlandırma',
      link: '#pricing',
    },
    {
      name: 'SSS',
      link: '#faq',
    },
    {
      name: 'İletişim',
      link: '#contact',
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    console.log('Current theme:', theme);
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('Switching to:', newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full relative z-50 cursor-pointer hover:bg-accent transition-colors pointer-events-auto"
                aria-label="Tema Değiştir"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 transition-transform hover:rotate-12" />
                ) : (
                  <Moon className="h-5 w-5 transition-transform hover:rotate-12" />
                )}
              </Button>
            )}
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
              onClick={() => (window.location.href = '/login')}
            >
              <span>Giriş Yap</span>
            </HoverBorderGradient>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-2">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full relative z-50 cursor-pointer hover:bg-accent transition-colors pointer-events-auto"
                  aria-label="Tema Değiştir"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 transition-transform hover:rotate-12" />
                  ) : (
                    <Moon className="h-5 w-5 transition-transform hover:rotate-12" />
                  )}
                </Button>
              )}
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.href = '/login';
                }}
                variant="dark"
                className="w-full"
              >
                Giriş Yap
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
