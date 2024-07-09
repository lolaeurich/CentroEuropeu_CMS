import React, { useState, useEffect } from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";
import axios from "axios";
import * as XLSX from "xlsx"; // Importar a biblioteca para manipulação de Excel

function Produtos() {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        payment_condition: "",
        hotmart_url: "",
        category: "",
        sub_category: null,
        photo: null,
    });

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    return;
                }

                const response = await axios.get("https://centroeuropeuhomolog.belogic.com.br/api/category", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.categories) {
                    setCategories(response.data.categories);
                } else {
                    console.error("Resposta da API de categorias inválida:", response);
                }
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    return;
                }

                const response = await axios.get("https://centroeuropeuhomolog.belogic.com.br/api/product", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.products && response.data.products.data) {
                    setProducts(response.data.products.data);
                } else {
                    console.error("Resposta da API de produtos inválida:", response);
                }
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }

            const payload = new FormData();
            payload.append("name", formData.name);
            payload.append("price", formData.price);
            payload.append("description", formData.description);
            payload.append("payment_condition", formData.payment_condition);
            payload.append("hotmart_url", formData.hotmart_url);
            payload.append("category", formData.category);
            payload.append("photo", formData.photo);

            if (formData.sub_category !== null) {
                payload.append("sub_category", formData.sub_category);
            }

            const response = await axios.post("https://centroeuropeuhomolog.belogic.com.br/api/product", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Resposta da API:", response.data);

            setFormData({
                name: "",
                price: "",
                description: "",
                payment_condition: "",
                hotmart_url: "",
                category: "",
                sub_category: null,
                photo: null,
            });

            alert("Produto cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);

            if (error.response) {
                alert(`Erro ao cadastrar produto: ${error.response.data.message}`);
            } else {
                alert("Ocorreu um erro ao cadastrar o produto. Por favor, tente novamente mais tarde.");
            }
        }
    };

    const handleDownloadExcel = () => {
        const header = ["Nome", "Preço", "Descrição", "Condição de pagamento", "Link do produto", "Categoria", "Subcategoria"];
        const data = products.map(product => [
            product.name,
            product.price,
            product.description,
            product.payment_condition,
            product.hotmart_url,
            product.category,
            product.sub_category || "",
        ]);

        const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Produtos");

        XLSX.writeFile(wb, "produtos.xlsx");
    };

    return (
        <div>
            <Nav />
            <div className="produtos-main">
            <h1>Lista de Produtos</h1>
                <table className="tabela-produtos">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Preço</th>
                            <th>Descrição</th>
                            <th>Condição de pagamento</th>
                            <th>Link do produto</th>
                            <th>Categoria</th>
                            <th>Subcategoria</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.description}</td>
                                <td>{product.payment_condition}</td>
                                <td><a href={product.hotmart_url}>{product.hotmart_url}</a></td>
                                <td>{product.category}</td>
                                <td>{product.sub_category || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button onClick={handleDownloadExcel}>Baixar Excel</button>

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
                    <select name="sub_category" id="produtos-sub" value={formData.sub_category || ""} onChange={handleChange}>
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
