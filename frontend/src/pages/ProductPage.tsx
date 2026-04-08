import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Rating from '../components/Rating'
import { useGetProductDetailsBySlugQuery } from '../hooks/productHooks'
import { Store } from '../Store'
import { ApiError } from '../types/ApiError'
import { convertProductToCartItem, getError } from '../utils'

export default function ProductPage() {
  const params = useParams()
  const { slug } = params
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug!)

  const { state, dispatch } = useContext(Store)
  const { cart } = state

  const navigate = useNavigate()

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product!._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    if (product!.countInStock < quantity) {
      toast.warn('Sorry. Product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...convertProductToCartItem(product!), quantity },
    })
    toast.success('Product added to the cart')
    navigate('/cart')
  }

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
  ) : !product ? (
    <MessageBox variant="danger">Product Not Found</MessageBox>
  ) : (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product image column */}
        <div className="lg:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Product details column */}
        <div className="lg:w-1/3">
          <Helmet>
            <title>{product.name}</title>
          </Helmet>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {product.name}
            </h1>
            <Rating rating={product.rating} numReviews={product.numReviews} />
            <div className="text-gray-700 dark:text-gray-300">
              <strong>Price:</strong> ${product.price}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <strong>Description:</strong>
              <p className="mt-1">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Order card column */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden sticky top-4">
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Price:</span>
                <span className="font-semibold">${product.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">Status:</span>
                <span>
                  {product.countInStock > 0 ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Unavailable
                    </span>
                  )}
                </span>
              </div>
              {product.countInStock > 0 && (
                <button
                  onClick={addToCartHandler}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}