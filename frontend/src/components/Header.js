import './Header.css';
import userState from '../UserState';

const Header = (props) => {
    const loginOrSignout = () => {
        if (props.getState()) {
            return <li><a href="/signout">Signout</a></li>
        } else {
            return <li><a href="/login">Login</a></li>
        }
    }

    return (    
        <nav>
            <div className="space-1"></div>        
            <div>       
                <ul>
                    <li className="home-link"><a href="/home">Home</a></li>
                    { props.getState() && <li><a href="/upload">Upload</a></li> }
                    { props.getState() && <li><a href="/process">Process</a></li> }
                    { loginOrSignout() }
                </ul>
            </div>            
            <div className="break"></div>
        </nav>
    );
}

export default Header;