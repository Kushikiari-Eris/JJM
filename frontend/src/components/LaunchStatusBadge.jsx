import React from 'react'

const LaunchStatusBadge = ({LaunchStatus}) => {
    let LaunchStatusClasses;

    switch (LaunchStatus) {
      case 'Pending':
        LaunchStatusClasses = 'bg-orange-100 text-orange-800 text-xs font-medium me-2 px-3 py-2 rounded-full dark:bg-orange-900 dark:text-orange-300'; 
        break;
      case 'Launched':
        LaunchStatusClasses = 'bg-green-100 text-green-800 text-xs font-medium me-2 px-3 py-2 rounded-full dark:bg-green-900 dark:text-green-300';
        break;
      case 'Disabled':
        LaunchStatusClasses = 'bg-red-100 text-red-800 text-xs font-medium me-2 px-3 py-2 rounded-full dark:bg-red-900 dark:text-red-300'; 
        break;
      default:
        LaunchStatusClasses = 'bg-gray-500 text-white'; // Default class
    }
  return (
    <span className={`${LaunchStatusClasses}`}>
      {LaunchStatus}
    </span>
  )
}

export default LaunchStatusBadge