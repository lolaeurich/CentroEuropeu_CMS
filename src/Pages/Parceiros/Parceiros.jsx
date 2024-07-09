import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./style.css";
import Nav from "../../Components/Nav/Nav";

function Parceiros() {
  const [parceiros, setParceiros] = useState([]);
  
  useEffect(() => {
    const tokenJWT = localStorage.getItem('token');

    const fetchParceiros = async () => {
      try {
        const response = await axios.get('https://centroeuropeuhomolog.belogic.com.br/api/partner', {
          headers: {
            'Authorization': `Bearer ${tokenJWT}`
          }
        });
        setParceiros(response.data.partners.data);
      } catch (error) {
        console.error('Erro ao buscar parceiros:', error.message);
        // Tratar o erro de autorização aqui
      }
    };

    if (tokenJWT) {
      fetchParceiros();
    } else {
      console.error('Token JWT não encontrado.');
      // Lógica para redirecionar para a página de login ou tratar o erro de autenticação
    }
  }, []);

  return (
    <div>
      <Nav />
      <div className="parceiros-main">
        <h1>Lista de Parceiros</h1>
        <table className="tabela-parceiros">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Contato</th>
              <th>Área de Ocupação</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(parceiros) && parceiros.length > 0 ? (
              parceiros.map(parceiro => (
                <tr key={parceiro.id}>
                  <td>{parceiro.name}</td>
                  <td>{parceiro.email}</td>
                  <td>{parceiro.phone}</td>
                  <td>{parceiro.address}</td>
                  <td>{parceiro.contact_name}</td>
                  <td>{parceiro.occupation_area}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Nenhum parceiro encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Parceiros;
