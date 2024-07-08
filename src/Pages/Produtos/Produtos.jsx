import React, { useState, useEffect } from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";
import axios from "axios";

function Produtos() {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        payment_condition: "",
        hotmart_url: "",
        category: "",
        sub_category: "",
        photo: null,
    });

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    // Tratar caso de usuário não autenticado
                    return;
                }

                const response = await axios.get("https://centroeuropeuhomolog.belogic.com.br/api/category", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.categories) {
                    setCategories(response.data.categories);
                    // Definir subcategorias da primeira categoria, se existir
                    if (response.data.categories.length > 0) {
                        setSubCategories(response.data.categories[0].subcategories || []);
                    }
                } else {
                    console.error("Resposta da API de categorias inválida:", response);
                }
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "foto") {
            setFormData({
                ...formData,
                photo: files[0], // Armazenar o arquivo de imagem selecionado
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });

            if (name === "category") {
                // Atualizar as subcategorias quando a categoria mudar
                const selectedCategory = categories.find(cat => cat.name === value);
                if (selectedCategory) {
                    setSubCategories(selectedCategory.subcategories || []);
                } else {
                    setSubCategories([]);
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                // Tratar caso de usuário não autenticado
                return;
            }

            const payload = new FormData();
            payload.append("name", formData.name);
            payload.append("price", formData.price);
            payload.append("description", formData.description);
            payload.append("payment_condition", formData.payment_condition);
            payload.append("hotmart_url", formData.hotmart_url);
            payload.append("category", formData.category);
            if (formData.sub_category) {
                payload.append("sub_category", formData.sub_category);
            }
            payload.append("photo", formData.photo); // Adicionar a imagem ao FormData

            const response = await axios.post("https://centroeuropeuhomolog.belogic.com.br/api/product", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Resposta da API:", response.data);

            // Limpar o formulário ou exibir mensagem de sucesso
            setFormData({
                name: "",
                price: "",
                description: "",
                payment_condition: "",
                hotmart_url: "",
                category: "",
                sub_category: "",
                photo: null,
            });

            alert("Produto cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);

            // Exibir mensagem de erro para o usuário
            if (error.response) {
                alert(`Erro ao cadastrar produto: ${error.response.data.message}`);
            } else {
                alert("Ocorreu um erro ao cadastrar o produto. Por favor, tente novamente mais tarde.");
            }
        }
    };

    return (
        <div>
            <Nav />
            <div className="produtos-main">
                <form className="form-produtos" onSubmit={handleSubmit}>
                    <h2 className="form-h2">Adicione um novo produto:</h2>
                    <label>Categoria</label>
                    <select name="category" id="produtos" value={formData.category} onChange={handleChange} required>
                        <option value="">Selecione...</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <label>Subcategoria</label>
                    <select name="sub_category" id="produtos-sub" value={formData.sub_category} onChange={handleChange}>
                        <option value="">Selecione...</option>
                        {subCategories && subCategories.map((subcat) => (
                            <option key={subcat.id} value={subcat.name}>
                                {subcat.name}
                            </option>
                        ))}
                    </select>
                    <label>Nome</label>
                    <input name="name" id="nome" type="text" value={formData.name} onChange={handleChange} required />
                    <label>Descrição</label>
                    <textarea name="description" id="descricao" value={formData.description} onChange={handleChange} required></textarea>
                    <label>Preço</label>
                    <input name="price" id="preco" type="text" value={formData.price} onChange={handleChange} required />
                    <label>Condição de pagamento</label>
                    <input name="payment_condition" id="pagamento" type="text" value={formData.payment_condition} onChange={handleChange} required />
                    <label>Link do produto</label>
                    <input name="hotmart_url" id="link" type="text" value={formData.hotmart_url} onChange={handleChange} required />
                    <label>Imagem</label>
                    <input className="file" type="file" id="foto" name="foto" accept="image/png, image/jpeg" onChange={handleChange} required />
                
                    <button type="submit">Adicionar produto</button>
                </form>
            </div>
        </div>
    );
}

export default Produtos;
