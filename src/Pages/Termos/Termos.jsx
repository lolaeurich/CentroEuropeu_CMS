import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../../Components/Nav/Nav";
import "./style.css";

function Termos() {
  const [lgpdDescription, setLgpdDescription] = useState("");
  const [privacyPolicyDescription, setPrivacyPolicyDescription] = useState("");
  const [termsOfUseDescription, setTermsOfUseDescription] = useState("");

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await axios.get(
        "https://centroeuropeuhomolog.belogic.com.br/api/term-conditions"
      );
      response.data.term.forEach(term => {
        switch (term.name) {
          case 'LGPD':
            setLgpdDescription(term.description);
            break;
          case 'Política de privacidade':
            setPrivacyPolicyDescription(term.description);
            break;
          case 'Termos de Uso':
            setTermsOfUseDescription(term.description);
            break;
          default:
            break;
        }
      });
    } catch (error) {
      console.error("Erro ao buscar termos:", error);
    }
  };

  const handleUpdate = async (termId, nameToUpdate, descriptionToUpdate) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const endpoint = `https://centroeuropeuhomolog.belogic.com.br/api/term-conditions/${termId}`;

      const response = await axios.put(
        endpoint,
        {
          name: nameToUpdate,
          description: descriptionToUpdate,
          _method: "PUT", 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Resposta da API:", response.data);

      alert(`Termo atualizado com sucesso: ${response.data.term.name}`);


      fetchTerms();
    } catch (error) {
      console.error("Erro ao atualizar termo:", error);

      if (error.response) {
        console.error("Detalhes do erro:", error.response.data);
        alert(`Erro ao atualizar termo: ${error.response.data.message}`);
      } else {
        alert(
          "Ocorreu um erro ao atualizar o termo. Por favor, tente novamente mais tarde."
        );
      }
    }
  };

  return (
    <div>
      <Nav />
      <div className="termos-main">
        <form className="form-termos">
          <h2>Alterar termos do site:</h2>

          <label>Alterar LGPD:</label>
          <textarea
            name="lgpdDescription"
            id="lgpdDescription"
            type="text"
            value={lgpdDescription}
            onChange={(e) => setLgpdDescription(e.target.value)}
          />
          <button
            type="button"
            onClick={() => handleUpdate(1, "LGPD", lgpdDescription)}
          >
            Salvar LGPD
          </button>

          <label>Alterar Políticas de Privacidade:</label>
          <textarea
            name="privacyPolicyDescription"
            id="privacyPolicyDescription"
            type="text"
            value={privacyPolicyDescription}
            onChange={(e) => setPrivacyPolicyDescription(e.target.value)}
          />
          <button
            type="button"
            onClick={() =>
              handleUpdate(2, "Política de privacidade", privacyPolicyDescription)
            }
          >
            Salvar Políticas de Privacidade
          </button>

          <label>Alterar Termos de Uso:</label>
          <textarea
            name="termsOfUseDescription"
            id="termsOfUseDescription"
            type="text"
            value={termsOfUseDescription}
            onChange={(e) => setTermsOfUseDescription(e.target.value)}
          />
          <button
            type="button"
            onClick={() => handleUpdate(3, "Termos de Uso", termsOfUseDescription)}
          >
            Salvar Termos de Uso
          </button>
        </form>
      </div>
    </div>
  );
}

export default Termos;
