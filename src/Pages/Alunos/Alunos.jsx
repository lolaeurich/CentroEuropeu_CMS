import React from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";

function Alunos () {
    return (
        <div>
            <Nav />
            <div className="alunos-main">
                <form className="form-alunos">
                    <h2 className="form-h2">Cadastrar alunos individualmente:</h2>
                    <label>Nome</label>
                    <input name="nome" id="nome" type="text"></input>
                    <label>CPF</label>
                    <input name="cpf" id="cpf" type="number"></input>
                    <button>Adicionar aluno</button>
                </form>

                <form className="form-alunos">
                    <h2 className="form-h2">Cadastrar alunos em massa:</h2>
                    <label>Selecione arquivo</label>
                    <input className="file" type="file" id="foto" name="foto" accept="image/png, image/jpeg" />
                    <button>Adicionar alunos</button>
                </form>
            </div>
        </div>
    )
}

export default Alunos;