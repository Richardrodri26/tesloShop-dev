import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
import { Typography } from "@mui/material";

export default function KidPage() {

  const {products, isLoading} = useProducts('/products?gender=kid');
  
  return (
    <ShopLayout title={'Teslo-Shop - Kid'} pageDescription={'Encuentra los mejores productos de Tesla para niños aqui'}>
      <>
        <Typography variant='h1' component='h1'>Niños</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos para niños</Typography>

        {
          isLoading
            ? <FullScreenLoading />
            : <ProductList products={products} />
        }
 
      </>
    </ShopLayout>
  )
}