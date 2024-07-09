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
        sub_category: null,
        photo: null,
    });

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [productInfo, setProductInfo] = useState(null);

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

            const response = await axios.post("https://centroeuropeuhomolog.belogic.com.br/api/product", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Resposta da API:", response.data);

            setProductInfo(response.data.product);

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

                {productInfo && (
                    <div className="product-info">
                        <h3>Detalhes do produto cadastrado:</h3>
                        <p>Nome: {productInfo.name}</p>
                        <p>Preço: {productInfo.price}</p>
                        <p>Descrição: {productInfo.description}</p>
                        <p>Condição de pagamento: {productInfo.payment_condition}</p>
                        <p>Link do produto: <a href={productInfo.hotmart_url}>{productInfo.hotmart_url}</a></p>
                        <p>Categoria: {productInfo.category}</p>
                        {productInfo.sub_category && <p>Subcategoria: {productInfo.sub_category}</p>}

                        <div className="product-photos">
                            <h4>Fotos do produto:</h4>
                            {productInfo.photos.map((photo) => (
                                <img key={photo.id} src={photo.public_path} alt={photo.name} />
                            ))}
                        </div>

                        <div className="product-videos">
                            <h4>Vídeos do produto:</h4>
                            {productInfo.videos.map((video) => (
                                <video key={video.id} controls>
                                    <source src={video.public_path} type={video.mime_type} />
                                    Seu navegador não suporta vídeos HTML5.
                                </video>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Produtos;
