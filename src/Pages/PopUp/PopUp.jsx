import React from "react";
import "./style.css";
import Nav from "../../Components/Nav/Nav";

function PopUp () {
    return (
        <div>
        <Nav />
        <div className="banner-main">
            <form className="form-banner">
                    <h2 className="form-h2">Alterar imagem da PopUp:</h2>
                    <label>Selecione arquivo</label>
                    <input className="file" type="file" id="foto" name="foto" accept="image/png, image/jpeg" />
                    <button>Adicionar arte</button>
            </form>
        </div>
    </div>
    )
}

export default PopUp;