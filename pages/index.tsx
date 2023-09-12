import Link from 'next/link'
import Layout from '../components/Layout'
import { SwapComp } from '../components/Swap'

const IndexPage = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <SwapComp />
    </Layout>
  )
}

export default IndexPage
