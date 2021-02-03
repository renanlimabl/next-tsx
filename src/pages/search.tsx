import { useRouter } from "next/router";
import Link from 'next/link';
import { FormEvent, useState } from "react"
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { GetServerSideProps } from "next";
import { client } from "../lib/prismic";
import { Document } from 'prismic-javascript/types/documents';

interface SearchProps {
  searchResults: Document[];
}

export default function Search({ searchResults }: SearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { q } = router.query;

  function handleSearch(e: FormEvent) {
    e.preventDefault();

    router.push(
      `/search?q=${encodeURIComponent(search)}`,
    );

    setSearch('');
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit">Buscar</button>
      </form>

      <section>
        <h1>Results for: {q}</h1>
        <ul>
          {searchResults.map(product => {
            return (
              <li>
                <Link href={`/catalog/products/${product.uid}`}>
                  <a>{PrismicDOM.RichText.asText(product.data.title)}</a>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {
  const { q } = context.query;

  const searchResults = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.fulltext('my.product.title', String(q))
  ])

  return {
    props: {
      searchResults: searchResults.results,
    }
  };
}