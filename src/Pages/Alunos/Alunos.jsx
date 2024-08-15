import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { FaTrash } from 'react-icons/fa';
import "./style.css";
import Nav from "../../Components/Nav/Nav";

// Função para capitalizar a primeira letra e deixar o resto em minúsculas
const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [curso, setCurso] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [isFetching, setIsFetching] = useState(false); // Estado para controlar o fetch
  const [searchNome, setSearchNome] = useState(""); // Estado para o filtro de nome
  const [searchCpf, setSearchCpf] = useState(""); // Estado para o filtro de CPF

  // Função para buscar alunos com base na página e filtro de nome
  const fetchAlunosByPage = async (page) => {
    if (isFetching) return; // Não faz fetch se já estiver buscando

    setIsFetching(true); // Define o estado de fetching como verdadeiro

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token de autenticação não encontrado.");
        return;
      }

      // Adiciona filtro de nome e paginação aos parâmetros da requisição
      const formattedNome = capitalizeFirstLetter(searchNome);
      const response = await axios.get(
        `https://centroeuropeuhomolog.belogic.com.br/api/student?page=${page}&name=${encodeURIComponent(formattedNome)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data, last_page } = response.data.students;
      setAlunos(data);
      setTotalPages(last_page || 1); // Atualiza o total de páginas com base na resposta
      console.log(`Fetched ${data.length} students from page ${page}`);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error.message);
    } finally {
      setIsFetching(false); // Define o estado de fetching como falso após a tentativa
    }
  };

  // Função para buscar alunos apenas por CPF
  const fetchAlunosByCpf = async () => {
    if (isFetching) return; // Não faz fetch se já estiver buscando
  
    setIsFetching(true); // Define o estado de fetching como verdadeiro
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token de autenticação não encontrado.");
        return;
      }
  
      // Adiciona filtro de CPF aos parâmetros da requisição
      const response = await axios.get(
        `https://centroeuropeuhomolog.belogic.com.br/api/student?cpf=${encodeURIComponent(searchCpf)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Resposta da API:", response.data); // Verifica a estrutura da resposta
  
      // Acesse a lista de alunos na estrutura correta
      const data = response.data.students.data || [];
      setAlunos(data);
      setTotalPages(response.data.students.last_page || 1); // Ajusta o total de páginas, mesmo que não seja usado na busca por CPF
      console.log(`Fetched ${data.length} students by CPF`);
    } catch (error) {
      console.error("Erro ao buscar alunos por CPF:", error.message);
    } finally {
      setIsFetching(false); // Define o estado de fetching como falso após a tentativa
    }
  };
  

  // Busca a página atual quando o componente é montado ou a página é alterada
  useEffect(() => {
    if (searchCpf) {
      fetchAlunosByCpf();
    } else {
      fetchAlunosByPage(currentPage);
    }
  }, [currentPage, searchNome, searchCpf]); // Adiciona searchNome e searchCpf às dependências

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token de autenticação não encontrado.");
        return;
      }

      await axios.post(
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

      console.log("Aluno cadastrado com sucesso!");
      setMessage("Aluno cadastrado com sucesso!");
      setNome("");
      setCpf("");
      setCurso("");
      setTimeout(() => {
        setMessage("");
      }, 1000);

      fetchAlunosByPage(currentPage); // Recarregar a lista na página atual
    } catch (error) {
      console.error("Erro ao cadastrar aluno:", error);
      setMessage("Erro ao cadastrar aluno. Por favor, tente novamente.");
      setTimeout(() => {
        setMessage("");
      }, 1000);
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

      await axios.post(
        "https://centroeuropeuhomolog.belogic.com.br/api/student/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Importação realizada com sucesso!");
      setMessage("Importação realizada com sucesso!");
      setFile(null);
      setTimeout(() => {
        setMessage("");
      }, 1000);

      fetchAlunosByPage(currentPage); // Recarregar a lista na página atual
    } catch (error) {
      if (error.response) {
        console.error("Erro ao importar alunos:", error.response.data.message);
        setMessage(`Erro ao importar alunos: ${error.response.data.message}`);
      } else {
        console.error("Erro ao importar alunos:", error.message);
        setMessage("Ocorreu um erro ao importar alunos. Por favor, tente novamente mais tarde.");
      }
      setTimeout(() => {
        setMessage("");
      }, 1000);
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Você tem certeza que deseja excluir este aluno?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token de autenticação não encontrado.");
        return;
      }

      await axios.delete(
        `https://centroeuropeuhomolog.belogic.com.br/api/student/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAlunosByPage(currentPage); // Recarregar a lista na página atual após exclusão
      setMessage("Aluno excluído com sucesso!");
      setTimeout(() => {
        setMessage("");
      }, 1000);
    } catch (error) {
      console.error("Erro ao excluir aluno:", error.message);
      setMessage("Erro ao excluir aluno. Por favor, tente novamente.");
      setTimeout(() => {
        setMessage("");
      }, 1000);
    }
  };

  return (
    <div>
      <Nav />
      <div className="alunos-main">
        <h1>Lista de Alunos</h1>

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
            <button type="submit">Cadastrar</button>
          </form>

          <form className="form-alunos" onSubmit={handleSubmitFile}>
            <h2 className="form-h2">Importar alunos via Excel:</h2>
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              required
            />
            <button type="submit">Importar</button>
          </form>
        </div>

        {message && <p className="message">{message}</p>}

        <div className="search-form-container">
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label>Buscar por Nome</label>
              <input
                type="text"
                value={searchNome}
                onChange={(e) => setSearchNome(e.target.value)}
                placeholder="Nome do aluno"
              />
            </div>
            <div>
              <label>Buscar por CPF (CPF completo)</label>
              <input
                type="text"
                value={searchCpf}
                onChange={(e) => setSearchCpf(e.target.value)}
                placeholder="CPF do aluno"
              />
            </div>
          </form>
        </div>

        <div className="alunos-list">
          <table className="tabela-produtos">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Curso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.length > 0 ? (
                alunos.map((aluno) => (
                  <tr key={aluno.id}>
                    <td>{aluno.name}</td>
                    <td>{aluno.cpf}</td>
                    <td>{aluno.course || "-"}</td>
                    <td>
                      <FaTrash onClick={() => handleDelete(aluno.id)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Nenhum aluno encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!searchCpf && ( // Apenas exibe a paginação se não estiver buscando por CPF
          <div className="pagination">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage((prev) => prev - 1);
                }
              }}
              disabled={currentPage === 1 || isFetching}
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage((prev) => prev + 1);
                }
              }}
              disabled={currentPage === totalPages || isFetching}
            >
              Próxima
            </button>
          </div>
        )}

        <button onClick={handleExportToExcel} className="export-btn">
          Exportar para Excel
        </button>
      </div>
    </div>
  );
}

export default Alunos;
