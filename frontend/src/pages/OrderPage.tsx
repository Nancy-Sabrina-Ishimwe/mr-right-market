import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'
import { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import {
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../hooks/orderHooks'
import { Store } from '../Store'
import { ApiError } from '../types/ApiError'
import { getError } from '../utils'

export default function OrderPage() {
  const { state } = useContext(Store)
  const { userInfo } = state

  const params = useParams()
  const { id: orderId } = params

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId!)

  const { mutateAsync: payOrder, isLoading: loadingPay } = usePayOrderMutation()

  const testPayHandler = async () => {
    await payOrder({ orderId: orderId! })
    refetch()
    toast.success('Order is paid')
  }

  const [{ isPending, isRejected }, paypalDispatch] = usePayPalScriptReducer()

  const { data: paypalConfig } = useGetPaypalClientIdQuery()

  useEffect(() => {
    if (paypalConfig && paypalConfig.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypalConfig!.clientId,
            currency: 'USD',
          },
        })
        paypalDispatch({
          type: 'setLoadingStatus',
          value: SCRIPT_LOADING_STATE.PENDING,
        })
      }
      loadPaypalScript()
    }
  }, [paypalConfig, paypalDispatch])

  const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
    style: { layout: 'vertical' },
    createOrder(data, actions) {
      return actions.order
        .create({
          purchase_units: [
            {
              amount: {
                value: order!.totalPrice.toString(),
              },
            },
          ],
        })
        .then((orderID: string) => orderID)
    },
    onApprove(data, actions) {
      return actions.order!.capture().then(async (details) => {
        try {
          await payOrder({ orderId: orderId!, ...details })
          refetch()
          toast.success('Order is paid successfully')
        } catch (err) {
          toast.error(getError(err as ApiError))
        }
      })
    },
    onError: (err) => {
      toast.error(getError(err as ApiError))
    },
  }

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
  ) : !order ? (
    <MessageBox variant="danger">Order Not Found</MessageBox>
  ) : (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>

      <h1 className="text-2xl font-bold mb-6">Order {orderId}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column: shipping, payment, items */}
        <div className="lg:w-2/3 space-y-6">
          {/* Shipping card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Shipping</h2>
            </div>
            <div className="p-4">
              <div className="mb-2 text-gray-700 dark:text-gray-300">
                <strong>Name:</strong> {order.shippingAddress.fullName}
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <strong>Address:</strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </div>
              <div className="mt-3">
                {order.isDelivered ? (
                  <MessageBox variant="success">
                    Delivered at {order.deliveredAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="warning">Not Delivered</MessageBox>
                )}
              </div>
            </div>
          </div>

          {/* Payment card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Payment</h2>
            </div>
            <div className="p-4">
              <div className="mb-2 text-gray-700 dark:text-gray-300">
                <strong>Method:</strong> {order.paymentMethod}
              </div>
              <div>
                {order.isPaid ? (
                  <MessageBox variant="success">
                    Paid at {order.paidAt}
                  </MessageBox>
                ) : (
                  <MessageBox variant="warning">Not Paid</MessageBox>
                )}
              </div>
            </div>
          </div>

          {/* Items card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Items</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {order.orderItems.map((item) => (
                <div key={item._id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 sm:w-1/2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <Link
                      to={`/product/${item.slug}`}
                      className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <div className="sm:w-1/4">
                    <span className="text-gray-700 dark:text-gray-300">Quantity: {item.quantity}</span>
                  </div>
                  <div className="sm:w-1/4 font-semibold text-gray-900 dark:text-white">
                    ${item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: order summary and PayPal */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden sticky top-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Order Summary</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Items</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Shipping</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Tax</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Order Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>

              {!order.isPaid && (
                <div className="mt-4">
                  {isPending ? (
                    <LoadingBox />
                  ) : isRejected ? (
                    <MessageBox variant="danger">
                      Error in connecting to PayPal
                    </MessageBox>
                  ) : (
                    <div className="space-y-3">
                      <PayPalButtons {...paypalbuttonTransactionProps} />
                      <button
                        onClick={testPayHandler}
                        className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-md transition"
                      >
                        Test Pay
                      </button>
                    </div>
                  )}
                  {loadingPay && <LoadingBox />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}