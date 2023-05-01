import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
import { Typography } from "@mui/material";

export default function WomenPage() {

  const {products, isLoading} = useProducts('/products?gender=women');
  
  return (
    <ShopLayout title={'Teslo-Shop - Women'} pageDescription={'Encuentra los mejores productos de Tesla para mujeres aqui'}>
      <>
        <Typography variant='h1' component='h1'>Mujeres</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos para mujeres</Typography>

        {
          isLoading
            ? <FullScreenLoading />
            : <ProductList products={products} />
        }
 
      </>
    </ShopLayout>
  )
}