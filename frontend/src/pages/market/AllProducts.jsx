import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {  FunnelIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid'

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(["All"]); 
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCategories.includes("All")) {
      setFilteredProducts(products); // Show all products
    } else {
      setFilteredProducts(
        products.filter((product) => selectedCategories.includes(product.category))
      );
    }
    fetchProducts();
  }, [selectedCategories, products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:7684/api/finishGoods');
      if (Array.isArray(response.data)) {
        const launchedProducts = response.data.filter(product => product.launchStatus === 'Launched');
        setProducts(launchedProducts); 

        const uniqueCategories = [...new Set(response.data.map(product => product.category))];
        setCategories(uniqueCategories); // Set categories dynamically
      } else {
        console.warn("Products not in expected format", response.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  };

  const handleCategoryChange = (category) => {
    // If "All" is clicked, deselect other categories
    if (category === "All") {
      setSelectedCategories(["All"]);
    } else {
      // Toggle category selection
      setSelectedCategories((prevSelected) => {
        const newSelected = prevSelected.includes(category)
          ? prevSelected.filter((c) => c !== category) // Deselect category
          : [...prevSelected.filter((c) => c !== "All"), category]; // Select category, remove "All" if selected

        // Auto-select "All" if no categories are selected
        return newSelected.length === 0 ? ["All"] : newSelected;
      });
    }
  };

  return (
    <>
      <div className="bg-white flex flex-col min-h-screen">
        <Navbar />
        <div className='flex-grow'>
          {/* Mobile filter dialog */}
          <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
            <DialogBackdrop
              transition
              className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
            />

            <div className="fixed inset-0 z-40 flex">
              <DialogPanel
                transition
                className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
              >
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </div>

                {/* Mobile */}
                <form className="mt-4 border-t border-gray-200">
                  {/* Categories filter */}
                  <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-10 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">Categories</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                          <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            id="all"
                            name="all"
                            type="checkbox"
                            checked={selectedCategories.includes("All")}
                            onChange={() => handleCategoryChange("All")}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="all" className="ml-3 text-sm text-gray-600">
                            All Products
                          </label>
                        </div>
                        {categories.map((category, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              id={category}
                              name={category}
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={() => handleCategoryChange(category)}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={category} className="ml-3 text-sm text-gray-600">
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                </form>
              </DialogPanel>
            </div>
          </Dialog>

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

          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">All Products</h1>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                >
                  <span className="sr-only">Filters</span>
                  <FunnelIcon aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
            </div>

            <section aria-labelledby="products-heading" className="pb-24 pt-6">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                {/* Filters */}
                <form className="hidden lg:block">
                  <Disclosure as="div" className="border-b border-gray-200 py-6">
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">Categories</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon aria-hidden="true" className="h-5 w-5 group-data-[open]:hidden" />
                          <MinusIcon aria-hidden="true" className="h-5 w-5 [.group:not([data-open])_&]:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            id="all"
                            name="all"
                            type="checkbox"
                            checked={selectedCategories.includes("All")}
                            onChange={() => handleCategoryChange("All")}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label htmlFor="all" className="ml-3 text-sm text-gray-600">
                            All Products
                          </label>
                        </div>
                        {categories.map((category, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              id={category}
                              name={category}
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={() => handleCategoryChange(category)}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={category} className="ml-3 text-sm text-gray-600">
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                </form>

                {/* Product grid */}
                <div className="lg:col-span-3 md:row">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                  {filteredProducts.length > 0 ? (
                      filteredProducts.map((productItem) => {
                        const allSizesOutOfStock = productItem.unitPrize.every(priceItem => priceItem.stock === 0);

                        return (
                          <div
                            key={productItem._id}
                            className="flex flex-col bg-white h-[420px] border rounded-xl"
                          >
                            {allSizesOutOfStock ? (
                              <div className="relative">
                                <img
                                  className="w-full h-64 object-cover rounded-t-xl mb-4 opacity-50"
                                  src={`http://localhost:7684/uploads/${productItem.image}`}
                                  alt={productItem.productName}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-xl font-bold text-red-600 bg-white rounded-md px-4 py-2">
                                    Out of Stock
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <Link to={`/market/productDetail/${productItem._id}`}>
                                <img
                                  className="w-full h-64 rounded-t-xl object-cover mb-4 hover:opacity-50"
                                  src={`http://localhost:7684/uploads/${productItem.image}`}
                                  alt={productItem.productName}
                                />
                              </Link>
                            )}
                            <Link
                              to={`/market/productDetail/${productItem._id}`}
                              className={allSizesOutOfStock ? 'pointer-events-none' : ''}
                            >
                              <h5 className="text-base font-semibold  px-4 text-gray-900 ">
                                {productItem.productName}
                              </h5>
                            </Link>
                            <div className="flex flex-col px-4 mt-3">
                              {productItem.unitPrize.map((priceItem) => (
                                <span key={priceItem._id}>
                                  {priceItem.stock === 0 ? (
                                    <div className='flex justify-between text-sm items-center'>
                                      <p className="font-sans capitalize">{priceItem.size}</p>
                                      <p className="font-medium text-red-600">Out of Stock</p>
                                    </div>
                                  ) : (
                                    <div className='flex justify-between text-sm items-center'>
                                      <p className="capitalize">{priceItem.size}</p>
                                      <p className="font-semibold">₱{priceItem.price}</p>
                                    </div>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-3">No Products Available</div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
        <Footer />
      </div>  
    </>
  );
};

export default AllProducts;
