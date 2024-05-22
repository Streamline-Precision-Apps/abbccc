import Link from 'next/link'

interface PageProps {
  params: {
    lng: string
  }
}

export default function Page({ params: { lng } } : PageProps) {
  return (
    <>
      <h1> Hi welcome to my Page</h1>
      <Link href={`/${lng}/second-page`}>
        To the other Page
      </Link>
    </>
  )
}