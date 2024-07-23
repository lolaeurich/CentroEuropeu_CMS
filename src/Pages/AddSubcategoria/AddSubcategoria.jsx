import React, { useState, useEffect } from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";
import axios from "axios";

function AddSubCategoria() {
    const [categorias, setCategorias] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
    const [subcategorias, setSubcategorias] = useState([]);
    const [subcategoriaSelecionada, setSubcategoriaSelecionada] = useState("");
    const [nomeSubcategoria, setNomeSubcategoria] = useState("");

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

    const fetchSubcategorias = async (categoriaId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`https://centroeuropeuhomolog.belogic.com.br/api/category?parent_id[]=${categoriaId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data && response.data.categories) {
                setSubcategorias(response.data.categories[0].children);
            } else {
                setSubcategorias([]);
            }
        } catch (error) {
            console.error(`Erro ao obter subcategorias da categoria ${categoriaId}:`, error);
            setSubcategorias([]);
        }
    };

    const handleSubmitAdicionar = async (event) => {
        event.preventDefault();
        
        try {
            const token = localStorage.getItem("token");
            const data = {
                name: nomeSubcategoria,
                parent_id: categoriaSelecionada
            };
            await axios.post("https://centroeuropeuhomolog.belogic.com.br/api/category", data, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
      
            setNomeSubcategoria("");
            fetchSubcategorias(categoriaSelecionada);
            alert("Subcategoria adicionada com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar subcategoria:", error);
        }
    };

    const handleSubmitExcluir = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://centroeuropeuhomolog.belogic.com.br/api/category/${subcategoriaSelecionada}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
      
            setSubcategoriaSelecionada("");
            fetchSubcategorias(categoriaSelecionada); 
            alert("Subcategoria excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir subcategoria:", error);
        }
    };

    return (
        <div>
            <Nav />
            <div className="addCategoria-main">
                <form className="form-addCategoria" onSubmit={handleSubmitAdicionar}>
                    <h2 className="formAddCategoria-h2">Adicionar subcategoria:</h2>
                    <label>Escolha uma categoria para vincular:</label>
                    <select
                        className="formAddCateg"
                        value={categoriaSelecionada}
                        onChange={(e) => {
                            setCategoriaSelecionada(e.target.value);
                            fetchSubcategorias(e.target.value);
                        }}
                    >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map(categoria => (
                            <option key={categoria.id} value={categoria.id}>{categoria.name}</option>
                        ))}
                    </select>
                    <label>Nome da subcategoria:</label>
                    <input
                        className="formAddCateg"
                        type="text"
                        value={nomeSubcategoria}
                        onChange={(e) => setNomeSubcategoria(e.target.value)}
                    />
                    <button type="submit">Adicionar subcategoria</button>
                </form>

                <form className="form-addCategoria" onSubmit={handleSubmitExcluir}>
                    <h2 className="formAddCategoria-h2">Excluir subcategoria:</h2>
                    <label>Selecione a categoria vinculada:</label>
                    <select
                        className="formAddCateg"
                        value={categoriaSelecionada}
                        onChange={(e) => {
                            setCategoriaSelecionada(e.target.value);
                            fetchSubcategorias(e.target.value);
                        }}
                    >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map(categoria => (
                            <option key={categoria.id} value={categoria.id}>{categoria.name}</option>
                        ))}
                    </select>
                    <label>Selecione a subcategoria a ser excluída:</label>
                    <select
                        className="formAddCateg"
                        value={subcategoriaSelecionada}
                        onChange={(e) => setSubcategoriaSelecionada(e.target.value)}
                    >
                        <option value="">Selecione uma subcategoria</option>
                        {subcategorias.map(subcategoria => (
                            <option key={subcategoria.id} value={subcategoria.id}>{subcategoria.name}</option>
                        ))}
                    </select>
                    <button type="submit">Excluir subcategoria</button>
                </form>
            </div>
        </div>
    );
}

export default AddSubCategoria;
