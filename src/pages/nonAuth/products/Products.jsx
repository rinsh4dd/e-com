import React, { useEffect, useState } from "react";
import ProductListCard from "../../../common/components/card/ProductListCard";
import { GetAllProducts } from "../../../service/product";
import ShoeCartLoader from "../../../common/ui/Loader";

function Products() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [limit, setLimit] = useState(20);
  const [activeCat, setActiveCat] = useState("All");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await GetAllProducts(0, 100);
        setItems(data);
        setCategories([...new Set(data.map((p) => p.category))]);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch:", err);
      }
    })();
  }, []);

  useEffect(() => {
    let data = [...items];
    if (activeCat !== "All")
      data = data.filter((p) => p.category === activeCat);
    if (search)
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    if (sort === "asc") data.sort((a, b) => a.price - b.price);
    if (sort === "desc") data.sort((a, b) => b.price - a.price);
    setFilteredItems(data.slice(0, limit));
  }, [items, search, sort, limit, activeCat]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full sm:w-1/2 border border-gray-300 rounded-full py-2 px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters - Responsive & Stylish */}
      <div className="mb-8">
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-4">
            {/* Categories */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Categories
              </h3>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {["All", ...categories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={`py-2.5 px-5 whitespace-nowrap rounded-full text-sm font-medium capitalize transition-all duration-200 flex-shrink-0 ${
                      activeCat === cat
                        ? "bg-gradient-to-r from-gray-900 to-black text-white shadow-lg transform scale-105"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md border border-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort & Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-full bg-gradient-to-r from-gray-900 to-black text-white rounded-xl py-3 px-4 text-sm font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-between group"
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  Sort & Filter Options
                </span>
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${showMenu ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMenu && (
                <div className="absolute left-0 right-0 mt-3 z-30 bg-white shadow-2xl rounded-xl border border-gray-100 overflow-hidden">
                  <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                          Sort by Price
                        </h4>
                        <div className="space-y-2">
                          {[
                            { value: "asc", label: "Low to High", icon: "↑" },
                            { value: "desc", label: "High to Low", icon: "↓" }
                          ].map(({ value, label, icon }) => (
                            <button
                              key={value}
                              onClick={() => {
                                setSort(value);
                                setShowMenu(false);
                              }}
                              className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-200 flex items-center ${
                                sort === value 
                                  ? "bg-gray-900 text-white shadow-md" 
                                  : "hover:bg-gray-50 text-gray-700 border border-gray-100"
                              }`}
                            >
                              <span className="mr-3 text-lg">{icon}</span>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          Show Items
                        </h4>
                        <div className="space-y-2">
                          {[5, 10, 20, 50].map((l) => (
                            <button
                              key={l}
                              onClick={() => {
                                setLimit(l);
                                setShowMenu(false);
                              }}
                              className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-between ${
                                limit === l 
                                  ? "bg-gray-900 text-white shadow-md" 
                                  : "hover:bg-gray-50 text-gray-700 border border-gray-100"
                              }`}
                            >
                              <span>{l} products</span>
                              {limit === l && <span className="text-sm">✓</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex justify-between items-center gap-6 bg-white rounded-2xl   p-6">
          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide flex-1">
            {["All", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`py-2.5 px-6 whitespace-nowrap rounded-full text-sm font-medium capitalize transition-all duration-200 ${
                  activeCat === cat
                    ? "bg-gradient-to-r from-gray-900 to-black text-white shadow-lg transform scale-105"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Limit */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-gradient-to-r from-gray-900 to-black text-white rounded-xl py-2.5 px-5 text-sm font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Sort & Filter
              <svg 
                className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${showMenu ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 z-30 bg-white shadow-2xl rounded-xl w-80 border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        Sort by Price
                      </h4>
                      <div className="space-y-2">
                        {[
                          { value: "asc", label: "Low to High", icon: "↑" },
                          { value: "desc", label: "High to Low", icon: "↓" }
                        ].map(({ value, label, icon }) => (
                          <button
                            key={value}
                            onClick={() => {
                              setSort(value);
                              setShowMenu(false);
                            }}
                            className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-200 flex items-center ${
                              sort === value 
                                ? "bg-gray-900 text-white shadow-md" 
                                : "hover:bg-gray-50 text-gray-700 border border-gray-100"
                            }`}
                          >
                            <span className="mr-3 text-lg">{icon}</span>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        Show Items
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[5, 10, 20, 50].map((l) => (
                          <button
                            key={l}
                            onClick={() => {
                              setLimit(l);
                              setShowMenu(false);
                            }}
                            className={`py-3 px-4 rounded-lg transition-all duration-200 text-center ${
                              limit === l 
                                ? "bg-gray-900 text-white shadow-md" 
                                : "hover:bg-gray-50 text-gray-700 border border-gray-100"
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="min-h-[400px]">
        {loading ? (
          <ShoeCartLoader/>
        ) : filteredItems.length > 0 ? (
          <div className="grid gap-6 justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((p) => (
              <ProductListCard
                key={p.id}
                id={p.id}
                image={p.image_url}
                name={p.name}
                special_offer={p.special_offer}
                price={p.price}
                category={p.category}
                brand={p.brand}
                in_stock = {p.in_stock}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;