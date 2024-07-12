import React, { useState, useEffect } from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";
import axios from "axios";

function AddCategoria() {
    const [categorias, setCategorias] = useState([]);
    const [nomeCategoria, setNomeCategoria] = useState("");
    const [categoriaExcluir, setCategoriaExcluir] = useState("");
    const [isDestaque, setIsDestaque] = useState(false);
    const [detachType, setDetachType] = useState("");
    const [showDetachType, setShowDetachType] = useState(false);

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://centroeuropeuhomolog.belogic.com.br/api/category", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCategorias(response.data.categories);
        } catch (error) {
            console.error("Erro ao obter categorias:", error);
        }
    };

    const handleSubmitAdicionar = async (event) => {
        event.preventDefault();
        
        try {
            const token = localStorage.getItem("token");
            const payload = {
                name: nomeCategoria,
                detach: isDestaque ? 1 : 0,
                detach_type: isDestaque ? detachType : null
            };

            await axios.post("https://centroeuropeuhomolog.belogic.com.br/api/category", payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Após adicionar, atualizar a lista de categorias
            fetchCategorias();
            setNomeCategoria(""); // Limpar o campo de input
            setIsDestaque(false); // Resetar seleção de destaque
            setDetachType(""); // Resetar tipo de destaque
            setShowDetachType(false); // Esconder opções de tipo de destaque
            alert("Categoria adicionada com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar categoria:", error);
        }
    };

    const handleSubmitExcluir = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://centroeuropeuhomolog.belogic.com.br/api/category/${categoriaExcluir}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Após excluir, atualizar a lista de categorias
            await fetchCategorias(); // Aguardar a atualização das categorias
            setCategoriaExcluir(""); // Limpar o campo de seleção
            alert("Categoria excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir categoria:", error);
        }
    };

    const handleDestaqueChange = (event) => {
        setIsDestaque(event.target.value === "true");
        if (event.target.value === "true") {
            setShowDetachType(true);
        } else {
            setShowDetachType(false);
            setDetachType("");
        }
    };

    return (
        <div>
            <Nav />
            <div className="addCategoria-main">
                <form className="form-addCategoria" onSubmit={handleSubmitAdicionar}>
                    <h2 className="formAddCategoria-h2">Adicionar categoria:</h2>
                    <label>Nome da categoria</label>
                    <input
                        className="formAddCateg"
                        type="text"
                        value={nomeCategoria}
                        onChange={(e) => setNomeCategoria(e.target.value)}
                    />

                    <label>É destaque?</label>
                    <select
                        className="formAddCateg"
                        value={isDestaque}
                        onChange={handleDestaqueChange}
                    >
                        <option value="false">Não</option>
                        <option value="true">Sim</option>
                    </select>

                    {showDetachType && (
                        <div>
                            <label>Tipo de destaque:</label>
                            <select
                                className="formAddCateg"
                                value={detachType}
                                onChange={(e) => setDetachType(e.target.value)}
                                required
                            >
                                <option value="">Selecione o tipo de destaque</option>
                                <option value="servico">Serviço</option>
                                <option value="produto">Produto</option>
                            </select>
                        </div>
                    )}

                    <button type="submit">Adicionar categoria</button>
                </form>

                <form className="form-addCategoria" onSubmit={handleSubmitExcluir}>
                    <h2 className="formAddCategoria-h2">Excluir categoria:</h2>
                    <label>Selecione a categoria que deseja excluir</label>
                    <p>(para escluir uma categoria é preciso excluir suas subcategorias antes)</p>
                    <select
                        className="formAddCateg"
                        value={categoriaExcluir}
                        onChange={(e) => setCategoriaExcluir(e.target.value)}
                    >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map(categoria => (
                            <option key={categoria.id} value={categoria.id}>{categoria.name}</option>
                        ))}
                    </select>
                    <button type="submit">Excluir categoria</button>
                </form>
            </div>
        </div>
    );
}

export default AddCategoria;
