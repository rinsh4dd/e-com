import { Link } from "react-router-dom";
import aboutVid from "../../../assets/aboutVid.mp4";

const About = () => {
  return (
  <div className="relative p-4 mb-5 bg-white shadow-md mt-[30px] overflow-hidden group grid grid-cols-1 md:grid-cols-2 max-w-[1600px] mx-auto">
  <div className="w-full aspect-[4/3.4]"> {/* Changed from 1/1 to 4/3 */}
    <video
      src={aboutVid}
      data-aos="fade-right"
      data-aos-duration="200"
      className="w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
    />
  </div>
  
  <div className="w-full aspect-[4/3.4] flex flex-col items-center justify-center bg-gray-200 p-4"       data-aos-duration="100"
 data-aos="fade-left"> {/* Changed from 1/1 to 4/3 */}
    <div className="max-w-xs text-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">About Us</h1> {/* Reduced text size and margin */}
      <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base"> {/* Reduced text size and margin */}
        At ShoeCart, we craft premium materials that harmonize <span className="font-medium text-gray-800">comfort, sustainability, and thoughtful design</span>. Every piece is meticulously engineered using ethically sourced fabrics and eco-conscious processes.
      </p>
      <Link
        to="/about"
        className="
          inline-block 
          border-2 border-blue-600/90 
          text-blue-600/90             
          font-semibold 
          py-2 px-5                {/* Reduced padding */}
          rounded-lg 
          hover:bg-blue-600/10        
          hover:border-blue-700     
          hover:text-blue-700          
          active:scale-95            
          transition-all              
          ease-in-out
          backdrop-blur-sm            
          hover:shadow-md
          text-sm md:text-base       {/* Added responsive text size */}
        "
      >
        Read More
      </Link>
    </div>
  </div>
</div>

  );
};

export default About;