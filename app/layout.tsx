import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
// 誤ったインポート
// import { GolfIcon } from "@/components/icons"

// 正しいインポートに修正
import { GolfIcon } from "@/components/golf-icon"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ゴルフ部スコア管理アプリ",
  description: "ゴルフ部内のプレイヤーごとのラウンドスコア・パフォーマンスを記録・可視化するアプリ。made by Issa",

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="pt-16">{children}</main>
          <footer className="bg-white border-t border-gray-200 py-8 mt-20">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                  <GolfIcon className="h-5 w-5 mr-2 text-golf-500" />
                  <span className="text-sm text-gray-600">ゴルフ部スコア管理アプリ © {new Date().getFullYear()}</span>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-sm text-gray-600 hover:text-golf-600 transition-colors duration-200">
                    プライバシーポリシー
                  </a>
                  <a href="#" className="text-sm text-gray-600 hover:text-golf-600 transition-colors duration-200">
                    利用規約
                  </a>
                  <a href="#" className="text-sm text-gray-600 hover:text-golf-600 transition-colors duration-200">
                    お問い合わせ
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'