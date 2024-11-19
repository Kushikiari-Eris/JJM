import React, { useEffect, useState } from 'react';
import profilePic from '../../../assets/image/profilePic.png';
import axios from 'axios';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MinusIcon, PhotoIcon, PlusIcon } from '@heroicons/react/24/outline';

const Execution = () => {
    const [auditPlan, setAuditPlan] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedAudit, setSelectedAudit] = useState(null)
    // Pagination
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(auditPlan.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAuditPlan = auditPlan.slice(startIndex, startIndex + itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        const fetchAudit = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:7684/api/prompt');
                const fetchedAudit = response.data.map((audit) => ({
                    ...audit,
                    Progress: audit.Progress || 0, // Ensure Progress field exists
                }));
                setAuditPlan(fetchedAudit.reverse());
            } catch (err) {
                console.error('Error fetching Audit:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAudit();
    }, []);

    const openModal = (audit) => {
        setSelectedAudit(audit); // Set the selected audit with its tasks
        document.getElementById('my_modal_1').showModal(); // Open the modal by ID
    };

    // Close modal
    const closeModal = () => {
        document.getElementById('my_modal_1').close();
        setSelectedAudit(null); // Reset selected audit
    };
    const handleProgressChange = async (taskId, newProgress) => {
        try {
            const response = await fetch(`http://localhost:7684/tasks/${taskId}/progress`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ progress: newProgress }),
            });
            const updatedTask = await response.json();
            setAuditPlan((prevPlan) =>
                prevPlan.map((task) =>
                    task._id === updatedTask._id ? updatedTask : task
                )
            );
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    return (
        <>
            <div className="p-4 rounded-lg">
                <nav className="flex mb-4" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <a
                                href="#"
                                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-gray-900"
                            >
                                <svg
                                    className="w-3 h-3 me-2.5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 1 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                                </svg>
                                Home
                            </a>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg
                                    className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                                <a
                                    href="#"
                                    className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-gray-900"
                                >
                                    Audit
                                </a>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg
                                    className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 6 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 9 4-4-4-4"
                                    />
                                </svg>
                                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                                    Audit Execution
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>
                <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-gray-900">
                    Audit Execution
                </h2>

                {loading ? (
                   
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                          <div class="flex items-center justify-center h-screen">
                              <div class="relative">
                                  <div class="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                                  <div class="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                                  </div>
                              </div>
                          </div>
                        </div>
              
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <div className='bg-white rounded-lg border'>
                        <div className="p-4  border-base rounded-lg grid grid-cols-4 gap-4">
                            {currentAuditPlan.map((audit, index) => (
                                <div key={index}>
                                    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4">
                                        <h2 className='font-semibold font-sans tracking-tight'>{audit.AuditName}</h2>
                                        <p className='font-sans tracking-tight text-sm text-gray-600'>{audit.Scope}</p>
                                        <div class="grid grid-cols-2 pt-4">
                                            <div>
                                                <p className='text-gray-500 text-xs'>Started Date</p>
                                                <p className=' font-sans text-xs'>{new Date(audit.ScheduledDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className='text-gray-500 text-xs'>End Date</p>
                                                <p className=' font-sans text-xs'>{new Date(audit.ExpectedCompletionDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="relative w-full">
                                            <div className="flex mb-2 items-center justify-between">
                                            
                                                <div className="text-right">
                                                    <span className="text-xs font-semibold inline-block text-blue-700">
                                                        {audit.Progress || 0}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                                <div
                                                    style={{ width: `${audit.Progress || 0}%` }}
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                                                ></div>
                                            </div>
                                        </div>

                                        <div className='flex justify-between items-center'>
                                            <div>
                                                <p className='text-sm text-gray-500 '>Assigned to</p>
                                                <p className='text-sm text-blue-900'>{audit.AssignedAuditor}</p>
                                            </div>
                                            <div>
                                                <button onClick={() => openModal(audit)}  className="ml-2 px-4 py-2 text-orange-600 rounded-md text-sm">
                                                    View Task
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                        </div>
                        <hr className="h-px mt-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                        <div className="py-4 px-4 ">
                        <nav className="flex items-center space-x-1" aria-label="Pagination">
                            <button 
                                type="button" 
                                className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" 
                                aria-label="Previous"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                <span aria-hidden="true">«</span>
                                <span className="sr-only">Previous</span>
                            </button>

                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`min-w-[30px] flex justify-center items-center text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 py-1 text-sm rounded disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:focus:bg-neutral-700 dark:hover:bg-neutral-700 ${
                                        currentPage === index + 1 ? 'bg-blue-500 text-white' : ''
                                    }`}
                                    onClick={() => setCurrentPage(index + 1)}
                                    aria-current={currentPage === index + 1 ? "page" : undefined}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button 
                                type="button" 
                                className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" 
                                aria-label="Next"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                <span className="sr-only">Next</span>
                                <span aria-hidden="true">»</span>
                            </button>
                        </nav>
                    </div>
                    </div>
                )}
                

                <dialog id="my_modal_1" className="modal">
                {selectedAudit ? (
                    <div className="modal-box max-w-5xl p-8">
                        
                            {/* Loop through tasks */}
                            <div className="mt-4">
                                {selectedAudit.Tasks.length > 0 ? (
                                    selectedAudit.Tasks.map((task, index) => (
                                        <div key={task._id} className="mb-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-5 items-center gap-3 sm:gap-1 ml-3">
                                                <div className="col-span-5 sm:col-span-5 ">
                                                <Disclosure as="div" className="border-b border-gray-200 py-6 w-full">
                                                    <h3 className="-my-3 flow-root">
                                                    <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                                        <span className="block text-sm/6 font-semibold text-gray-900">{task.Description}</span>
                                                        <span className="ml-6 flex items-center">
                                                        <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                                                        <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                                                        </span>
                                                    </DisclosureButton>
                                                    </h3>
                                                    <DisclosurePanel className="pt-6">
                                                    <div className="space-y-4">
                                                        <div className="sm:col-span-2">
                                                            <label htmlFor="reports" className="block text-sm/6 font-semibold text-gray-900">
                                                            Reports
                                                            </label>
                                                            <div className="mt-2.5">
                                                            <textarea
                                                                id="reports"
                                                                name="reports"
                                                                rows={4}
                                                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                                                                defaultValue={''}
                                                            />
                                                            </div>
                                                        </div>
                                                        <div className="col-span-full">
                                                            <label htmlFor="cover-photo" className="block text-sm/6 font-semibold text-gray-900">
                                                                Proof of Completion
                                                            </label>
                                                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                                                <div className="text-center">
                                                                <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                                                                <div className="mt-4 flex text-sm/6 text-gray-600">
                                                                    <label
                                                                    htmlFor="file-upload"
                                                                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                                    >
                                                                    <span>Upload a file</span>
                                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                                                    </label>
                                                                    <p className="pl-1">or drag and drop</p>
                                                                </div>
                                                                <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-10">
                                                            <button
                                                                type="submit"
                                                                className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                            >
                                                                Save Reports
                                                            </button>
                                                        </div>
                                                    </div>
                                                    </DisclosurePanel>
                                                </Disclosure>
                                                </div>
                                            </div>
                                           
                                        </div>
                                    ))
                                ) : (
                                    <p>No tasks available for this audit</p>
                                )}
                            </div>
 
                        <div className="modal-action">
                            <button className="btn" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                ) : (
                    <p>No Audit Selected</p>
                )}
                </dialog>
            </div>
        </>
    );
};

export default Execution;
