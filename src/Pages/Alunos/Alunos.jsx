import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; 
import "./style.css";
import Nav from "../../Components/Nav/Nav";

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [curso, setCurso] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token de autenticação não encontrado.");
      return;
    }

    const fetchAlunos = async () => {
      try {
        const response = await axios.get(
          "https://centroeuropeuhomolog.belogic.com.br/api/student",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Resposta da API de alunos:", response.data);
        setAlunos(response.data.students.data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error.message);
      }
    };

    fetchAlunos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token de autenticação não encontrado.");
        return;
      }

      const response = await axios.post(
        "https://centroeuropeuhomolog.belogic.com.br/api/student",
        {
          name: nome,
          cpf: cpf,
          course: curso,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Aluno cadastrado com sucesso:", response.data);
      setMessage("Aluno cadastrado com sucesso!");

      setNome("");
      setCpf("");
      setCurso("");

      setTimeout(() => {
        setMessage("");
      }, 5000); 
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      setMessage(
        "Erro ao cadastrar aluno. Por favor, tente novamente."
      );

      setTimeout(() => {
        setMessage("");
      }, 5000); 
    }
  };

  const handleSubmitFile = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const formData = new FormData();
      formData.append("excel", file);

      const response = await axios.post(
        "https://centroeuropeuhomolog.belogic.com.br/api/student/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Resposta da importação de alunos:", response.data);
      setMessage("Importação realizada com sucesso!");


      setFile(null);


      setTimeout(() => {
        setMessage("");
      }, 5000); 
    } catch (error) {
      if (error.response) {
        console.error("Erro ao importar alunos:", error.response.data.message);
        setMessage(`Erro ao importar alunos: ${error.response.data.message}`);
      } else {
        console.error("Erro ao importar alunos:", error.message);
        setMessage(
          "Ocorreu um erro ao importar alunos. Por favor, tente novamente mais tarde."
        );
      }

      setTimeout(() => {
        setMessage("");
      }, 5000); 
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleExportToExcel = () => {
    const fileName = "lista_de_alunos.xlsx";
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const csvData = alunos.map(({ name, cpf, course }) => ({
      Nome: name,
      CPF: cpf,
      Curso: course || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  };

  return (
    <div>
      <Nav />
      <div className="alunos-main">
        <h1>Lista de Alunos</h1>
        <table className="tabela-alunos">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Curso</th>
            </tr>
          </thead>
          <tbody>
            {alunos.length > 0 ? (
              alunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td>{aluno.name}</td>
                  <td>{aluno.cpf}</td>
                  <td>{aluno.course || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Nenhum aluno encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="export-button-container">
          <button onClick={handleExportToExcel}>Exportar para Excel</button>
        </div>

        <div className="forms">
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
            <label>Selecione arquivo (.xlsx ou .csv)</label>
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

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Alunos;
