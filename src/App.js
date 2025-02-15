import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import TransformerInfo from "./components/TransformerInfo";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import TransformerBasicInfo from "./components/TransformerBasicInfo";

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <div className="main-contain">
                <div className="side-bar">
                    <Sidebar />
                </div>

                <div className="main-div">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/transformer-information/"
                            element={<TransformerInfo />}
                        />
                        <Route
                            path="/transformer-basic-info/"
                            element={<TransformerBasicInfo />}
                        />
                        <Route
                            path="/customer-details/"
                            element={<Home />}
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
