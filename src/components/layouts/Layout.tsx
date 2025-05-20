import { FC, ReactNode } from 'react';
import Header from '../Header';
import Footer from '../Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="mx-auto w-full">
        <Header />
        <div className="h-[72px]"></div>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;