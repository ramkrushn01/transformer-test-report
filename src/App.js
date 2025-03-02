import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./components/Home";
import TransformerInfo from "./components/TransformerInfo";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import TransformerBasicInfo from "./components/TransformerBasicInfo";
import Login from "./components/Login";
import Reports from "./components/Reports";
import MainHome from "./components/MainHome";

function App() {
    const SidebarNotDisplayList = ['/login/', '/reports/'];
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/login/" element={<Login />} />
                <Route path="/reports/" element={<Reports />} />
            </Routes>
            <div className="main-contain">
                <div className="side-bar">
                    <Sidebar />
                </div>
                <div className="main-div">
                    <Routes element={<Sidebar />}>
                        {/* <Route element={<Sidebar />}> */}
                        <Route path="/" element={<MainHome />} />
                        <Route
                            path="/transformer-information/:reportId"
                            element={<TransformerInfo />}
                        />
                        <Route
                            path="/transformer-basic-info/:reportId"
                            element={<TransformerBasicInfo />}
                        />
                        <Route
                            path="/customer-details/:reportId"
                            element={<Home />}
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
