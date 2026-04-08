import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { useGetOrderHistoryQuery } from '../hooks/orderHooks'
import { ApiError } from '../types/ApiError'
import { getError } from '../utils'

export default function OrderHistoryPage() {
  const navigate = useNavigate()
  const { data: orders, isLoading, error } = useGetOrderHistoryQuery()

  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {isLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">DATE</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">TOTAL</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">PAID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">DELIVERED</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders!.map((order) => (
                <tr key={order._id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{order._id}</td>
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                    {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                    {order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-medium py-1 px-3 rounded-md transition"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}