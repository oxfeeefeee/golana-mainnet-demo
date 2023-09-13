import Link from 'next/link'
import Layout from '../components/Layout'
import { SwapComp } from '../components/Swap'

const IndexPage = () => {
  return (
    <Layout title="Dogswap | Golana -- Golang for Solana">
      <SwapComp />
    </Layout>
  )
}

export default IndexPage
