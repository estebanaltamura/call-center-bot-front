// ** React
import React from 'react';

// ** Css config
import {
  layoutMaxWidth,
  menuBarHeight,
  paddingLayoutBottomDesktop,
  paddingLayoutBottomMobile,
  paddingLayoutLeftRightDesktop,
  paddingLayoutLeftRightMobile,
  paddingLayoutTopDesktop,
  paddingLayoutTopMobile,
} from 'globalConfig';

// ** Components
import Sidebar from './SideBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isDesktop = window.matchMedia(`(min-width: ${layoutMaxWidth}px)`).matches;

  const paddingTop = menuBarHeight + (isDesktop ? paddingLayoutTopDesktop : paddingLayoutTopMobile);
  const paddingLeftRight = isDesktop ? paddingLayoutLeftRightDesktop : paddingLayoutLeftRightMobile;
  const paddingBottom = isDesktop ? paddingLayoutBottomDesktop : paddingLayoutBottomMobile;

  return (
    <div
      className="mx-auto w-full h-screen max-h-screen flex"
      style={{
        maxWidth: `${layoutMaxWidth}px`,
        padding: `${paddingTop}px ${paddingLeftRight}px ${paddingBottom}px`,
      }}
    >
      <div className="flex border-2 border-gray rounded w-full min-w-full">
        {/* Barra lateral */}
        <Sidebar />

        {/* Contenido principal */}
        <div className="w-full h-full max-h-full">
          <main className="h-full">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
