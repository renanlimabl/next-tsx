import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// import AddToCartModal from '../../../components/AddToCartModal';

/**
 * Fizemos uma um lazing loading no nextjs, utilizando o dynamic!
 * Só vamos importar o componente qnd precisarmos dele.
 */
const AddToCartModal = dynamic(
  () => import('../../../components/AddToCartModal'),
  {
    loading: () => <p>Loading...</p>,
    // SSR FALSE DIZ QUE O COMPONENTE NUNCA SERÁ RENDERIZADO PELO LADO DO SERVIDOR, E SIM PELO BROWSER,
    // só vamos deixar false, qnd utilizamos algo que só o browser tem acesso (document, window...)
    ssr: false,
  }
)

export default function Product() {
  const route = useRouter();
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false)

  function handleAddToCart() {
    setIsAddToCartModalVisible(true)
  }

  return (
    <>
      <h1>{route.query.slug}</h1>

      <button onClick={handleAddToCart}>Add to cart</button>

      { isAddToCartModalVisible && <AddToCartModal />}
    </>
  )
}