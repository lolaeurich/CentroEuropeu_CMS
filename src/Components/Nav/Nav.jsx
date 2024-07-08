import React from "react";
import "./style.css";
import logo from  "../../Assets/logo.png";
import sair from "../../Assets/sair.png";
import { useNavigate } from "react-router-dom";

function Nav () {
    const navigate = useNavigate();

    const handleHome = () => {
        navigate("/AreaLogada");
    };

    return (
        <div className="nav-main">
            <img alt="" className="nav-logo" src={logo} onClick={handleHome}/>
            <button className="nav-btn">Logout <img className="sair-img" alt="" src={sair}/></button>
        </div>
    )
}

export default Nav;