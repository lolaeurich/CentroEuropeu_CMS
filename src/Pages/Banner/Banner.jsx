import React from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";

function Banner () {
    return (
        <div>
            <Nav />
            <div className="banner-main">
                <form className="form-banner">
                        <h2 className="form-h2">Alterar imagem do banner:</h2>
                        <label>Selecione arquivo</label>
                        <input className="file" type="file" id="foto" name="foto" accept="image/png, image/jpeg" />
                        <button>Adicionar imagem</button>
                </form>
            </div>
        </div>
    )
}

export default Banner;