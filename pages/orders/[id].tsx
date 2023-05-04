import { CartList, OrderSummary } from "@/components/cart"
import { ShopLayout } from "@/components/layouts"
import { CreditCardOutlined, CreditScoreOutlined } from "@mui/icons-material"
import { Box, Button, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from "@mui/material"
import NextLink from "next/link"
import { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]"
import { dbOrders } from "@/database"
import { IOrder } from "@/interfaces"
import { PayPalButtons } from "@paypal/react-paypal-js"
import { tesloApi } from "@/api"
import { useRouter } from "next/router"
import { useState } from "react"

interface Props {
  order: IOrder
}

// export type OrderResponseBody = {
//   id: string;
//   status:
//       | "COMPLETED"
//       | "SAVED"
//       | "APPROVED"
//       | "VOIDED"
//       | "PAYER_ACTION_REQUIRED";
// };
export type OrderResponseBody = {
  id: string;
  status: "COMPLETED" | "SAVED" | "APPROVED" | "VOIDED" | "PAYER_ACTION_REQUIRED" | "CREATED"
};
// "COMPLETED" | "SAVED" | "APPROVED" | "VOIDED" | "PAYER_ACTION_REQUIRED"


const OrderPage: NextPage<Props> = ({ order }) => {

  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false)

  const onOrderCompleted = async (details: OrderResponseBody) => {

    if (details.status !== 'COMPLETED') {
      return alert('No hay pago en Paypal')
    }

    setIsPaying(true)

    try {
      const { data } = await tesloApi.post('/orders/pay', {
        transactionId: details.id,
        orderId: order._id
      })

      router.reload()
    } catch (error) {
      setIsPaying(false)
      console.log(error)
      alert('Error')
    }

  }

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
                  <Box
                    display='flex'
                    justifyContent='center'
                    className='fadeIn'
                    sx={{ display: isPaying ? 'flex' : 'none' }}
                  >
                    <CircularProgress />
                  </Box>
                  <Box flexDirection='column' sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} >
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
                          <PayPalButtons
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [
                                  {
                                    amount: {
                                      value: `${order.total}`,
                                    },
                                  },
                                ],
                              });
                            }}
                            onApprove={(data, actions) => {
                              return actions.order!.capture().then((details) => {
                                onOrderCompleted(details);
                                //console.log({details})
                                //const name = details.payer.name!.given_name;
                                //alert(`Transaction completed by ${name}`);
                              });
                            }}
                          />
                        )
                    }
                  </Box>

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
  const userId = session.user.user.id ? session.user.user.id : session.user.user._id;
  if (order.user !== userId) {
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