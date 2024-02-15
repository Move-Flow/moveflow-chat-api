// import type { User } from '../interfaces'
import useSwr from 'swr'
import Link from 'next/link'

// const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Index() {
  // const { data, error, isLoading } = useSwr<any[]>('/api/tokens', fetcher)

  // if (error) return <div>Failed to load data ...</div>
  // if (isLoading) return <div>Loading...</div>
  // if (!data) return null

  return (
    <ul>
      {/* {data.map(({id, name}) => (
        <li key={id}>
          <Link href="/api/token/[id]" as={`/token/${id}`}>
            {name ?? `Token ${id}`}
          </Link>
        </li>
      ))} */}
    </ul>
  )
}
