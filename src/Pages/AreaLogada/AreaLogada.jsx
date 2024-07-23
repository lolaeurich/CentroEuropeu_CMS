import React, { useState, useEffect } from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";
import produto from "../../Assets/produto.png";
import servico from "../../Assets/service.png";
import aluno from "../../Assets/aluno.png";
import banner from "../../Assets/banner.png";
import popup from "../../Assets/popup.png";
import parceiros from "../../Assets/parceiro.png";
import categorias from "../../Assets/category.png";
import termos from "../../Assets/termos.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AreaLogada() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/"); 
                    return;
                }

                const response = await axios.get("https://centroeuropeuhomolog.belogic.com.br/api/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const { name } = response.data; 
                setUserName(name);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
          
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleProd = () => {
        navigate("/Produtos");
    };

    const handleServ = () => {
        navigate("/Servicos");
    };

    const handleAlunos = () => {
        navigate("/Alunos");
    };

    const handleBanner = () => {
        navigate("/Banner");
    };

    const handlePop = () => {
        navigate("/PopUp");
    };

    const handleParceiros = () => {
        navigate("/Parceiros");
    };

    const handleCategorias = () => {
        navigate("/Categorias");
    };

    const handleTermos = () => {
        navigate("/Termos");
    };

    return (
        <div>
            <Nav />
            <div className="logada-main">
                <div className="logada-welcome">
                    <h2>Olá, {userName}!</h2>
                    <h4>O que você deseja fazer hoje?</h4>
                </div>
            </div>
            <div className="logada-options">
                <div className="opt-cadastrar-prod">
                    <img className="icon" alt="" src={produto} />
                    <h2 className="options-h2">Cadastrar Produtos</h2>
                    <hr />
                    <p className="options-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut lacinia, quam eu accumsan faucibus, nisl elit finibus erat, ut dignissim metus lectus vel est. </p>
                    <p className="options-btn">Acesse <span className="options-span" onClick={handleProd}>‎ {`>`} ‎</span></p>
                </div>
                <div className="opt-cadastrar-serv">
                    <img className="icon" alt="" src={servico} />
                    <h2 className="options-h2">Cadastrar Serviços</h2>
                    <hr />
                    <p className="options-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut lacinia, quam eu accumsan faucibus, nisl elit finibus erat, ut dignissim metus lectus vel est. </p>
                    <p className="options-btn">Acesse <span className="options-span" onClick={handleServ}>‎ {`>`} ‎</span></p>
                </div>
                <div className="opt-cadastrar-categorias">
                    <img className="icon" alt="" src={categorias} />
                    <h2 className="options-h2">Cadastrar Categorias e Subcategorias</h2>
                    <hr />
                    <p className="options-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut lacinia, quam eu accumsan faucibus, nisl elit finibus erat, ut dignissim metus lectus vel est. </p>
                    <p className="options-btn">Acesse <span className="options-span" onClick={handleCategorias}>‎ {`>`} ‎</span></p>
                </div>
                <div className="opt-cadastrar-aluno">
                    <img className="icon" alt="" src={aluno} />
                    <h2 className="options-h2">Cadastrar Alunos</h2>
                    <hr />
                    <p className="options-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut lacinia, quam eu accumsan faucibus, nisl elit finibus erat, ut dignissim metus lectus vel est. </p>
                    <p className="options-btn">Acesse <span className="options-span" onClick={handleAlunos}>‎ {`>`} ‎</span></p>
                </div>
                <div className="opt-alterar-banner">
                    <img className="icon" alt="" src={banner} />
                    <h2 className="options-h2">Alterar Banner</h2>
                    <hr />
                    <p className="options-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut lacinia, quam eu accumsan faucibus, nisl elit finibus erat, ut dignissim metus lectus vel est. </p>
                    <p className="options-btn">Acesse <span className="options-span" onClick={handleBanner}>‎ {`>`} ‎</span></p>
                </div>
                <div className="opt-alterar-popup">
                    <img className="icon" alt="" src={popup} />
                    <h2 className="options-h2">Alterar PopUp</h2>
                    <hr />
                    <p className="options-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut lacinia, quam eu accumsan faucibus, nisl elit finibus erat, ut dignissim metus lectus vel est. </p>
                    <p className="options-btn">Acesse <span className="options-span" onClick={handlePop}>‎ {`>`} ‎</span></p>
                </div>
                <div className="opt-listar-parceiros">
                    <img className="icon" alt="" src={parceiros} />
                    <h2 className="options-h2">Listar Parceiros</h2>
                    <hr />
                    <p className="options-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut lacinia, quam eu accumsan faucibus, nisl elit finibus erat, ut dignissim metus lectus vel est. </p>
                    <p className="options-btn">Acesse <span className="options-span" onClick={handleParceiros}>‎ {`>`} ‎</span></p>
                </div>
                <div className="opt-listar-parceiros">
                    <img className="icon" alt="" src={termos} />
                    <h2 className="options-h2">Atualizar termos</h2>
                    <hr />
                    <p className="options-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut lacinia, quam eu accumsan faucibus, nisl elit finibus erat, ut dignissim metus lectus vel est. </p>
                    <p className="options-btn">Acesse <span className="options-span" onClick={handleTermos}>‎ {`>`} ‎</span></p>
                </div>
            </div>
        </div>
    );
}

export default AreaLogada;
