import { client } from '@/lib/prismic';
import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Prismic from 'prismic-javascript';
import PrismicDom from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';


interface CategoryProps {
  category: Document;
  products: Document[]
}

/**
 * Uma página estática com conteúdo dinâmico
 * Adicionamos um produto depois! Por isso em getStaticPaths() o fallback = true,
 * ou seja, ele pode estár esperando um novo produto ser adicionado a página, e não precisarmos
 * fazer build novamente.
 * 
 * Quando adicionamos mais um dado vindo da nossa API, o nextJs vai ver que o fallback está sendo processado,
 * e então teremos que verificar if (route.fallback) {} para gerar um loading enquanto o nextjs
 * gera uma nova build para essa página, depois de gerada pela primeira vez, essa página será estática
 * e seu acesso será instantâneo.
 */
export default function Product({ products, category }: CategoryProps) {
  const route = useRouter();

  // Quando o fallback estiver true precisamos disso aqui: 
  // indica se a página está sendo gerada ou não.
  if (route.isFallback) {
    return <h1>Carregando...</h1>
  }

  return (
    <>
      <h1>{PrismicDom.RichText.asText(category.data.title)}</h1>
      <ul>
        {products.map(product => {
          return (
            <li key={product.id}>
              <Link href={`/catalog/products/${product.uid}`}>
                <a>
                  {PrismicDom.RichText.asText(product.data.title)}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}


// Quando a página é dinâmica e também estática, precisamos passar mais um método:
export const getStaticPaths: GetStaticPaths = async () => {

  const categories = await client().query([
    Prismic.Predicates.at('document.type', 'category'),
  ])

  const paths = categories.results.map(category => {
    return {
      params: { slug: category.uid }
    }
  })

  // Sempre que o fallback for true, o usuário que tentar acessar uma rota que não retorna dados,
  // o nextjs irá tentar buildar para gente essa página (rota)
  return {
    // paths: [],
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
  // pegando de forma dinâmica o que é passado na url.
  const { slug } = context.params;

  const category = await client().getByUID('category', String(slug), {});

  const products = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', category.id)
  ])


  return {
    props: {
      category,
      products: products.results,
    },
    /**
     * Se tiver 5000 requisições no intervalo de antes de 5 segundos, ele irá mostrar
     * de forma static, após o 5 segundos, ele irá mostrar uma nova versão caso tenha mudado
     * o conteúdo
     */
    revalidate: 60,
  }
}