import './Header.css';

const Header = () => {
    return (    
        <nav>
            <br/>            
            <div>       
                <ul>
                    <li><a href="/home"> Home </a></li>
                    <li><a href="/upload"> Upload </a></li>
                    <li><a href="/process"> Process </a></li>
                </ul>
            </div>            
            <div className="break"></div>
        </nav>
    );
}

export default Header;