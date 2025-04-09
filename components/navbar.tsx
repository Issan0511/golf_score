"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GolfIcon } from "./golf-icon"
import { Menu, X, User, BarChart2, PlusCircle, Home, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { useLoadingNavigation } from "@/hooks/use-loading-navigation"
import { LoadingModal } from "@/components/ui/loading-modal"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isNavigating, navigate, setIsNavigating } = useLoadingNavigation()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // ドロップダウンメニューの項目をクリックしたときの処理
  const handleMenuItemClick = (href: string) => {
    navigate(href);
  };

  return (
    <>
      <LoadingModal isLoading={isNavigating} message="画面を読み込み中..." />
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white"
        } border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-between items-center">
            <Link href="/" className="flex items-center">
              <GolfIcon className="h-6 w-6 mr-2 text-golf-500" />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                ゴルフ部スコア管理
              </span>
            </Link>
            <div className="flex md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-golf-700">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-1">
              <NavLink href="/" icon={<Home className="h-4 w-4 mr-1" />}>
                ホーム
              </NavLink>
              <NavLink href="/players" icon={<User className="h-4 w-4 mr-1" />}>
                プレイヤー
              </NavLink>
              <NavLink href="/playerstats" icon={<BarChart2 className="h-4 w-4 mr-1" />}>
                統計
              </NavLink>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-golf-600 hover:bg-gray-50 rounded-md"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    スコア入力
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <a 
                      href="/submit-score"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMenuItemClick('/submit-score');
                      }}
                      className="w-full cursor-pointer"
                    >
                      通常入力
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <a 
                      href="/submit-score/hole-by-hole"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMenuItemClick('/submit-score/hole-by-hole');
                      }}
                      className="w-full cursor-pointer"
                    >
                      ホール別入力
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden"
              >
                <div className="flex flex-col space-y-2 pt-4 pb-3">
                  <MobileNavLink href="/" icon={<Home className="h-5 w-5 mr-2" />}>
                    ホーム
                  </MobileNavLink>
                  <MobileNavLink href="/players" icon={<User className="h-5 w-5 mr-2" />}>
                    プレイヤー一覧
                  </MobileNavLink>
                  <MobileNavLink href="/playerstats" icon={<BarChart2 className="h-5 w-5 mr-2" />}>
                    統計比較
                  </MobileNavLink>
                  <MobileNavLink href="/submit-score" icon={<PlusCircle className="h-5 w-5 mr-2" />}>
                    スコア入力
                  </MobileNavLink>
                  <MobileNavLink href="/submit-score/hole-by-hole" icon={<PlusCircle className="h-5 w-5 mr-2" />}>
                    ホール別入力
                  </MobileNavLink>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  )
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
  const { navigate } = useLoadingNavigation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(href);
  };
  
  return (
    <a
      href={href}
      onClick={handleClick}
      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-golf-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
    >
      {icon}
      {children}
    </a>
  )
}

function MobileNavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
  const { navigate } = useLoadingNavigation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-golf-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
    >
      {icon}
      {children}
    </a>
  )
}

