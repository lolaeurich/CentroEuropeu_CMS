import React from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";
import { useNavigate } from "react-router-dom";

function Categorias () {
    const navigate = useNavigate();

    const handleAddCat = () => {
        navigate("/AddCategoria");
    };

    const handleAddSub = () => {
        navigate("/AddSubcategoria");
    };

    return (
        <div>
            <Nav />
            <div className="botoes-cat">
                <button className="btn-categ" onClick={handleAddCat}>Adicionar nova categoria</button>
                <button className="btn-subcateg" onClick={handleAddSub}>Adicionar nova subcategoria</button>
            </div>
        </div>
    )
}

export default Categorias;