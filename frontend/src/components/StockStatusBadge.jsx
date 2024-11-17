import React from 'react'

const StockStatusBadge = ({status}) => {
    let statusClasses;

  switch (status) {
    case 'LowOnStock':
      statusClasses = 'bg-yellow-200 text-yellow-800 text-xs font-medium me-2 px-3 py-2 rounded-full dark:bg-yellow-900 dark:text-yellow-300 mb-2'; // Low on stock
      break;
    case 'OutOfStock':
      statusClasses = 'bg-red-100 text-red-800 text-xs font-medium me-2 px-3 py-2 rounded-full dark:bg-red-900 dark:text-red-300 mb-2'; // Out of stock
      break;
    case 'InStock':
      statusClasses = 'bg-green-100 text-green-800 text-xs font-medium me-2 px-3 py-2 rounded-full dark:bg-green-900 dark:text-green-300 mb-2'; // In stock
      break;
    default:
      statusClasses = 'bg-gray-500 text-white'; // Default class
  }
  return (
    <>
    <span className={`${statusClasses}`}>
      {status}
    </span>
    </>
  )
}

export default StockStatusBadge