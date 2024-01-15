import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ImageHero from '../public/images/hero.jpg'

const Home = () => {
  return (
    <div className='w-full h-full relative pt-24'>
      <div className='fixed top-0 z-50 w-full bg-[#FCF5EB]/50 backdrop-blur-[2px] border-b-2 border-gray-300'>
        <div className='container mx-auto h-full'>
          <nav className='mx-auto w-full h-full py-4 px-4 lg:px-0 flex flex-col lg:flex-row gap-2 lg:justify-between'>
            <h1 className='w-full lg:w-1/3 font-semibold text-2xl my-auto text-center lg:text-left'>SOSMET</h1>
            <div className='w-full lg:w-2/3 flex flex-col lg:flex-row gap-4 lg:gap-0 lg:justify-between my-auto h-full text-center '>
              <div className='w-full flex justify-center lg:justify-start gap-8 my-auto'>
                <div>Produk</div>
                <div>Tentang</div>
                <div>Langganan</div>
              </div>
              <Link href="/chat" className='py-2 px-12 lg:px-9 max-w-max bg-[#25D366] border-[1px] border-slate-600 text-[#FCF5EB] rounded-3xl mx-auto'>Login</Link>
            </div>
          </nav>
        </div>
      </div>
      <div className='container mx-auto px-4'>
        <div className='w-full h-[80vh] lg:h-[40rem] top-[5rem] lg:top-0 overflow-hidden rounded-3xl relative'>
          <div className='absolute z-10 top-24 left-20 lg:top-28 lg:left-28 w-64 lg:w-96'>
            <h1 className='mb-8 text-[#FCF5EB] text-[3.7rem] lg:text-[5.6rem] leading-none'>Berkirim pesan secara pribadi.</h1>
            <button className='max-w-max py-3 px-9 bg-[#25D366] border-2 border-slate-800 text-[#FCF5EB] rounded-full text-xl'>Login Sekarang</button>
          </div>
          <Image src={ImageHero} alt='Image Hero' sizes='100vw' className='relative lg:top-[-10rem] h-full object-cover'/>
        </div>
      </div>
    </div>
  )
}

export default Home