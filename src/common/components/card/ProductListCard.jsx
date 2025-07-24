import React, { useContext, useEffect, useState, useCallback } from "react";
import BuyNowOverlay from "../button/BuyNowOverlay";
import ProductImage from "../Images/ProductImage";
import CustomButton from "../button/CustomButton";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../common/context/AuthProvider";
import { CiHeart } from "react-icons/ci";
import axios from "axios";
import { toast } from "react-toastify";
import { URL } from "../../../service/api";

const ProductListCard = React.memo(
  ({ id, image, name, special_offer, price, category, brand, in_stock }) => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Memoized check for wishlist status
    const checkWishlist = useCallback(async () => {
      if (!user) return;
      try {
        const { data } = await axios.get(
          `${URL}/users/${user.id}`
        );
        const found = data.wishlist?.some((item) => item.id === id);
        setIsInWishlist(found);
      } catch (err) {
        console.error("Error checking wishlist:", err);
      }
    }, [user, id]);

    useEffect(() => {
      checkWishlist();
    }, [checkWishlist]);

    const toggleWishlist = useCallback(
      async (e) => {
        e.stopPropagation();
        if (isLoading) return;

        if (!user) {
          toast.warning("Please login to use wishlist");
          return;
        }

        setIsLoading(true);
        try {
          const { data } = await axios.get(
            `${URL}/users/${user.id}`
          );
          let updatedWishlist;
          const exists = data.wishlist?.some((item) => item.id === id);

          if (exists) {
            updatedWishlist = data.wishlist.filter((item) => item.id !== id);
          } else {
            updatedWishlist = [
              ...(data.wishlist || []),
              { id, name, price, image_url: image, brand },
            ];
          }

          // Optimistic UI update
          setIsInWishlist(!exists);

          await axios.patch(
            `${URL}/users/${user.id}`,
            {
              wishlist: updatedWishlist,
            }
          );

          toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
        } catch (err) {
          console.error("Error updating wishlist:", err);
          // Revert optimistic update if error occurs
          setIsInWishlist((prev) => !prev);
          toast.error("Failed to update wishlist");
        } finally {
          setIsLoading(false);
        }
      },
      [user, id, name, price, image, brand, isLoading]
    );

    const handleClick = useCallback(() => {
      navigate(`/product/${id}`);
    }, [navigate, id]);

    return (
      <div
        onClick={handleClick}
        className="h-auto flex flex-col justify-between relative border border-gray-200 rounded-lg shadow-sm w-[230px] p-3 duration-300 transform hover:-translate-y-1 group bg-white cursor-pointer"
      >
        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          disabled={isLoading}
          className={`absolute top-2 left-2 z-10 p-1 rounded-full shadow-md transition ${
            isInWishlist
              ? "text-red-500 bg-red-100 hover:bg-red-200"
              : "text-gray-500 bg-white hover:bg-gray-100"
          } ${isLoading ? "opacity-70" : ""}`}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <CiHeart
            className={`text-xl ${isInWishlist ? "fill-current" : ""}`}
          />
        </button>

        {/* Special Offer Badge */}
        {special_offer !== "None" && (
          <div className="bg-red-500 text-[10px] z-10 absolute top-0 right-0 p-1 m-1 font-bold text-white rounded">
            {special_offer}
          </div>
        )}

        {/* Product Image */}
        <div className="relative mb-2">
          <ProductImage
            src={image}
            className="w-full h-[160px] rounded object-contain"
            alt={name}
          />
        </div>

        {/* Product Info */}
        <div className="flex justify-between font-semibold mt-1 text-sm text-gray-800">
          <div className="w-[110px] truncate">{name}</div>
          <div className="text-gray-900 font-bold">${price}.00</div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between font-medium mt-1 text-[11px] text-gray-500">
          <div>
            Category: <span className="text-gray-700">{category}</span>
          </div>
          <div>
            Brand: <span className="text-gray-700">{brand}</span>
          </div>
        </div>
        <span
  className={`mt-2 px-2 py-[2px] text-xs font-medium rounded-full ${
    in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
  }`}
>
  {in_stock ? "In Stock" : "Out of Stock"}
</span>
        {/* Action Buttons */}
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <CustomButton
            color="blue"
            className="sm:w-1/2 w-full h-[28px] text-xs"
          >
            Add to Cart
          </CustomButton>
          <CustomButton
            color="blue"
            className="sm:w-1/2 w-full h-[28px] text-xs"
          >
            Buy Now
          </CustomButton>
        </div>
      </div>
    );
  }
);

export default ProductListCard;
