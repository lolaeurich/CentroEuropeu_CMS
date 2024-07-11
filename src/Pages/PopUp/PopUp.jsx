import React, { useState } from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";
import axios from "axios";

function PopUp() {
    const [name, setName] = useState("");
    const [discount, setDiscount] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Recuperar o token do localStorage
        const token = localStorage.getItem("token");

        // Verifica os valores antes do envio
        console.log("Name:", name);
        console.log("Discount:", discount);
        console.log("Description:", description);

        try {
            const response = await axios.post(
                "https://centroeuropeuhomolog.belogic.com.br/api/coupom",
                {
                    name,
                    discount,
                    description
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Response:", response);

            if (response.status === 200 && response.data && response.data.coupom) {
                const { coupom } = response.data;
                setMessage(`Cupom ${coupom.name} cadastrado com sucesso!`);
                // Limpar os campos após o cadastro
                setName("");
                setDiscount("");
                setDescription("");
            } else {
                console.error("Resposta inválida do servidor:", response);
                setMessage("Erro ao cadastrar cupom. Resposta inválida do servidor.");
            }
        } catch (error) {
            console.error("Erro ao cadastrar cupom:", error);
            setMessage("Erro ao cadastrar cupom. Por favor, tente novamente.");
        }
    };

    return (
        <div>
            <Nav />
            <div className="cupom-main">
                <form className="form-banner-cupom" onSubmit={handleSubmit}>
                    <h2 className="form-h2">Alterar cupom de desconto:</h2>
                    <label>Nome do cupom:</label>
                    <input
                        className="cupom"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label>Desconto <span style={{color: "gray"}}>(não é necessário inserir "%")</span>:</label>
                    <input
                        className="desconto"
                        type="text"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        required
                    />
                    <label>Descrição:</label>
                    <input
                        className="descricao"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <button type="submit">Adicionar cupom</button>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default PopUp;
