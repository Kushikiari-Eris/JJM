import React, { useEffect, useState } from 'react'
import CurveLine from '../../components/apexCharts/CurveLine'
import Bar from '../../components/apexCharts/Bar'
import axios from 'axios'


const AuditDashboard = () => {
  return (
    <>
      <div className="p-4 ">
            <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                    <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-gray-900">
                        <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                        </svg>
                        Home
                    </a>
                    </li>
                    <li aria-current="page">
                    <div className="flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Dashboard</span>
                    </div>
                    </li>
                </ol>
            </nav>
                
            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="relative flex flex-col min-w-0 break-words bg-gradient-to-r from-blue-200 to-cyan-300 rounded-lg mb-6 xl:mb-0 shadow-base border">
                    <div className="flex-auto p-4">
                        <div className="flex flex-wrap">
                            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                                <h5 className="text-white font-bold text-xs">Total Products</h5>
                            <span className="font-bold text-white text-3xl">924</span>
                        </div>
                    </div>
                        <p className="text-sm text-white mt-4"><span className="text-emerald-500 mr-2"><i className="fas fa-arrow-up"></i> 3.48%</span><span className="whitespace-nowrap">Since last month</span></p>
                    </div>
                </div>

                <div className="relative flex flex-col min-w-0 break-words bg-gradient-to-r from-purple-300 to-purple-200 rounded-lg mb-6 xl:mb-0 shadow-base border">
                    <div className="flex-auto p-4">
                        <div className="flex flex-wrap">
                            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                                <h5 className="text-white font-bold text-xs">Orders</h5>
                            <span className="font-bold text-white text-3xl">$924,300</span>
                        </div>
                    </div>
                        <p className="text-sm text-white mt-4"><span className="text-white mr-2"><i className="fas fa-arrow-down"></i> 1.10%</span><span className="whitespace-nowrap">Since yesterday</span></p>
                    </div>
                </div>

                <div className="relative flex flex-col min-w-0 break-words bg-gradient-to-r from-pink-300 to-pink-200 rounded-lg mb-6 xl:mb-0 shadow-base border">
                    <div className="flex-auto p-4">
                        <div className="flex flex-wrap">
                            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                                <h5 className="text-white font-bold text-xs">Stock Items</h5>
                            <span className="font-bold text-white  text-3xl">49,65%</span>
                        </div>
                    </div>
                        <p className="text-sm text-white mt-4"><span className="text-white mr-2"><i className="fas fa-arrow-up"></i> 12%</span><span className="whitespace-nowrap">Since last month</span></p>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-base border p-4">
                    <CurveLine/>
                </div>
                <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-base border p-4">
                    <Bar/>
                </div>
            </div>

                <div className="grid grid-rows-3 grid-flow-col gap-4">
                    <div className="row-span-3">
                        <div className="relative shadow-base border sm:rounded-lg bg-white">
                        <h2 className='font-bold text-xm p-4'>Product Tracking and Monitoring</h2>
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            ID
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Product name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Location
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-white">
                                        #01
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-white">
                                            JJM Calamansi Dishwashing Liquid
                                        </th>
                                        <td className="px-6 py-4">
                                            Storage
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-1 rounded-lg dark:bg-green-900 dark:text-green-300">InStock</span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-white">
                                        #02
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-white">
                                            JJM Antifabric Conditioner
                                        </th>
                                        <td className="px-6 py-4">
                                            Storage
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-1 rounded-lg dark:bg-green-900 dark:text-green-300">InStock</span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-white">
                                        #03
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-white">
                                            JJM Lemon Dishwasing Liquid
                                        </th>
                                        <td className="px-6 py-4">
                                            Shipping
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-orange-100 text-orange-800 text-sm font-medium me-2 px-2.5 py-1 rounded-lg dark:bg-orange-900 dark:text-orange-300">InTransit</span>
                                        </td>
                                    </tr>
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-white">
                                        #04
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-white">
                                            JJM Calamansi Dishwashing Paste 
                                        </th>
                                        <td className="px-6 py-4">
                                            Customer Delivery
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-1 rounded-lg dark:bg-blue-900 dark:text-blue-300">Delivered</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <div className=" flex flex-col min-w-0 break-words bg-gradient-to-r from-blue-200 to-cyan-300 rounded-lg mb-6 xl:mb-0 shadow-base border">
                            <div className="flex-auto p-4">
                                <div className="flex flex-wrap">
                                    <div className=" w-full pr-4 max-w-full  flex-1">
                                        <h5 className="text-white font-bold text-xs">New Product Listing</h5>
                                        <span className="font-bold text-white text-3xl">5</span>
                                    </div>
                                </div>
                                <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                                <button onClick={()=>document.getElementById('my_modal_1').showModal()} className="text-white flex hover:text-blue-300 dark:text-blue-500 dark:hover:text-blue-400 mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </>
  )
}

export default AuditDashboard