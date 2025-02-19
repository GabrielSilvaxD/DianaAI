import { Link, Outlet } from 'react-router-dom';
import './RootLayout.css';

const RootLayout = () => {
  return (
    <div className='rootLayout'>
    <header>
        <Link to="/">
        <img src="/logo.png" alt=""/>
        <span>DIANA AI</span>
        </Link>
    </header>
    <main>
        <Outlet/>
    </main>
    </div>
   );
 };

export default RootLayout
