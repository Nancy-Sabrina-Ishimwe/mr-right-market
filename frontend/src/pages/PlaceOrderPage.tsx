import { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CheckoutSteps from '../components/CheckoutSteps'
import LoadingBox from '../components/LoadingBox'
import { useCreateOrderMutation } from '../hooks/orderHooks'
import { Store } from '../Store'
import { ApiError } from '../types/ApiError'
import { getError } from '../utils'

export default function PlaceOrderPage() {
  const navigate = useNavigate()

  const { state, dispatch } = useContext(Store)
  const { cart, userInfo } = state

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100 // 123.2345 => 123.23

  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  )
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10)
  cart.taxPrice = round2(0.15 * cart.itemsPrice)
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice

  const { mutateAsync: createOrder, isLoading } = useCreateOrderMutation()

  const placeOrderHandler = async () => {
    try {
      const data = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
      dispatch({ type: 'CART_CLEAR' })
      localStorage.removeItem('cartItems')
      navigate(`/order/${data.order._id}`)
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment')
    }
  }, [cart, navigate])

  return (
    <div className="container mx-auto px-4 py-6">
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="text-2xl font-bold my-4">Preview Order</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column: shipping, payment, items */}
        <div className="lg:w-2/3 space-y-6">
          {/* Shipping card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Shipping</h2>
              <Link to="/shipping" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm">
                Edit
              </Link>
            </div>
            <div className="p-4">
              <div className="text-gray-700 dark:text-gray-300">
                <strong>Name:</strong> {cart.shippingAddress.fullName}
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <strong>Address:</strong> {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </div>
            </div>
          </div>

          {/* Payment card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Payment</h2>
              <Link to="/payment" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm">
                Edit
              </Link>
            </div>
            <div className="p-4">
              <div className="text-gray-700 dark:text-gray-300">
                <strong>Method:</strong> {cart.paymentMethod}
              </div>
            </div>
          </div>

          {/* Items card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Items</h2>
              <Link to="/cart" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm">
                Edit
              </Link>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {cart.cartItems.map((item) => (
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

        {/* Right column: order summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden sticky top-4">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Order Summary</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Items</span>
                <span>${cart.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Shipping</span>
                <span>${cart.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Tax</span>
                <span>${cart.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                <span>Order Total</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div>
                <button
                  type="button"
                  onClick={placeOrderHandler}
                  disabled={cart.cartItems.length === 0 || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Place Order
                </button>
                {isLoading && <LoadingBox />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}