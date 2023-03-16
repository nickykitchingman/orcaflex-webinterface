import './Header.css';
import userState from '../UserState';

const Header = (props) => {
    const loginOrSignout = () => {
        if (props.signedIn()) {
            return <li><a href="/signout">Signout</a></li>;
        } else {
            return <li><a href="/login">Login</a></li>;
        }
    }

    const upload = () => {
        return props.signedIn() && <li><a href="/upload">Upload</a></li>;
    }

    const process = () => {
        return props.signedIn() && <li><a href="/process">Process</a></li>;
    }

    return (    
        <nav>
            <div className="space-1"></div>        
            <div>       
                <ul>
                    <li className="home-link"><a href="/home">Home</a></li>
                    { upload() }
                    { process() }
                    { loginOrSignout() }
                    { !props.signedIn() && <li><a href="/signup">Signup</a></li> }
                </ul>
            </div>            
            <div className="break"></div>
        </nav>
    );
}

export default Header;