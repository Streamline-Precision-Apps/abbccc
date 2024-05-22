import { dir } from 'i18next'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({
  children,
  
}: RootLayoutProps): JSX.Element {
  return (
    <html>
      <head />
      <body>
        {children}
      </body>
    </html>
  )
}