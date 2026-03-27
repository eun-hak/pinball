"use client";

import { useState, useEffect } from "react";
import { Dices, Trophy, Skull, Palette, Menu, X } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "@/components/ui/use-mobile";

interface NavigationProps {
  currentGame: "home" | "plinko" | "race" | "survival" | "color";
  onGameChange: (
    game: "home" | "plinko" | "race" | "survival" | "color",
  ) => void;
}

export function Navigation({ currentGame, onGameChange }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const activeGame = currentGame;
  // test
  // ESC 키로 메뉴 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // body 스크롤 방지
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const gameLinks = [
    { href: "/", label: "홈", icon: null, game: "home" as const },
    { href: "/plinko", label: "플링코", icon: Dices, game: "plinko" as const },
    { href: "/race", label: "레이스", icon: Trophy, game: "race" as const },
    {
      href: "/survival",
      label: "서바이벌",
      icon: Skull,
      game: "survival" as const,
    },
    { href: "/color", label: "Color", icon: Palette, game: "color" as const },
  ];

  // 모바일 메뉴용: 홈 제외하고 게임만
  const mobileGameLinks = gameLinks.filter((link) => link.game !== "home");

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 오버레이 클릭 시에만 닫기 (메뉴 내부 클릭은 무시)
    if (e.target === e.currentTarget) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50"
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer flex-shrink-0"
          >
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
              <Dices className="size-6 text-white" />
            </div>
            <h1 className="text-2xl text-white whitespace-nowrap">
              Plenty<span className="text-cyan-400">Arcade</span>
            </h1>
          </Link>

          {/* PC: 원래 디자인 유지 */}
          <div
            className="hidden md:flex gap-2 bg-gray-800/50 p-1 rounded-lg flex-none"
            suppressHydrationWarning
          >
            {gameLinks.map((link, index) => {
              const Icon = link.icon;
              const isActive = activeGame === link.game;
              const isHome = link.game === "home";

              return (
                <div key={link.href} className="flex items-center">
                  {index > 0 && index === 1 && (
                    <div className="w-px bg-gray-700 mx-1 h-6" />
                  )}
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all whitespace-nowrap ${
                      isActive
                        ? isHome
                          ? "bg-gray-700 text-white"
                          : link.game === "plinko" || link.game === "race"
                            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50"
                            : link.game === "survival"
                              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                              : "bg-pink-600 text-white shadow-lg shadow-pink-500/50"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {Icon && <Icon className="size-4" />}
                    {link.label}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* 모바일: 햄버거 메뉴 버튼 - PC에서 완전히 숨김 */}
          {isMobile && (
            <button
              onClick={handleMenuToggle}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="메뉴 열기"
            >
              <Menu className="size-6" />
            </button>
          )}
        </div>
      </div>

      {/* 모바일 메뉴 - nav 위에 fixed로 덮어씌우기 */}
      {isMobile && mobileMenuOpen && (
        <>
          {/* 오버레이 */}
          <div
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />

          {/* 메뉴 리스트 - 오른쪽 상단에 컴팩트하게, 메뉴바 스타일 */}
          <div
            className="fixed top-4 right-4 w-48 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-md shadow-2xl z-[101] overflow-hidden"
            aria-label="게임 메뉴"
          >
            <nav className="py-1">
              {mobileGameLinks.map((link, index) => {
                const Icon = link.icon;
                const isActive = activeGame === link.game;

                return (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-2 px-3 py-2 transition-all ${
                        isActive
                          ? link.game === "plinko" || link.game === "race"
                            ? "bg-cyan-500/90 text-white"
                            : link.game === "survival"
                              ? "bg-purple-600/90 text-white"
                              : "bg-pink-600/90 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/80"
                      }`}
                    >
                      {Icon && <Icon className="size-3.5" />}
                      <span className="text-xs font-medium">{link.label}</span>
                    </Link>
                    {/* 구분선 - 마지막 항목 제외 */}
                    {index < mobileGameLinks.length - 1 && (
                      <div className="h-px bg-gray-700/60 mx-3" />
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </nav>
  );
}
