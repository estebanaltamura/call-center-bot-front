// ** React
import React, { useState } from 'react';

// ** React Router
import { useNavigate } from 'react-router-dom';

// ** Components
import Typo from 'components/general/Typo';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Prompt de sistema', path: '/systemPrompt' },
  { label: 'Estado de situación', path: '/status' },
  { label: 'Chat', path: '/chat' },
];

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');
  const navigate = useNavigate();

  return (
    <aside
      className="bg-gray-700 text-white flex flex-col items-center"
      style={{ width: '200px', minWidth: '200px' }}
    >
      {/* Logo */}
      <div
        className="w-full text-center bg-gray-500 flex items-center justify-center gap-2"
        style={{ height: '58px', minHeight: '58px' }}
      >
        <Typo type="body3Semibold">AUTO CALL CENTER</Typo>
        <div className="w-[22px]">
          <img src="/favicon.webp" alt="" />
        </div>
      </div>

      {/* Items del menú */}
      {menuItems.map((item, index) => (
        <React.Fragment key={item.label}>
          <div
            className={`w-full text-center cursor-pointer flex items-center justify-center ${
              item.label === activeItem ? 'bg-orange-500 pointer-events-none' : 'hover:bg-gray-600'
            }`}
            style={{ height: '60px', lineHeight: '70px' }}
            onClick={() => {
              setActiveItem(item.label);
              navigate(item.path);
            }}
          >
            {item.label}
          </div>
          {index < menuItems.length && <div className="w-full h-[1px] bg-gray-500"></div>}
        </React.Fragment>
      ))}
      <div className="h-full"></div>
      <div
        className="w-full text-center cursor-pointer hover:bg-gray-600 flex items-center justify-center border-t border-t-gray-500"
        style={{ height: '60px', lineHeight: '70px' }}
      >
        Cerrar sesión
      </div>
    </aside>
  );
};

export default Sidebar;
