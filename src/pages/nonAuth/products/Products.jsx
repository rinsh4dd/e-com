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

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Categories - scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`py-2 px-4 whitespace-nowrap rounded-full border text-sm font-medium capitalize transition ${
                activeCat === cat
                  ? "bg-black text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & Limit */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="py-2 px-4 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"
          >
            Filter
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 z-20 bg-white shadow-xl rounded-lg p-4 w-52 text-sm">
              <div className="mb-2">
                <p className="text-xs font-bold text-gray-500 mb-1">
                  Sort by Price
                </p>
                <button
                  onClick={() => {
                    setSort("asc");
                    setShowMenu(false);
                  }}
                  className="w-full text-left py-1 hover:bg-gray-100 rounded"
                >
                  Low to High
                </button>
                <button
                  onClick={() => {
                    setSort("desc");
                    setShowMenu(false);
                  }}
                  className="w-full text-left py-1 hover:bg-gray-100 rounded"
                >
                  High to Low
                </button>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">Limit</p>
                {[5, 10, 20, 50].map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLimit(l);
                      setShowMenu(false);
                    }}
                    className="w-full text-left py-1 hover:bg-gray-100 rounded"
                  >
                    Show {l}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="min-h-[400px]">
        {loading ? (
          <ShoeCartLoader/>
        ) : filteredItems.length > 0 ? (
          <div className="grid gap-4 grid-cols-2 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                in_stock={p.in_stock}
                mobileView={true} // Add this prop for mobile-specific styling
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