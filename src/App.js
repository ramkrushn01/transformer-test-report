import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import TransformerInfo from "./components/TransformerInfo";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import TransformerBasicInfo from "./components/TransformerBasicInfo";
import Login from "./components/Login";

function App() {
    const SidebarNotDisplayList = ['/login/'];
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/login/" element={<Login />} />
            </Routes>
            {!SidebarNotDisplayList.includes(document.location.pathname) && (
                <div className="main-contain">
                    <div className="side-bar">
                        <Sidebar />
                    </div>
                    <div className="main-div">
                        <Routes>
                            {/* <Route element={<Sidebar />}> */}
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
            )}
        </BrowserRouter>
    );
}

export default App;
