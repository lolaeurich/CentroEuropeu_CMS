import React from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";
import produto from "../../Assets/produto.png";
import servico from "../../Assets/service.png";
import aluno from "../../Assets/aluno.png";
import banner from "../../Assets/banner.png";
import popup from "../../Assets/popup.png";
import parceiros from "../../Assets/parceiro.png";
import { useNavigate } from "react-router-dom";

function AreaLogada () {
    const navigate = useNavigate();

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
    return (
        <div>
        <Nav/>
        <div className="logada-main">
            <div className="logada-welcome">
                <h2>Olá, Ana!</h2>
                <h4>O que você deseja fazer hoje?</h4>
            </div> 
        </div>
        <div className="logada-options">
                <div className="opt-cadastrar-prod">
                    <img className="icon" alt="" src={produto}/>
                    <h2 className="options-h2">Cadastrar Produtos</h2>
                    <hr/>
                    <p className="options-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Ut lacinia, quam eu accumsan faucibus, nisl elit finibus erat,
                        ut dignissim metus lectus vel est. </p>
                    <p className="options-btn">Acesse <span className="options-span" onClick={handleProd}>‎ {`>`} ‎</span></p>    
                </div>
                <div className="opt-cadastrar-serv">
                <img className="icon" alt="" src={servico}/>
                    <h2 className="options-h2">Cadastrar Serviços</h2>
                    <hr/>
                    <p className="options-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Ut lacinia, quam eu accumsan faucibus, nisl elit finibus erat,
                        ut dignissim metus lectus vel est. </p>
                    <p className="options-btn">Acesse <span className="options-span" onClick={handleServ}>‎ {`>`} ‎</span></p>    
                </div>
                <div className="opt-cadastrar-aluno">
                <img className="icon" alt="" src={aluno}/>
                    <h2 className="options-h2">Cadastrar Alunos</h2>
                    <hr/>
                    <p className="options-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Ut lacinia, quam eu accumsan faucibus, nisl elit finibus erat,
                        ut dignissim metus lectus vel est. </p>
                    <p className="options-btn">Acesse <span className="options-span" onClick={handleAlunos}>‎ {`>`} ‎</span></p>    
                </div>
                <div className="opt-alterar-banner">
                <img className="icon" alt="" src={banner}/>
                    <h2 className="options-h2">Alterar Banner</h2>
                    <hr/>
                    <p className="options-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Ut lacinia, quam eu accumsan faucibus, nisl elit finibus erat,
                        ut dignissim metus lectus vel est. </p>
                    <p className="options-btn">Acesse <span className="options-span" onClick={handleBanner}>‎ {`>`} ‎</span></p>    
                </div>
                <div className="opt-alterar-popup">
                <img className="icon" alt="" src={popup}/>
                    <h2 className="options-h2">Alterar PopUp</h2>
                    <hr/>
                    <p className="options-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Ut lacinia, quam eu accumsan faucibus, nisl elit finibus erat,
                        ut dignissim metus lectus vel est. </p>
                    <p className="options-btn">Acesse <span className="options-span" onClick={handlePop}>‎ {`>`} ‎</span></p>    
                </div>
                <div className="opt-listar-parceiros">
                <img className="icon" alt="" src={parceiros}/>
                    <h2 className="options-h2">Listar Parceiros</h2>
                    <hr/>
                    <p className="options-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Ut lacinia, quam eu accumsan faucibus, nisl elit finibus erat,
                        ut dignissim metus lectus vel est. </p>
                    <p className="options-btn">Acesse <span className="options-span" onClick={handleParceiros}>‎ {`>`} ‎</span></p>    
                </div>
            </div>   
        </div>
    )
}

export default AreaLogada;