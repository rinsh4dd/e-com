import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { URL } from "../service/api";
import ShoeCartLoader from "../common/ui/Loader";

function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${URL}/products`
        );
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleToggleStock = async (productId, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      await axios.patch(
        `${URL}/products/${productId}`,
        { in_stock: updatedStatus }
      );
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, in_stock: updatedStatus } : p
        )
      );
    } catch (err) {
      alert("Failed to update stock status.");
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `${URL}/products/${productId}`
        );
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } catch (err) {
        setError("Failed to delete product. Please try again.");
      }
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (num) => setCurrentPage(num);

  if (loading) {
    return (
     <ShoeCartLoader/>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 p-6 rounded-lg text-center">
          <h3 className="text-red-800 font-bold mb-4">{error}</h3>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
          <button
            onClick={() => navigate("/admin/products/addproduct")}
            className="bg-gray-900 text-white hover:bg-gray-800 font-medium py-2.5 px-5 rounded-md transition-all duration-200 flex items-center gap-2 shadow hover:shadow-md"
          >
            <FaPlus />
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, brand, or category"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Product
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Brand
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Category
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Price
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">
                  Stock
                </th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            product.image_url ||
                            "https://via.placeholder.com/150"
                          }
                          alt={product.name}
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                        <div>
                          <div className="font-medium text-gray-800">
                            {product.name}
                          </div>
                          <div className="text-gray-500">{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.brand || "-"}</td>
                    <td className="px-6 py-4">{product.category || "-"}</td>
                    <td className="px-6 py-4">${product.price || "0"}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleToggleStock(product.id, product.in_stock)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.in_stock
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          navigate(`/admin/products/edit/${product.id}`)
                        }
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center px-6 py-4 text-gray-500"
                  >
                    {searchTerm
                      ? "No matching products found."
                      : "No products available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredProducts.length > productsPerPage && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/90 pt-0 backdrop-blur-sm py-3 shadow-md">
            <div className="flex justify-center items-center gap-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30 transition-all"
              >
                <FaChevronLeft />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white shadow-sm"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-30 transition-all"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageProducts;
