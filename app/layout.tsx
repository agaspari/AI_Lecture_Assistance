import './globals.css'
import { Header } from '../components/Header'
import { Providers } from '../components/Providers'

export const metadata = { title: 'Understandly' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}