import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

interface IProduct {
  id: string;
  title: string;
}

interface CategoryProps {
  products: IProduct[]
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
export default function Product({ products }: CategoryProps) {
  const route = useRouter();

  // Quando o fallback estiver true precisamos disso aqui: 
  // indica se a página está sendo gerada ou não.
  if (route.isFallback) {
    return <h1>Carregando...</h1>
  }

  return (
    <>
      <h1>{route.query.slug}</h1>
      <ul>
        {products.map(product => {
          return (
            <li key={product.id}>
              {product.title}
            </li>
          )
        })}
      </ul>
    </>
  )
}


// Quando a página é dinâmica e também estática, precisamos passar mais um método:
export const getStaticPaths: GetStaticPaths = async () => {

  const response = await fetch(`http://localhost:3333/categories`);
  const categories = await response.json();

  const paths = categories.map(category => {
    return {
      params: { slug: category.id }
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

  const response = await fetch(`http://localhost:3333/products?category_id=${slug}`);
  const products = await response.json();

  return {
    props: {
      products,
    },
    /**
     * Se tiver 5000 requisições no intervalo de antes de 5 segundos, ele irá mostrar
     * de forma static, após o 5 segundos, ele irá mostrar uma nova versão caso tenha mudado
     * o conteúdo
     */
    revalidate: 60,
  }
}