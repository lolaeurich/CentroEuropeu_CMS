import React, { useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../Assets/logo.png";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault(); // Evita o recarregamento da página

        try {
            const response = await axios.post("https://centroeuropeuhomolog.belogic.com.br/api/auth/login", {
                email,
                password
            });

            const { token } = response.data;
            localStorage.setItem("token", token);

            // Redirecionar para a página de Área Logada após o login
            navigate("/AreaLogada");
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            // Tratar erro (ex: exibir mensagem para usuário)
        }
    };

    return (
        <div className="login-main">
            <div className="login-container">
                <img alt="" className="login-img" src={logo} />
                <form className="login-form" onSubmit={handleLogin}>
                    <label>
                        Login:
                    </label>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>
                        Senha:
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="login-entrar">Entrar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
