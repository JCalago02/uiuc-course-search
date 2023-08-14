import './Header.css';
import { Link } from 'react-router-dom';
function Header() {
    return (
        <div className="header-background-div">
            <section className="header-content">
                <Link className='header-link main-link' to="/">UIUC GenEd Finder</Link>
                <div className="right-align-links">
                    <Link className='header-link' to="about">About</Link>
                    <Link className='header-link' to="find-classes">Find Classes</Link>
                    <Link className='header-link' to="share">Share</Link>
                    <Link className='header-link' to="login">Login</Link>
                </div>
                
            </section>
        </div>
    )
}

export default Header


