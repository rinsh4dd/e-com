import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
function Aos() {
  return  useEffect(() => {
    AOS.init({
      duration: 1000,  // Animation duration in ms
      once: true,      // Whether animation should happen only once
    });
  }, []);
}

export default Aos
