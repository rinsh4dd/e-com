import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaImage, FaTags, FaInfoCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { URL } from "../service/api";

function AddProductPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    available_sizes: [],
    image_url: "",
    in_stock: true,
    special_offer: "",
    discount: 0,
    warranty: "",
    additional_details: ""
  });

  const sizeOptions = ["4", "5", "6", "7", "8", "9", "10"];
  const categoryOptions = ["Men's", "Women", "Casual", "Running", "Formal", "Sneakers", "Slippers"];
  const brandOptions = ["Nike", "Adidas", "Puma", "Reebok", "New Balance", "Vans", "Converse"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSizeChange = (size) => {
    setProduct(prev => {
      const newSizes = prev.available_sizes.includes(size)
        ? prev.available_sizes.filter(s => s !== size)
        : [...prev.available_sizes, size];
      return { ...prev, available_sizes: newSizes };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.image_url || !product.brand) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${URL}/products`, {
        ...product,
        price: Number(product.price),
        discount: Number(product.discount),
      });
      toast.success("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Form Header - Nike-inspired */}
          <div className="bg-black px-6 py-4 sm:px-8 sm:py-6">
            <div className="flex items-center justify-between">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white"
              >
                <span className="text-white">Add</span> <span className="text-gray-300">New Product</span>
              </motion.h2>
              <button
                onClick={() => navigate("/admin/products")}
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Basics */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <FaInfoCircle className="text-gray-700" /> Basic Information
                </h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Product Name *
                    </label>
                    <input
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-4 py-3 border"
                      placeholder="e.g. Air Max 270"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Brand *
                    </label>
                    <select
                      name="brand"
                      value={product.brand}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-4 py-3 border bg-white"
                    >
                      <option value="">Select a brand</option>
                      {brandOptions.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-4 py-3 border"
                    placeholder="Detailed product description..."
                  />
                </div>
              </motion.div>

              {/* Pricing & Inventory */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <FaTags className="text-gray-700" /> Pricing & Inventory
                </h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Price *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-black focus:ring-black sm:text-sm px-4 py-3 border"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={product.discount}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-4 py-3 border"
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      name="category"
                      value={product.category}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-4 py-3 border bg-white"
                    >
                      <option value="">Select a category</option>
                      {categoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Available Sizes
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                    {sizeOptions.map(size => (
                      <div key={size} className="flex items-center">
                        <input
                          id={`size-${size}`}
                          type="checkbox"
                          checked={product.available_sizes.includes(size)}
                          onChange={() => handleSizeChange(size)}
                          className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                        />
                        <label htmlFor={`size-${size}`} className="ml-2 block text-sm text-gray-700">
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="in_stock"
                      name="in_stock"
                      type="checkbox"
                      checked={product.in_stock}
                      onChange={handleChange}
                      className="focus:ring-black h-4 w-4 text-black border-gray-300 rounded"
                    />
                  </div>
                  <div className="text-sm">
                    <label htmlFor="in_stock" className="font-medium text-gray-700">
                      Currently in stock
                    </label>
                    <p className="text-gray-500">Uncheck if product is unavailable</p>
                  </div>
                </div>
              </motion.div>

              {/* Media & Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <FaImage className="text-gray-700" /> Media & Additional Information
                </h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL *
                  </label>
                  <input
                    name="image_url"
                    value={product.image_url}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-4 py-3 border"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {product.image_url && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Image Preview:</div>
                    <div className="w-32 h-32 rounded-md overflow-hidden border border-gray-200">
                      <img 
                        src={product.image_url} 
                        alt="Product preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/150?text=Image+Not+Found";
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Warranty Information
                    </label>
                    <input
                      name="warranty"
                      value={product.warranty}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-4 py-3 border"
                      placeholder="e.g. 1 year manufacturer warranty"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Special Offer
                    </label>
                    <input
                      name="special_offer"
                      value={product.special_offer}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-4 py-3 border"
                      placeholder="e.g. Limited edition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Details
                  </label>
                  <textarea
                    name="additional_details"
                    value={product.additional_details}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm px-4 py-3 border"
                    placeholder="Any other product specifications..."
                  />
                </div>
              </motion.div>

              {/* Form Actions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex justify-end pt-6 border-t border-gray-200"
              >
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaSave className="-ml-1 mr-3 h-5 w-5" />
                      Save Product
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AddProductPage;