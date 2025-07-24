import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../../common/context/AuthProvider";
import { URL } from "../../../service/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isSameSizeInCart, setIsSameSizeInCart] = useState(false);
  const { setCartLength } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchProduct() {
      try {
        const response = await fetch(`${URL}/products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
        checkWishlistStatus(data.id);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message);
        toast.error("Failed to load product details");
      }
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkIfInCart = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !product || !size) return;
      try {
        const res = await fetch(`${URL}/users/${user.id}`);
        const userData = await res.json();
        const exists = userData.cart?.some(
          (item) => item.id === product.id && item.size === size
        );
        setIsSameSizeInCart(exists);
      } catch (err) {
        console.error("Error checking cart:", err);
      }
    };
    checkIfInCart();
  }, [product, size]);

  const checkWishlistStatus = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    try {
      const response = await fetch(`${URL}/users/${user.id}`);
      const userData = await response.json();
      const inWishlist = userData.wishlist?.some(
        (item) => item.id === productId
      );
      setIsInWishlist(inWishlist);
    } catch (err) {
      console.error("Error checking wishlist:", err);
    }
  };

  const handleAddToCart = async () => {
    if (!size) {
      toast.warning("Please select a size before adding to cart");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warning("Please log in first!");
      return;
    }
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      size,
      quantity: Number(quantity),
      image_url: product.image_url,
    };
    try {
      const userRes = await fetch(`${URL}/users/${user.id}`);
      if (!userRes.ok) throw new Error("User not found");
      const userData = await userRes.json();
      const existingItemIndex = userData.cart?.findIndex(
        (item) => item.id === product.id && item.size === size
      );
      let updatedCart;
      if (existingItemIndex !== -1 && existingItemIndex !== undefined) {
        updatedCart = [...userData.cart];
        updatedCart[existingItemIndex].quantity += Number(quantity);
        toast.success(
          `Quantity updated in cart (Total: ${updatedCart[existingItemIndex].quantity})`
        );
      } else {
        updatedCart = [...(userData.cart || []), cartItem];
        toast.success("Item added to cart!");
      }
      const patchRes = await fetch(`${URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: updatedCart }),
      });
      if (!patchRes.ok) throw new Error("Failed to update cart");
      setCartLength(updatedCart.length);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add item to cart");
    }
  };

  const handleAddToWishlist = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.warning("Please log in to add items to your wishlist!");
      return;
    }
    try {
      const userRes = await fetch(`${URL}/users/${user.id}`);
      if (!userRes.ok) throw new Error("User not found");
      const userData = await userRes.json();
      const wishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        brand: product.brand,
      };
      const alreadyInWishlist = userData.wishlist?.some(
        (item) => item.id === product.id
      );
      let updatedWishlist;
      if (alreadyInWishlist) {
        updatedWishlist = userData.wishlist.filter(
          (item) => item.id !== product.id
        );
        setIsInWishlist(false);
        toast.success("Removed from wishlist!");
      } else {
        updatedWishlist = [...(userData.wishlist || []), wishlistItem];
        setIsInWishlist(true);
        toast.success("Added to wishlist!");
      }
      const patchRes = await fetch(`${URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlist: updatedWishlist }),
      });
      if (!patchRes.ok) throw new Error("Failed to update wishlist");
    } catch (err) {
      console.error("Error updating wishlist:", err);
      toast.error("Failed to update wishlist");
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    quantity > 1 && setQuantity((prev) => prev - 1);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-red-600 font-semibold animate-pulse">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500 animate-pulse">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-4 sm:py-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-4 sm:mx-auto bg-white p-4 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-start">
          {/* Product Image */}
          <div className="relative group overflow-hidden rounded-lg sm:rounded-xl shadow-lg">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-64 sm:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-gray-800">
              ${product.price}
            </p>
            {typeof product.in_stock === "boolean" && (
              <span
                className={`inline-block px-3 py-[2px] text-xs font-medium rounded-full ${
                  product.in_stock
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.in_stock ? "In Stock" : "Out of Stock"}
              </span>
            )}

            {product.special_offer !== "None" && product.in_stock && (
              <span className="inline-block bg-red-500 text-white text-xs sm:text-sm font-medium px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-sm">
                {product.special_offer}
              </span>
            )}

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {product.description || "No description available."}
            </p>

            <div className="text-xs sm:text-sm text-gray-600">
              <strong className="text-gray-800">Category:</strong>{" "}
              {product.category}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              <strong className="text-gray-800">Brand:</strong> {product.brand}
            </div>

            {/* Size Selection */}
            {/* Size Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Available Sizes:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.available_sizes?.map((shoeSize) => (
                  <button
                    key={shoeSize}
                    onClick={() => setSize(shoeSize)}
                    disabled={!product.in_stock}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md border text-xs sm:text-sm font-medium transition
          ${
            size === shoeSize
              ? "bg-black text-white border-black"
              : "bg-white text-gray-800 border-gray-300"
          }
          ${
            !product.in_stock
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-gray-100"
          }
        `}
                  >
                    {shoeSize}
                  </button>
                ))}
              </div>
            </div>

            {/* quantity */}
            <div className="flex items-center space-x-4">
              <label className="text-xs sm:text-sm font-medium text-gray-700">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={decrementQuantity}
                  disabled={!product.in_stock}
                  className="px-3 py-1 sm:px-3 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 transition disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-white">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={!product.in_stock}
                  className="px-3 py-1 sm:px-3 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 transition disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
              {isSameSizeInCart ? (
                <button
                  onClick={() => navigate("/cart")}
                  disabled={!product.in_stock}
                  className={`flex items-center gap-2 py-2 px-4 sm:py-3 sm:px-6 rounded-full text-xs sm:text-sm font-semibold transition-shadow shadow-md ${
                    product.in_stock
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <CiShoppingCart className="text-base sm:text-lg" />
                  Go to Cart
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className={`flex items-center gap-2 py-2 px-4 sm:py-3 sm:px-6 rounded-full text-xs sm:text-sm font-semibold transition-shadow shadow-md ${
                    product.in_stock
                      ? "bg-black hover:bg-gray-800 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <CiShoppingCart className="text-base sm:text-lg" />
                  Add to Cart
                </button>
              )}

              <button
                onClick={handleAddToWishlist}
                className={`flex items-center gap-2 py-2 px-4 sm:py-3 sm:px-6 rounded-full text-xs sm:text-sm font-semibold transition ${
                  isInWishlist
                    ? "bg-red-100 text-red-600 border border-red-300 hover:bg-red-200"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <CiHeart
                  className={`text-base sm:text-lg ${
                    isInWishlist ? "fill-current" : ""
                  }`}
                />
                {isInWishlist ? "In Wishlist" : "Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
