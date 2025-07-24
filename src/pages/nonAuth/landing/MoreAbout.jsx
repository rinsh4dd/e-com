import R1 from '../../../assets/R1.svg'
import R2 from '../../../assets/r2.svg'
import R3 from '../../../assets/r3.svg'
import Rmain from '../../../assets/Rmain.jpg'

const Guarantee = () => {
  return (
    <div className="grid md:grid-cols-2 p-3">
     <div className='p-4 flex flex-col gap-5 font-thin text-stone-700 justify-center items-center' data-aos-duration="200" data-aos="fade-down">
     Eu eget felis erat mauris aliquam mattis lacus, arcu leo aliquam 
     sapien pulvinar laoreet vulputate sem aliquet phasellus egestas felis, 
     est, vulputate morbi massa mauris vestibulum dui odio.

     <div className='grid grid-cols-3 gap-10'> 
        <img src={R1} alt="" data-aos-duration="100" data-aos="flip-down"/>
        <img src={R2} alt="" data-aos-duration="200" data-aos="flip-down"/>
        <img src={R3} alt="" data-aos-duration="300" data-aos="flip-down"/>
     </div>
     </div>
     <div className='flex justify-center items-center'>
        <img src={Rmain} alt=""  className=' rounded-full p-2' data-aos-duration="400" data-aos="flip-down"/>
     </div>
    </div>
  )
}

export default Guarantee