import ProductImage from "../Images/ProductImage";
import BuyNowOverlay from "../button/BuyNowOverlay";

function Card({ id, image, name, special_offer, price }) {
  return (
    <div
      data-aos="fade-down"
      data-aos-duration="200"
      className="h-[320px] w-[240px] p-4 relative flex flex-col justify-between 
                 bg-white rounded-xl shadow-lg border border-gray-100 
                 duration-300 transform hover:scale-[1.02] hover:shadow-xl 
                 group transition-all ease-in-out overflow-hidden"
    >
      {/* Elegant Special Offer Ribbon */}
      {special_offer !== "None" && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded shadow-md">
            {special_offer}
          </div>
        </div>
      )}

      {/* Product Image Container */}
      <div className="relative h-[180px] w-full overflow-hidden rounded-lg bg-gray-50">
        <ProductImage
          src={image}
          alt={name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        <BuyNowOverlay
          id={id}
          image={image}
          name={name}
          price={price}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="mt-3 space-y-2">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-[40px]">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-900">${price}.00</span>
            {special_offer !== "None" && (
              <span className="ml-2 text-xs line-through text-gray-400">
                ${Math.round(price * 1.2)}{" "}
                {/* Shows 20% higher original price */}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Subtle hover effect border */}
      <div
        className="absolute inset-0 border-2 border-transparent group-hover:border-gray-200 
                     rounded-xl pointer-events-none transition-all duration-300"
      />
    </div>
  );
}

export default Card;
