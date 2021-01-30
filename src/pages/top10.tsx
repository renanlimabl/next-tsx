import { GetStaticProps } from 'next';

interface IProduct {
  id: string;
  title: string;
}

interface ITop10Props {
  products: IProduct[];
}

export default function Top10({ products }) {
  return (
    <div>
      <h1>Top 10</h1>

      <ul>
        {products.map(product => {
          return (
            <li key={product.id}>
              {product.title}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export const getStaticProps: GetStaticProps<ITop10Props> = async (context) => {
  const response = await fetch('http://localhost:3333/products');
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
    revalidate: 5,
  }
}