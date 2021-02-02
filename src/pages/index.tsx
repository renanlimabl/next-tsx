// import { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import { GetServerSideProps } from 'next';
import { Title } from '../styles/pages/Home';

interface IProduct {
  id: string;
  title: string;
}

interface IHomeProps {
  recommendedProducts: IProduct[];
}

export default function Home({ recommendedProducts }: IHomeProps) {

  // const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>([]);
  // useEffect(() => {
  //   fetch('http://localhost:3333/recommended').then(response => {
  //     response.json().then(data => {
  //       setRecommendedProducts(data)
  //     })
  //   })
  // }, [])

  // /**
  //  * fazendo assim, essa lib só será importada de fato quando for necessária!
  //  */
  // async function handleSum() {
  //   const math = (await import('../lib/math')).default

  //   console.log(math.sum(3, 2));
  // }

  return (
    <div>
      <SEO
        title="DevCommerce, your best e-commerce!"
        shouldExcludeTitleSuffix
        image="boost.png"
      />
      <section>
        <Title>Products</Title>
        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                {recommendedProduct.title}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

/**
 * as variáveis de ambiente só ficarão disponíveis nos métodos de 
 * // client, server, static
 * A não ser que você utilize o prefixo NEXT_PUBLIC antes da sua variável de ambiente!
 */
export const getServerSideProps: GetServerSideProps<IHomeProps> = async () => {
  // const response = await fetch(`${process.env.API_URL}/recommended`);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommended`);
  const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts
    }
  }
}