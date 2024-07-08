import React, { useState } from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";
import axios from "axios";

function Alunos() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [curso, setCurso] = useState("");
    const [file, setFile] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("Token de autenticação não encontrado.");
                // Tratar o erro, redirecionar para a página de login, etc.
                return;
            }

            const response = await axios.post(
                "https://centroeuropeuhomolog.belogic.com.br/api/student",
                {
                    name: nome,
                    cpf: cpf,
                    course: curso
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Aluno cadastrado com sucesso:", response.data);
            // Limpar campos após o cadastro
            setNome("");
            setCpf("");
            setCurso("");
        } catch (error) {
            console.error("Erro ao cadastrar aluno:", error);
            // Tratar erro (ex: exibir mensagem de erro para o usuário)
        }
    };

    const handleSubmitFile = async (event) => {
        event.preventDefault();
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                // Lidar com o caso em que não há token (usuário não autenticado)
                return;
            }
    
            const formData = new FormData();
            formData.append("excel", event.target.files[0]);
    
            const response = await axios.post("https://centroeuropeuhomolog.belogic.com.br/api/student/import", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
    
            console.log("Resposta da importação de alunos:", response.data);
    
            // Exibir mensagem de sucesso ou redirecionar após importação bem-sucedida
        } catch (error) {
            if (error.response) {
                console.error("Erro ao importar alunos:", error.response.data.message);
                // Exibir mensagem de erro para o usuário
                alert(`Erro ao importar alunos: ${error.response.data.message}`);
            } else {
                console.error("Erro ao importar alunos:", error.message);
                // Exibir mensagem de erro genérica para o usuário
                alert("Ocorreu um erro ao importar alunos. Por favor, tente novamente mais tarde.");
            }
        }
    };
    

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    return (
        <div>
            <Nav />
            <div className="alunos-main">
                <form className="form-alunos" onSubmit={handleSubmit}>
                    <h2 className="form-h2">Cadastrar alunos individualmente:</h2>
                    <label>Nome</label>
                    <input
                        name="nome"
                        id="nome"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                    <label>CPF</label>
                    <input
                        name="cpf"
                        id="cpf"
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        required
                    />
                    <label>Curso</label>
                    <input
                        name="curso"
                        id="curso"
                        type="text"
                        value={curso}
                        onChange={(e) => setCurso(e.target.value)}
                        required
                    />
                    <button type="submit">Adicionar aluno</button>
                </form>

                <form className="form-alunos" onSubmit={handleSubmitFile}>
                    <h2 className="form-h2">Cadastrar alunos em massa:</h2>
                    <label>Selecione arquivo (.xlsx)</label>
                    <input
                        className="file"
                        type="file"
                        id="foto"
                        name="foto"
                        accept=".xlsx, .csv"
                        onChange={handleFileChange}
                        required
                    />
                    <button type="submit">Adicionar alunos</button>
                </form>
            </div>
        </div>
    );
}

export default Alunos;
