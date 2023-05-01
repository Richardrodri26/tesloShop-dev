import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
import { Typography } from "@mui/material";

export default function MEnPage() {

  const {products, isLoading} = useProducts('/products?gender=men');
  
  return (
    <ShopLayout title={'Teslo-Shop - Men'} pageDescription={'Encuentra los mejores productos de Tesla para hombres aqui'}>
      <>
        <Typography variant='h1' component='h1'>Hombres</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos para hombres</Typography>

        {
          isLoading
            ? <FullScreenLoading />
            : <ProductList products={products} />
        }
 
      </>
    </ShopLayout>
  )
}