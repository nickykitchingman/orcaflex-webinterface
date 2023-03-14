import './Header.css';

const Header = () => {
    return (    
        <nav>
            <div className="space-1"></div>        
            <div>       
                <ul>
                    <li className="home-link"><a href="/home"> Home </a></li>
                    <li><a href="/upload"> Upload </a></li>
                    <li><a href="/process"> Process </a></li>
                    <li><a href="/login"> Login </a></li>
                </ul>
            </div>            
            <div className="break"></div>
        </nav>
    );
}

export default Header;