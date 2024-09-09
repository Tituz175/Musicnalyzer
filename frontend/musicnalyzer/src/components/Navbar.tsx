import Link from "next/link";

export default function NavBar() {
  return (
    <>
      <nav className='bg-secondary font-secondary flex align-middle justify-start h-20 px-20 text-2xl font-semibold'>
        <div className='navbar-brand flex items-center w-2/4'>
          <Link href='/' className='text-4xl font-extrabold'>
            Musicalyzer
          </Link>
        </div>
        <div className="flex items-center justify-center w-2/4">
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
            <button className='bg-accent text-white px-6 py-2.5 rounded-lg font-bold'>
              Analyze
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
