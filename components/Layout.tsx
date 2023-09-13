import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Wallet } from './Wallet'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#333', padding: '1rem' }}>
        <div style={{ fontSize: '1.4rem' }}>
          <Link href="/" style={{ color: '#fff', marginRight: '1rem' }}>Home</Link>
          <Link href="https://sol.goscript.dev" style={{ color: '#fff', textDecoration: 'underline' }}> Golana </Link>
          {/* <Link href="/about" style={{ color: '#fff', marginRight: '1rem' }}>About</Link>
          <Link href="/users" style={{ color: '#fff', marginRight: '1rem' }}>Users List</Link> */}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Wallet />
        </div>
      </nav>
      <hr />
    </header>
    {children}
    <footer>
      <hr />
      <Link href="https://sol.goscript.dev" style={{ color: '#000', textDecoration: 'underline' }}> Golana website </Link>
    </footer>
  </div>
)

export default Layout
