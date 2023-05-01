import { CartList, OrderSummary } from "@/components/cart"
import { ShopLayout } from "@/components/layouts"
import { CreditCardOutlined, CreditScoreOutlined } from "@mui/icons-material"
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material"
import NextLink from "next/link"
import { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]"
import { dbOrders } from "@/database"
import { IOrder } from "@/interfaces"

interface Props {
  order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {
  return (
    <ShopLayout title="Resumen de la orden" pageDescription={'Resumen de la orden de compra'}>
      <>
        <Typography variant="h1" component='h1'>
          Orden: {order._id}
        </Typography>

        {
          order.isPaid
            ? (
              <Chip
                sx={{ my: 2 }}
                label='Orden ya fue pagada'
                variant='outlined'
                color='success'
                icon={<CreditScoreOutlined />}
              />
            )
            : (
              <Chip
                sx={{ my: 2 }}
                label='Pendiente de Pago'
                variant='outlined'
                color='error'
                icon={<CreditCardOutlined />}
              />
            )
        }

        <Grid container className="fadeIn">
          <Grid item xs={12} sm={7}>
            <CartList products={order.orderItems} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Card className="summary-card">
              <CardContent>
                <Typography variant="h2">Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
                <Divider sx={{ my: 1 }} />

                <Box display='flex' justifyContent='space-between'>
                  <Typography variant='subtitle1'>Dirección de entrega</Typography>

                </Box>

                <Typography >{order.shippingAddress.firstName} {order.shippingAddress.lastName}</Typography>
                <Typography >{order.shippingAddress.address} {order.shippingAddress.address2 ? `, ${order.shippingAddress.address2}` : ''}</Typography>
                <Typography >{order.shippingAddress.city}, {order.shippingAddress.zip}</Typography>
                <Typography >{order.shippingAddress.country}</Typography>
                <Typography >{order.shippingAddress.phone}</Typography>

                <Divider sx={{ my: 1 }} />

                <OrderSummary
                  orderValues={{
                    numberOfItems: order.numberOfItems,
                    subTotal: order.subTotal,
                    total: order.total,
                    tax: order.tax,
                  }}
                />

                <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                  {
                    order.isPaid
                      ? (
                        <Chip
                          sx={{ my: 2 }}
                          label='Orden ya fue pagada'
                          variant='outlined'
                          color='success'
                          icon={<CreditScoreOutlined />}
                        />
                      )
                      : (
                          <h1>Pagar</h1>
                      )
                  }


                </Box>

              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>

    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query, res }) => {
  const { id = '' } = query
  const session: any = await getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      }
    }
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      }
    }
  }
  if (order.user !== session.user.user.id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      }
    }
  }

  return {
    props: {
      order
    }
  }
}

export default OrderPage