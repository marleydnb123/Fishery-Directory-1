import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Fish, 
  Home, 
  Map, 
  Droplets, 
  Home as HomeIcon, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X,
  
  ShoppingBag
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/admin', icon: <Home size={20} /> },
    { name: 'Fisheries', path: '/admin/fisheries', icon: <Map size={20} /> },
    { name: 'Lakes', path: '/admin/lakes', icon: <Droplets size={20} /> },
    { name: 'Accommodation', path: '/admin/accommodation', icon: <HomeIcon size={20} /> },
    { name: 'Tackle Shops', path: '/admin/tackle-shops', icon: <ShoppingBag size={20} /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare size={20} /> },
  ];

  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
    // eslint-disable-next-line
  }, [location.pathname]);

  // Close sidebar on outside click (mobile)
  useEffect(() => {
    if (!isSidebarOpen) return;
    function handleClick(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setIsSidebarOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-primary-900 text-white"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden" />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed lg:relative inset-y-0 left-0 w-64 bg-customBlue text-white z-50
          transform transition-transform duration-300 ease-in-out min-h-screen
          flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        style={{ maxWidth: '100vw' }}
      >
        {/* Home Button */}
        <div className="mt-4 px-4">
          <Link
            to="/"
            className="flex items-center px-4 py-3 rounded-lg bg-primary-800 text-white hover:bg-primary-700 transition-colors"
            tabIndex={isSidebarOpen || window.innerWidth >= 1024 ? 0 : -1}
          >
            <HomeIcon size={20} />
            <span className="ml-3 font-semibold">Home</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 flex-grow">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-100 hover:bg-primary-800 hover:text-white'
                  }`}
                  tabIndex={isSidebarOpen || window.innerWidth >= 1024 ? 0 : -1}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-primary-800">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-3 text-primary-100 hover:bg-primary-800 hover:text-white rounded-lg transition-colors"
            tabIndex={isSidebarOpen || window.innerWidth >= 1024 ? 0 : -1}
          >
            <LogOut size={20} />
            <span className="ml-3">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`
          flex-1 flex flex-col overflow-hidden
          transition-all duration-300
          ${isSidebarOpen ? 'pointer-events-none select-none' : ''}
        `}
      >
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;