import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'
import { CartItem } from '../types/Cart'

export default function CartPage() {
  const navigate = useNavigate()

  const {
    state: {
      mode,
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store)

  const updateCartHandler = (item: CartItem, quantity: number) => {
    if (item.countInStock < quantity) {
      toast.warn('Sorry. Product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    })
  }

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping')
  }

  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }

  // Calculate subtotal
  const subtotalItems = cartItems.reduce((a, c) => a + c.quantity, 0)
  const subtotalPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>

      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items section */}
        <div className="lg:w-2/3">
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/" className="text-blue-600 hover:underline">Go Shopping</Link>
            </MessageBox>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item: CartItem) => (
                <div
                  key={item._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Product image and name */}
                    <div className="sm:w-2/5 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <Link
                        to={`/product/${item.slug}`}
                        className="text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {item.name}
                      </Link>
                    </div>

                    {/* Quantity controls */}
                    <div className="sm:w-1/3 flex items-center gap-2">
                      <button
                        onClick={() => updateCartHandler(item, item.quantity - 1)}
                        disabled={item.quantity === 1}
                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <i className="fas fa-minus-circle"></i>
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateCartHandler(item, item.quantity + 1)}
                        disabled={item.quantity === item.countInStock}
                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <i className="fas fa-plus-circle"></i>
                      </button>
                    </div>

                    {/* Price */}
                    <div className="sm:w-1/5 font-semibold text-gray-900 dark:text-white">
                      ${item.price}
                    </div>

                    {/* Remove button */}
                    <div className="sm:w-auto">
                      <button
                        onClick={() => removeItemHandler(item)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order summary card */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Subtotal ({subtotalItems} {subtotalItems === 1 ? 'item' : 'items'}) : ${subtotalPrice.toFixed(2)}
            </h3>
            <button
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}