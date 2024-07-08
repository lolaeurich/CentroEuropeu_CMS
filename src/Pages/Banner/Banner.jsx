import React, { useState } from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";
import axios from "axios";

function Banner() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            alert("Selecione um arquivo de imagem!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("bannerImg", selectedFile);

            const token = localStorage.getItem("token"); // Obter token de autenticação do localStorage

            if (!token) {
                throw new Error("Token de autenticação não encontrado.");
            }

            const response = await axios.post(
                "https://centroeuropeuhomolog.belogic.com.br/api/banner",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Resposta da API:", response.data);

            setUploadStatus("Imagem do banner alterada com sucesso!");
        } catch (error) {
            console.error("Erro ao enviar imagem do banner:", error);
            setUploadStatus("Erro ao enviar imagem do banner. Tente novamente mais tarde.");
        }
    };

    return (
        <div>
            <Nav />
            <div className="banner-main">
                <form className="form-banner" onSubmit={handleSubmit}>
                    <h2 className="form-h2">Alterar imagem do banner:</h2>
                    <label>Selecione arquivo</label>
                    <input
                        className="file"
                        type="file"
                        id="foto"
                        name="foto"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                    />
                    <button type="submit">Adicionar imagem</button>
                </form>
                {uploadStatus && <p>{uploadStatus}</p>}
            </div>
        </div>
    );
}

export default Banner;
