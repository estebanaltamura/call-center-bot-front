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
      className="mx-auto w-full min-h-screen"
      style={{
        maxWidth: `${layoutMaxWidth}px`,
        padding: `${paddingTop}px ${paddingLeftRight}px ${paddingBottom}px`,
      }}
    >
      {children}
    </div>
  );
};

export default Layout;
