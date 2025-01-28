// ** React
import React, { useEffect, useState } from 'react';

// ** React Router
import { useLocation, useNavigate } from 'react-router-dom';

// ** Components
import Typo from 'components/general/Typo';

// ** React Icons
import {
  FaTachometerAlt,
  FaComments,
  FaChartBar,
  FaBuilding,
  FaRobot,
  FaBook,
  FaCogs,
  FaHatWizard,
} from 'react-icons/fa';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
  { label: 'Chat', path: '/chat', icon: <FaComments /> },
  { label: 'Estado de situación', path: '/status', icon: <FaChartBar /> },
  { label: 'Negocios', path: '/businesses', icon: <FaBuilding /> },
  { label: 'Asistentes', path: '/assistants', icon: <FaRobot /> },
  { label: 'Conocimientos', path: '/knowledges', icon: <FaBook /> },
  { label: 'Reglas', path: '/rules', icon: <FaCogs /> },
  { label: 'Sombreros', path: '/hats', icon: <FaHatWizard /> },
];

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState<string>('Dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Obtener la primera parte del path después de la barra
    const currentPath = location.pathname.split('/')[1];

    // Buscar el elemento del menú que coincide con el path actual
    const matchedItem = menuItems.find((item) => item.path.includes(`/${currentPath}`));

    if (matchedItem) {
      setActiveItem(matchedItem.label);
    }
  }, [location.pathname]); // Ejecutar cada vez que el path cambie
  return (
    <aside
      className="bg-gray-700 text-white flex flex-col items-center"
      style={{ width: '210px', minWidth: '210px' }}
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
            className={`w-full text-center cursor-pointer flex items-center px-3 gap-2 ${
              item.label === activeItem ? 'bg-orange-500 pointer-events-none' : 'hover:bg-gray-600'
            }`}
            style={{ height: '50px', maxHeight: '50px', minHeight: '50px', lineHeight: '70px' }}
            onClick={() => {
              setActiveItem(item.label);
              navigate(item.path);
            }}
          >
            <div className="text-xl">{item.icon}</div>
            <Typo type="body2">{item.label}</Typo>
          </div>
          {index < menuItems.length && <div className="w-full h-[1px] bg-gray-500"></div>}
        </React.Fragment>
      ))}

      <div className="h-full"></div>
      <div
        className="w-full text-center cursor-pointer hover:bg-gray-600 flex items-center justify-center border-t border-t-gray-100"
        style={{ height: '60px', lineHeight: '70px', color: 'red' }}
      >
        Cerrar sesión
      </div>
    </aside>
  );
};

export default Sidebar;
