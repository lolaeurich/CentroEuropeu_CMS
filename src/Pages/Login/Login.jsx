import React from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/logo.png";

function Login () {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Aqui você pode adicionar lógica de autenticação, se necessário
        // Após autenticar, redireciona para a página desejada
        navigate("/AreaLogada");
    };

    return (
        <div className="login-main">
            <div className="login-container">
                <img alt="" className="login-img" src={logo}/>
                <form className="login-form">
                    <label>
                        Login:
                    </label>
                    <input type="text" name="login" />
                    <label>
                        Senha:
                    </label>
                    <input type="password" name="senha" />
                </form>
                <button className="login-entrar" onClick={handleLogin}>Entrar</button>
            </div>
        </div>
    )
}

export default Login;