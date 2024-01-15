import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ImageHero from '../public/images/hero.jpg'

const Home = () => {
  return (
    <div className='w-full h-full relative pt-24'>
      <div className='fixed top-0 z-50 w-full bg-[#FCF5EB]/50 backdrop-blur-[2px] border-b-2 border-gray-300'>
        <div className='container mx-auto h-full'>
          <nav className='mx-auto w-full h-full lg:py-3 lg:flex lg:justify-between'>
            <h1 className='w-1/3 font-semibold text-2xl my-auto'>SOSMET</h1>
            <div className='w-2/3 lg:flex lg:justify-between my-auto h-full'>
              <div className='w-full lg:flex lg:gap-8 my-auto'>
                <div>Produk</div>
                <div>Tentang</div>
                <div>Langganan</div>
              </div>
              <Link href="/chat" className='py-2 px-9 bg-[#25D366] border-[1px] border-slate-600 text-[#FCF5EB] rounded-3xl'>Login</Link>
            </div>
          </nav>
        </div>
      </div>
      <div className='container mx-auto'>
        <div className='w-full h-[40rem] overflow-hidden rounded-3xl relative'>
          <div className='absolute z-10 top-28 left-28 w-96'>
            <h1 className='mb-8 text-[#FCF5EB] text-[5.6rem] leading-none'>Berkirim pesan secara pribadi.</h1>
            <button className='max-w-max py-3 px-9 bg-[#25D366] border-2 border-slate-800 text-[#FCF5EB] rounded-full text-xl'>Login Sekarang</button>
          </div>
          <Image src={ImageHero} alt='Image Hero' sizes='100vw' className='relative top-[-10rem]'/>
        </div>
      </div>
    </div>
  )
}

export default Home