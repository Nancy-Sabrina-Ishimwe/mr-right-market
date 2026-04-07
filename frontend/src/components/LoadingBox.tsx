export default function LoadingBox() {
  return (
    <div className="flex justify-center items-center p-4" role="status">
      <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}