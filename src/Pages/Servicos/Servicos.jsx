import React, { useState, useEffect } from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";
import axios from "axios";
import * as XLSX from "xlsx"; 

function Servicos() {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        payment_condition: "",
        hotmart_url: "",
        category: "",
        sub_category: "",
        photo: [], 
        detach: "0", 
        detach_type: "servico", 
    });

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

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

    const fetchSubcategories = async (categoryId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }

            const response = await axios.get(`https://centroeuropeuhomolog.belogic.com.br/api/category?parent_id[]=${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.categories && response.data.categories.length > 0) {
                setSubCategories(response.data.categories[0].children);
            } else {
                setSubCategories([]);
                console.error(`Resposta da API de subcategorias para categoria ${categoryId} inválida:`, response);
            }
        } catch (error) {
            console.error(`Erro ao buscar subcategorias da categoria ${categoryId}:`, error);
        }
    };

    useEffect(() => {
        const fetchAllServices = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    return;
                }

                let allServices = [];
                let page = 1;

                while (true) {
                    const response = await axios.get(`https://centroeuropeuhomolog.belogic.com.br/api/service?page=${page}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.data && response.data.services && response.data.services.data) {
                        allServices = [...allServices, ...response.data.services.data];
                        if (!response.data.services.next_page_url) {
                            break;
                        }
                        page++;
                    } else {
                        console.error(`Resposta da API de serviços inválida para página ${page}:`, response);
                        break;
                    }
                }

                setServices(allServices);
            } catch (error) {
                console.error("Erro ao buscar todos os serviços:", error);
            }
        };

        fetchAllServices();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "category") {
            fetchSubcategories(value);
        }
    };

    const handlePhotoChange = (e) => {
        const filesArray = Array.from(e.target.files);
        setSelectedFiles(filesArray); 
        setFormData(prevState => ({
            ...prevState,
            photo: [...prevState.photo, ...filesArray], 
        }));
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
            payload.append("sub_category", formData.sub_category);
    
            formData.photo.forEach((photo, index) => {
                payload.append(`photo[${index}]`, photo); 
            });
    
            if (formData.detach) {
                payload.append("detach", "1");
                payload.append("detach_type", "serviços"); 
            } else {
                payload.append("detach", "0");
                payload.append("detach_type", "");
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
                sub_category: "",
                photo: [], 
                detach: 0, 
                detach_type: "servico", 
            });
    
            alert("Serviço cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar serviço:", error);
    
            if (error.response) {
                console.error("Erro detalhado:", error.response.data); 
    
                let errorMessage = "Erro ao cadastrar serviço.";
                if (error.response.data && error.response.data.errors) {
                    errorMessage += "\nDetalhes do erro:";
                    for (const key in error.response.data.errors) {
                        errorMessage += `\n- ${key}: ${error.response.data.errors[key]}`;
                    }
                }
    
                alert(errorMessage);
            } else {
                alert("Ocorreu um erro ao cadastrar o serviço. Por favor, tente novamente mais tarde.");
            }
        }
    };
    

    const handleDownloadExcel = () => {
        const header = ["Nome", "Preço", "Descrição", "Condição de pagamento", "Link do produto", "Categoria", "Subcategoria"];
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
                <h1>Lista de Serviços</h1>
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
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <label>Subcategoria</label>
                    <select name="sub_category" id="produtos-sub" value={formData.sub_category} onChange={handleChange}>
                        <option value="">Selecione...</option>
                        {subCategories.map((subcat) => (
                            <option key={subcat.id} value={subcat.id}>
                                {subcat.name}
                            </option>
                        ))}
                    </select>
                    <label>Nome</label>
                    <input name="name" id="nome" type="text" value={formData.name} onChange={handleChange} required />
                    <label>Descrição</label>
                    <textarea name="description" id="descricao" value={formData.description} onChange={handleChange} required />
                    <label>Preço</label>
                    <input name="price" id="preco" type="number" value={formData.price} onChange={handleChange} required />
                    <label>Condição de Pagamento</label>
                    <input name="payment_condition" id="payment" type="text" value={formData.payment_condition} onChange={handleChange} required />
                    <label>Link Hotmart</label>
                    <input name="hotmart_url" id="hotmart" type="url" value={formData.hotmart_url} onChange={handleChange} required />
                    <label>Fotos ou Vídeos</label>
                    <input className="file" type="file" id="files" name="files[]" accept="image/*, video/*" multiple onChange={handlePhotoChange} required />

                    {/* Exibindo os arquivos selecionados */}
                    {selectedFiles.length > 0 && (
                        <div className="selected-files">
                            <p>Arquivos selecionados:</p>
                            <ul>
                                {selectedFiles.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <label>Destaque</label>
                    <select name="detach" id="destaque" value={formData.detach} onChange={handleChange}>
                        <option value="false">Não</option>
                        <option value="true">Sim</option>
                    </select>

                    <button type="submit">Salvar</button>
                </form>
            </div>
        </div>
    );
}

export default Servicos;
