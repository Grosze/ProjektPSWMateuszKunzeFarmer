import { Link } from 'react-router-dom';


function Navigation() {
    return (
        <nav>
            <ul>
                <Link to='/' >
                    <li>GAMES LIST</li>
                </Link>
                <Link to='/Game' >
                    <li>GAME</li>
                </Link>
                <Link to='/DirectChat' >
                    <li>DIRECT CHAT</li>
                </Link>
            </ul>
        </nav>
    )
};

export default Navigation;