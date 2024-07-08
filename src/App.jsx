import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from "react-router-dom";
import Login from './Pages/Login/Login';
import AreaLogada from './Pages/AreaLogada/AreaLogada';
import Produtos from './Pages/Produtos/Produtos';
import Servicos from './Pages/Servicos/Servicos';
import Alunos from './Pages/Alunos/Alunos';
import Banner from './Pages/Banner/Banner';
import PopUp from './Pages/PopUp/PopUp';
import Parceiros from './Pages/Parceiros/Parceiros';

const App = () => {
  return (
    <Routes>
     <Route path="/" element={<Login />}/>
     <Route path="/AreaLogada" element={<AreaLogada />}/>
     <Route path="/Produtos" element={<Produtos />}/>
     <Route path="/Servicos" element={<Servicos />}/>
     <Route path="/Alunos" element={<Alunos />}/>
     <Route path="/Banner" element={<Banner />}/>
     <Route path="/PopUp" element={<PopUp />}/>
     <Route path="/Parceiros" element={<Parceiros />}/>
    </Routes>
  );
}

export default App 