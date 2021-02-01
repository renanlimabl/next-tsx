import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

interface IProduct {
  id: string;
  title: string;
}

interface CategoryProps {
  products: IProduct[]
}

export default function Product({ products }: CategoryProps) {
  const route = useRouter();
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

  return {
    // paths: [],
    paths,
    fallback: false,
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