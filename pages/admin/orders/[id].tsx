import { CartList, OrderSummary } from "@/components/cart"
import { AdminLayout } from "@/components/layouts"
import { AirplaneTicketOutlined, CreditCardOutlined, CreditScoreOutlined } from "@mui/icons-material"
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from "@mui/material"
import { GetServerSideProps, NextPage } from 'next'
import { dbOrders } from "@/database"
import { IOrder } from "@/interfaces"

interface Props {
  order: IOrder
}
const OrderPage: NextPage<Props> = ({ order }) => {

  return (
    <AdminLayout 
      title="Resumen de la orden" 
      subTitle={`OrdenID: ${order._id}`}
      icon={<AirplaneTicketOutlined />}
    >
      <>
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
                  <Box flexDirection='column' >
                    {
                      order.isPaid
                        ? (
                          <Chip
                            sx={{ my: 2, display: 'flex', flex: 1 }}
                            label='Orden ya fue pagada'
                            variant='outlined'
                            color='success'
                            icon={<CreditScoreOutlined />}
                          />
                        )
                        : (
                          <Chip
                            sx={{ my: 2, display: 'flex', flex: 1 }}
                            label='Pendiente de Pago'
                            variant='outlined'
                            color='error'
                            icon={<CreditCardOutlined />}
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

    </AdminLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query, res }) => {
  const { id = '' } = query;

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
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