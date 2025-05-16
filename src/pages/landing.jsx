import React, { use } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const router=useNavigate();
    return (
        <div className='landingPagecontainer'>
            <nav>
                <div className='navHeader'>
                    <h2>Apna video call</h2>
                </div>
                <div className='navlist'>
                    <p onClick={()=>{
                        router("/q23geu");
                    }}>Join as guest</p>
                    <Link to="/auth"><p>Register</p></Link>
                    <div role='button'>
                        <Link to="/auth"><p>Login</p></Link>
                    </div>
                </div>
            </nav>
            <div className="landingMaincontainer">
                <div>
                    <h1>
                        <span style={{ color: "#FF9839" }}>Connect</span> with your landing ones
                    </h1>
                    <p>Cover a distance by apna video call</p>
                    <div className="getStartedButton" role='button'>
                        <Link to='/home'>Get started</Link>
                    </div>
                </div>
                <div>
                    <img src='/Zoommeeting.png' alt='landingpage'></img>
                </div>
            </div>
        </div>
    )
}
