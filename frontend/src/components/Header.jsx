import React from 'react';
import { Users, Settings } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <img src={"/Dslush.webp"} className='h-fit w-[100px]'/>
          </div>

          
          {/* <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Dashboard
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Analytics
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Settings
            </a>
          </nav> */}

          {/* Action Buttons */}
          {/* <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Users className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Settings className="h-5 w-5" />
            </button>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Header; 