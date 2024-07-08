import React from "react";
import "./style.css";
import logo from  "../../Assets/logo.png";
import sair from "../../Assets/sair.png";
import { useNavigate } from "react-router-dom";

function Nav() {
    const navigate = useNavigate();

    const handleHome = () => {
        navigate("/AreaLogada");
    };

    const handleLogout = () => {
        // Limpar o token de autenticação (se estiver usando localStorage)
        localStorage.removeItem("token");

        // Redirecionar para a página de login (ou outra página após o logout)
        navigate("/"); // Substitua "/login" pelo caminho da sua página de login
    };

    return (
        <div className="nav-main">
            <img alt="" className="nav-logo" src={logo} onClick={handleHome} />
            <button className="nav-btn" onClick={handleLogout}>
                Logout <img className="sair-img" alt="" src={sair} />
            </button>
        </div>
    );
}

export default Nav;
