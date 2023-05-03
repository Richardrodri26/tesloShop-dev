import { db } from '@/database';
import { IPaypal } from '@/interfaces';
import { Order } from '@/models';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method){
    case 'POST':
      return payOrder(req, res);
    
    default:
      res.status(400).json({ message: 'Bad request' })

  }
  
}
//  token A21AALamJtCj8yfm81dJ6xgQnRoseEarmHaN1iUnZo1rbJwjInYuIXHfbG-bKl-STYzRfhwaT9wrpm-NEMmNmyGbzzxEgae6g
const getPaypalBearerToken = async():Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

  const base64Token = Buffer.from(`${ PAYPAL_CLIENT_ID }:${ PAYPAL_SECRET }`, 'utf-8').toString('base64')
  const body = new URLSearchParams('grant_type=client_credentials')

  try {
    const { data } = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
      headers: {
        'Authorization': `Basic ${ base64Token }`,
        'Content-Type': 'application/x-www-form-urlencoded', 
      }
    })

    return data.access_token;

  } catch (error) {
    if(axios.isAxiosError(error)){
      console.log(error.response?.data)
    } else {
      console.log(error)
    }
  }
  return null

}

const payOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

  const paypalBearerToken = await getPaypalBearerToken();
  // A21AAJHNlFpqIddAdX6Km6-c9MpJ1q3qYIBZkm619Bv-HjXkvl7s--lAXoo60X_Cnrrj_RU-4F8UXUD24-EV7sp7b6WkZmK7Q

  if(!paypalBearerToken) {
    return res.status(400).json({message: 'No se pudo confirmar el token de paypal'})
  }

  const { transactionId = '', orderId = '' } = req.body;

  const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${ process.env.PAYPAL_ORDERS_URL }/${ transactionId }`, {
    headers: {
      'Authorization': `Bearer ${ paypalBearerToken }`
    }
  })

  if( data.status !== 'COMPLETED' ) {
    return res.status(401).json({message: 'Order no reconocida'})
  }

  await db.connect()

  const dbOrder = await Order.findById(orderId);
  if(!dbOrder) {
    await db.disconnect()
    return res.status(400).json({message: 'Order no existe en nuestra base de datos'})
  }

  if( dbOrder.total !== Number(data.purchase_units[0].amount.value) ){
    await db.disconnect()
    return res.status(400).json({message: 'Los montos de Paypal y nuestra orden no son iguales'})
  }

  dbOrder.transactionId = transactionId;
  dbOrder.isPaid = true
  await dbOrder.save()

  await db.disconnect()


  return res.status(200).json({ message: 'Orden pagada' })

}
