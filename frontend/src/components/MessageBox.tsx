import { ReactNode } from 'react'

interface MessageBoxProps {
  variant?: 'info' | 'danger' | 'success' | 'warning' | 'dark' | 'light'
  children: ReactNode
  icon?: ReactNode
}

export default function MessageBox({ variant = 'info', children, icon }: MessageBoxProps) {
  const variantClasses = {
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    danger: 'bg-red-100 text-red-800 border-red-300',
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    dark: 'bg-gray-800 text-white border-gray-700',
    light: 'bg-gray-100 text-gray-800 border-gray-300',
  }

  return (
    <div
      role="alert"
      className={`flex items-center p-4 mb-4 rounded-md border ${variantClasses[variant]}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <div>{children}</div>
    </div>
  )
}