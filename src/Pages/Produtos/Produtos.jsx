import React from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";

function Produtos () {
    return (
        <div>
            <Nav />
            <div className="produtos-main">
                <form className="form-produtos">
                    <h2 className="form-h2">Adicione um novo produto:</h2>
                    <label>Categoria</label>
                    <select name="produtos" id="produtos"></select>
                    <label>Subcategoria</label>
                    <select name="produtos" id="produtos-sub"></select>
                    <label>Nome</label>
                    <input name="nome" id="nome" type="text"></input>
                    <label>Descrição</label>
                    <textarea name="nome" id="nome" type="text"></textarea>
                    <label>Preço</label>
                    <input name="preco" id="preco" type="price"></input>
                    <label>Condição de pagamento</label>
                    <select name="pagamento" id="pagamento"></select>
                    <label>Link do produto</label>
                    <input name="link" id="link" type="text"></input>
                    <label>Imagem</label>
                    <input className="file" type="file" id="foto" name="foto" accept="image/png, image/jpeg" />
                
                    <button>Adicionar produto</button>
                </form>
            </div>
        </div>
    )
}

export default Produtos;