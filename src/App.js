import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./components/Home";
import TransformerInfo from "./components/TransformerInfo";
import TransformerBasicInfo from "./components/TransformerBasicInfo";
import Login from "./components/Login";
import Reports from "./components/Reports";
import MainHome from "./components/MainHome";
import MeasurementOfInsulationResistance from "./components/MeasurementOfInsulationResistance";
import MeasurementOfVoltageRatio from "./components/MeasurementOfVoltageRatio";

// Layout Component for Sidebar & Main Content
const Layout = ({ children }) => (
  <div className="main-contain">
    <div className="side-bar">
      <Sidebar />
    </div>
    <div className="main-div">{children}</div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainHome/> }/>
        <Route path="/login" element={<Login />} />
        <Route path="/reports" element={<Reports />} />

        {/* Protected Routes with Sidebar */}
        <Route path="/transformer-information/:reportId" element={<Layout><TransformerInfo /></Layout>} />
        <Route path="/transformer-basic-info/:reportId" element={<Layout><TransformerBasicInfo /></Layout>} />
        <Route path="/customer-details/:reportId" element={<Layout><Home /></Layout>} />
        <Route path="/measurement-of-insulation-resistance/:reportId" element={<Layout><MeasurementOfInsulationResistance /></Layout>} />
        <Route path="/measurement-of-voltage-ratio/:reportId" element={<Layout><MeasurementOfVoltageRatio /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
