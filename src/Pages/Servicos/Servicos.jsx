import React, { useState, useEffect } from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";
import axios from "axios";
import * as XLSX from "xlsx"; // Importar a biblioteca para manipulação de Excel

function Servicos() {
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
    const [services, setServices] = useState([]);

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
        const fetchServices = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    return;
                }

                const response = await axios.get("https://centroeuropeuhomolog.belogic.com.br/api/service", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data && response.data.services && response.data.services.data) {
                    setServices(response.data.services.data);
                } else {
                    console.error("Resposta da API de serviços inválida:", response);
                }
            } catch (error) {
                console.error("Erro ao buscar serviços:", error);
            }
        };

        fetchServices();
    }, []);

    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (name === "category") {
            setFormData({
                ...formData,
                category: value,
                sub_category: null, // Reset sub_category when category changes
            });

            // Fetch subcategories based on selected category
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    return;
                }

                const categoryId = categories.find(cat => cat.name === value)?.id;

                if (categoryId) {
                    const subCategoryResponse = await axios.get(`https://centroeuropeuhomolog.belogic.com.br/api/category?parent_id[]=${categoryId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (subCategoryResponse.data && subCategoryResponse.data.categories && subCategoryResponse.data.categories.length > 0) {
                        setSubCategories(subCategoryResponse.data.categories[0].children || []);
                    } else {
                        setSubCategories([]);
                    }
                } else {
                    setSubCategories([]);
                }
            } catch (error) {
                console.error("Erro ao buscar subcategorias:", error);
                setSubCategories([]);
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
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

            const response = await axios.post("https://centroeuropeuhomolog.belogic.com.br/api/service", payload, {
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

            alert("Serviço adicionado com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar serviço:", error);

            if (error.response) {
                alert(`Erro ao adicionar serviço: ${error.response.data.message}`);
            } else {
                alert("Ocorreu um erro ao adicionar o serviço. Por favor, tente novamente mais tarde.");
            }
        }
    };

    const handleDownloadExcel = () => {
        const header = ["Nome", "Preço", "Descrição", "Condição de pagamento", "Link do serviço", "Categoria", "Subcategoria"];
        const data = services.map(service => [
            service.name,
            service.price,
            service.description,
            service.payment_condition,
            service.hotmart_url,
            service.category,
            service.sub_category || "",
        ]);

        const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Serviços");

        XLSX.writeFile(wb, "servicos.xlsx");
    };

    return (
        <div>
            <Nav />
            <div className="produtos-main">
                <table className="tabela-produtos">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Preço</th>
                            <th>Descrição</th>
                            <th>Condição de pagamento</th>
                            <th>Link do serviço</th>
                            <th>Categoria</th>
                            <th>Subcategoria</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => (
                            <tr key={service.id}>
                                <td>{service.name}</td>
                                <td>{service.price}</td>
                                <td>{service.description}</td>
                                <td>{service.payment_condition}</td>
                                <td><a href={service.hotmart_url}>{service.hotmart_url}</a></td>
                                <td>{service.category}</td>
                                <td>{service.sub_category || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button onClick={handleDownloadExcel}>Baixar Excel</button>

                <form className="form-produtos" onSubmit={handleSubmit}>
                    <h2 className="form-h2">Adicione um novo serviço:</h2>
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
                    <label>Link do serviço</label>
                    <input name="hotmart_url" id="link" type="text" value={formData.hotmart_url} onChange={handleChange} required />
                    <label>Imagem</label>
                    <input className="file" type="file" id="foto" name="foto" accept="image/png, image/jpeg" onChange={handleChange} required />
                
                    <button type="submit">Adicionar serviço</button>
                </form>
            </div>
        </div>
    );
}

export default Servicos;
