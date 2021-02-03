import { client } from '@/lib/prismic';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';


// import AddToCartModal from '../../../components/AddToCartModal';

/**
 * Fizemos uma um lazing loading no nextjs, utilizando o dynamic!
 * Só vamos importar o componente qnd precisarmos dele.
 */
// const AddToCartModal = dynamic(
//   () => import('@/components/AddToCartModal'),
//   {
//     loading: () => <p>Loading...</p>,
//     // SSR FALSE DIZ QUE O COMPONENTE NUNCA SERÁ RENDERIZADO PELO LADO DO SERVIDOR, E SIM PELO BROWSER,
//     // só vamos deixar false, qnd utilizamos algo que só o browser tem acesso (document, window...)
//     ssr: false,
//   }
// )

interface ProductProps {
  product: Document;
}

export default function Product({ product }: ProductProps) {
  const route = useRouter();

  if (route.isFallback) {
    return <h1>Carregando...</h1>
  }

  return (
    <div>
      <h1>{PrismicDOM.RichText.asText(product.data.title)}</h1>

      <div dangerouslySetInnerHTML={{ __html: PrismicDOM.RichText.asHtml(product.data.description) }}>

      </div>

      <img src={product.data.thumbnail.url} width="300" alt="" />

      <p>Price: ${product.data.price}</p>
    </div>
  )
}

// Quando a página é dinâmica e também estática, precisamos passar mais um método:
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  // pegando de forma dinâmica o que é passado na url.
  const { slug } = context.params;

  const product = await client().getByUID('product', String(slug), {});

  return {
    props: {
      product,
    },
    /**
     * Se tiver 5000 requisições no intervalo de antes de 5 segundos, ele irá mostrar
     * de forma static, após o 5 segundos, ele irá mostrar uma nova versão caso tenha mudado
     * o conteúdo
     */
    revalidate: 5,
  }
}