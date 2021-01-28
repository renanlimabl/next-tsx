import { useRouter } from 'next/router';

export default function Product() {
  const route = useRouter();
  return <h1>{route.query.slug}</h1>
}