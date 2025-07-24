import { SiNike, SiPuma, SiNewbalance, SiReebok, SiUnderarmour, SiJordan } from "react-icons/si";
import { CgAdidas } from "react-icons/cg";
import { GiConverseShoe } from "react-icons/gi";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Brand = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
      delay: 100,
    });
  }, []);

  return (
    <div className="p-2 shadow mt-[40px]">
      <Link to={'/brandsPage'}>
        <div className="p-3 font-bold md:text-3xl md:block hidden">Explore our Brands</div>
        <div 
          data-aos="flip-up"
          data-aos-duration='200'
          className="md:text-9xl text-4xl pt-10 pb-10 flex flex-wrap gap-6 justify-center md:p-5 items-center"
        >
          <SiNike />
          <SiPuma />
          <SiNewbalance />
          <CgAdidas />
          <SiReebok />
          <GiConverseShoe />
          <SiUnderarmour />
          <SiJordan />
        </div>
      </Link>
    </div>
  );
};

export default Brand;
