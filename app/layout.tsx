import type { Metadata } from 'next'
import { Gluten } from 'next/font/google'
import './globals.css'

const gluten = Gluten({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PicRoast',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
          <title>PicRoast</title>
      </head>
      <body className={gluten.className + " flex flex-col justify-center"}>
        {children}
      </body>
    </html>
  )
}
