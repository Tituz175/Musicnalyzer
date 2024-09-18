"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavBar() {

  const router = useRouter();

  return (
    <>
      <nav className='bg-secondary font-secondary flex items-center justify-start h-20 px-4 sm:px-8 md:px-16 lg:px-60 text-2xl font-semibold sticky top-0 z-30'>
        <div className='navbar-brand flex items-center w-2/4'>
          <Link href='/' className='text-4xl font-extrabold'>
            Musicalyzer
          </Link>
        </div>
        <div className='flex items-center justify-center w-2/4'>
          <ul className='navbar-nav flex justify-between w-3/4'>
            <li className='nav-item'>
              <Link href='/' className='nav-link'>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='/about' className='nav-link'>
                About
              </Link>
            </li>
            <li className='nav-item'>
              <Link href='/faq' className='nav-link'>
                FAQ
              </Link>
            </li>
          </ul>
          <div className='navbar-actions w-1/4 flex justify-end'>
              <button onClick={()=>{
                router.push('/upload');
              }} className='bg-foreground text-white px-6 py-2.5 rounded-lg font-bold hover:bg-accent transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1'>
                Analyze
              </button>
          </div>
        </div>
      </nav>
    </>
  );
}
