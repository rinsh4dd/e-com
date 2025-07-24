import React, { useContext, useEffect, useState } from "react";
import Card from "../../../common/components/card/Card";
import { GetAllProducts } from "../../../service/product";
import Brand from "./Brand";
import About from "./About";
import Guarantee from "./MoreAbout";
import ProductListCard from "../../../common/components/card/ProductListCard";
import { AuthContext } from "../../../common/context/AuthProvider";
import { useNavigate } from "react-router-dom";

function Landing() {
  const [item, setItem] = useState([]);
  const [item2, setItem2] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  const navigate = useNavigate();
  const bannerImages = [
    "https://i.pinimg.com/1200x/17/55/1d/17551d7fb79e01ee35caf6fb6e92eb83.jpg",
    "https://i.pinimg.com/1200x/a0/0a/39/a00a3996dd716284d5cae1eacb0761f4.jpg",
    "https://i.pinimg.com/1200x/2a/b5/91/2ab5915b8d216b598c584f9a484bcee9.jpg",
  ];
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role === "admin") {
      navigate("/admin/dashboard");
    }
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await GetAllProducts(0, 10);
        const data2 = await GetAllProducts(11, 21);
        setItem(data);
        setItem2(data2);
      } catch (err) {
        console.log("Error in useEffect:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
     
      <div className="relative w-full mb-4 h-[300px] sm:h-[400px] md:h-[450px] overflow-hidden rounded-lg shadow">
        {bannerImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="Brand banner"
            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${
              index === currentBanner ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* 🔁 Product Grid with Loader */}
      <div className="min-h-[200px]">
        {loading ? (
          <p className="text-center text-gray-600 py-8 text-lg">
            Loading products...
          </p>
        ) : item.length === 0 ? (
          <p className="text-center text-red-500 py-8 text-lg">
            No products found or failed to load.
          </p>
        ) : (
          <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
            {item.map((e) => (
              <Card
                key={e?.id}
                id={e?.id}
                image={e?.image_url}
                name={e?.name}
                special_offer={e?.special_offer}
                price={e?.price}
                in_stock={e?.in_stock}
              />
            ))}
          </div>
        )}
      </div>

      {/* 🔁 Brand, About, Products List Section */}
      <Brand />
      <About />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-6 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-gray-800">Products</h2>
          <p className="mt-2 text-gray-600">Browse our premium collection</p>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 py-6 text-lg">
            Loading more products...
          </p>
        ) : item2.length === 0 ? (
          <p className="text-center text-red-500 py-6 text-lg">
            No more products found.
          </p>
        ) : (
          <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
            {item2.map((e) => (
              <ProductListCard
                key={e?.id}
                id={e?.id}
                image={e?.image_url}
                name={e?.name}
                special_offer={e?.special_offer}
                price={e?.price}
                category={e?.category}
                brand={e?.brand}
                in_stock={e?.in_stock}
              />
            ))}
          </div>
        )}
      </div>

      <Guarantee />
    </div>
  );
}

export default Landing;
