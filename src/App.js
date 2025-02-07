import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import TransformerInfo from "./components/TransformerInfo"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/transformer-information/" element={ <TransformerInfo/> } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
