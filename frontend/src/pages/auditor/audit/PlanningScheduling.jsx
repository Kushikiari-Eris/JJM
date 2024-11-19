import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'

const PlanningScheduling = () => {

  const [auditPlan, setAuditPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [auditorName, setAuditorName] = useState("");
  const [auditTitle, setAuditTitle] = useState("");

  const modalRef = useRef(null); // Ref for the modal element

  // Pagination
  const itemsPerPage = 2;
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

  const fetchAuditPlan = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:7684/api/prompt", { auditorName, auditTitle });
      const data = response.data.auditPlan;
      setAuditPlan(Array.isArray(data) ? data : []);
      if (modalRef.current) modalRef.current.close();
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

      useEffect(() => {
        const fetchAudit = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:7684/api/prompt');
                const fetchedAudit = response.data;
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

    

  return (
    <>
    <div className="p-4 rounded-lg ">
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
                    <li>
                    <div className="flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <a href="#" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-gray-900">Audit</a>
                    </div>
                    </li>
                    <li aria-current="page">
                    <div className="flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Planning & Scheduling</span>
                    </div>
                    </li>
                </ol>
            </nav>
            <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-gray-900">Planning & Scheduling</h2>

            {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div class="flex items-center justify-center h-screen">
                  <div class="relative">
                      <div class="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                      <div class="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                      </div>
                  </div>
              </div>
            </div>
          )}
            <div className="flex flex-col bg-white">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="border rounded-lg divide-y divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
                  <div className='flex justify-between py-3 px-4'>
                    <div className="py-1 px-4">
                      <div className="relative max-w-xs flex justify-between">
                        <label className="sr-only">Search</label>
                        <input type="text" name="hs-table-with-pagination-search" id="hs-table-with-pagination-search" className="py-2 px-3 ps-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Search for items"/>
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                          <svg className="size-4 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                          </svg>
                        </div>
                        
                      </div>
                    </div>
                    <button onClick={() => modalRef.current.showModal()} className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-10 py-2 text-center  dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                         Generate a Plan
                    </button>
                    </div>
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <thead className="bg-gray-50 dark:bg-neutral-700">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Assigned Auditor</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Audit Title</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Audit Type</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Scope</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Task</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Status</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Priority</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Scheduled Date</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Expected Completion Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) :
                         currentAuditPlan.length > 0 ? (
                            currentAuditPlan.map((audit, index) => (
                          <tr key={index} >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{audit.AssignedAuditor}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{audit.AuditName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{audit.AuditType}</td>
                            <td className="px-6 py-4  text-sm text-gray-800 dark:text-neutral-200">{audit.Scope}</td>
                            {audit.Tasks && audit.Tasks.length > 0 ? (
                              audit.Tasks.map((task, taskIndex) => (
                                <tr key={`${audit._id}-${taskIndex}`}>
                                  <td className="px-6 py-1 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                    {task.Description}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-800 dark:text-neutral-200">
                                  No tasks available
                                </td>
                              </tr>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{audit.Status}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{audit.Priority}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{new Date(audit.ScheduledDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{new Date(audit.ExpectedCompletionDate).toLocaleDateString()}</td>
                          </tr>
                           ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">No Audit</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                    <div className="py-1 px-4">
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
                </div>
              </div>
            </div>

        

            <dialog id="my_modal_1" ref={modalRef} className="modal">
                <form
                    method="dialog"
                    className=" mx-auto py-10 px-8 border bg-white max-h-[90vh] overflow-auto rounded-lg relative"
                >
                    <h3 className="font-bold text-lg">Generate a Plan!</h3>
                    <p className="py-2">Assign a Person</p>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <div className="py-4 ">
                    <label>Auditor Name</label>
                    <input
                        type="text"
                        className="input input-bordered w-full my-3"
                        placeholder="Auditor Name"
                        value={auditorName}
                        onChange={(e) => setAuditorName(e.target.value)}
                    />
                    <label>Audit Title</label>
                    <input
                        type="text"
                        className="input input-bordered w-full my-3"
                        placeholder="Name or title of the audit"
                        value={auditTitle}
                        onChange={(e) => setAuditTitle(e.target.value)}
                    />
                    </div>
                    <div className="modal-action">
                    <button
                        onClick={fetchAuditPlan}
                        disabled={loading}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                        {loading ? "Generating..." : "Generate"}
                    </button>
                    <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                        Close
                    </button>
                    </div>
                </form>
            </dialog>
        </div>
    </>
  )
}

export default PlanningScheduling