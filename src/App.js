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
import MagneticBalanceAndMagnetizingCurrentTest from "./components/MagneticBalanceAndMagnetizingCurrentTest";
import MeasurementOfWindingResistance from "./components/MeasurementOfWindingResistance";
import MeasurementOfNoLoadLossAndNoLoadCurrent from "./components/MeasurementOfNoLoadLossAndNoLoadCurrent";
import VectorGroupTest from "./components/VectorGroupTest";
import MeasurementOfLoadLossAndImpedance from "./components/MeasurementOfLoadLossAndImpedance";
import SeparateSourceVoltageWithstandTest from "./components/SeparateSourceVoltageWithstandTest";
import OilBdv from "./components/OilBdv";
import InducedOverVoltageTest from "./components/InducedOverVoltageTest";
import MeasurementOfCapacitanceAndTanDeltaOfWinding from "./components/MeasurementOfCapacitanceAndTanDeltaOfWinding";
import MeasurementOfCapacitanceAndTanDeltaOfBushing from "./components/MeasurementOfCapacitanceAndTanDeltaOfBushing";

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
        <Route path="/magnetic-balance-and-magnetizing-current-test/:reportId" element={<Layout><MagneticBalanceAndMagnetizingCurrentTest /></Layout>} />
        <Route path="/measurement-of-winding-resistance/:reportId" element={<Layout><MeasurementOfWindingResistance /></Layout>} />
        <Route path="/measurement-of-no-load-loss-and-no-load-current/:reportId" element={<Layout><MeasurementOfNoLoadLossAndNoLoadCurrent /></Layout>} />
        <Route path="/vector-group-test/:reportId" element={<Layout><VectorGroupTest /></Layout>} />
        <Route path="/measurement-of-load-loss-and-impedance/:reportId" element={<Layout><MeasurementOfLoadLossAndImpedance /></Layout>} />
        <Route path="/separate-source-voltage-withstand-test/:reportId" element={<Layout><SeparateSourceVoltageWithstandTest /></Layout>} />
        <Route path="/oil-bdv/:reportId" element={<Layout><OilBdv /></Layout>} />
        <Route path="/induced-over-voltage-test/:reportId" element={<Layout><InducedOverVoltageTest /></Layout>} />
        <Route path="/measurement-of-capacitance-and-tan-delta-of-winding/:reportId" element={<Layout><MeasurementOfCapacitanceAndTanDeltaOfWinding /></Layout>} />
        <Route path="/measurement-of-capacitance-and-tan-delta-of-bushing/:reportId" element={<Layout><MeasurementOfCapacitanceAndTanDeltaOfBushing /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
