import React from "react";
import "../css/sidebar.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Sidebar() {
    const SideBarContentList = [
        { text: "Customer Details", link: "/" },
        { text: "Transformer Basic Information", link: "/transformer-basic-info/" },
        { text: "Transformer Technical Information", link: "/transformer-information/" },
        { text: "Measurement of Insulation Resistance", link: "/measurement-of-insulation-resistance/" },
        { text: "Measurement of Voltage Ratio", link: "/measurement-of-voltage-ratio/" },
        { text: "Magnetic Balance and Magnetizing Current Test", link: "/magnetic-balance-and-magnetizing-current-test/" },
        { text: "Measurement Of Winding Resistance", link: "/measurement-of-winding-resistance/" },
        { text: "Vector Group Test", link: "/vector-group-test/" },
        { text: "Measurement of No Load Loss and No Load Current", link: "/measurement-of-no-load-loss-and-no-load-current/" },
        { text: "Measurement Of Load Loss and Impedance", link: "/measurement-of-load-loss-and-impedance/" },
        { text: "Measurement Of Load Loss and Test", link: "/measurement-of-load-loss-and-test/" },
        { text: "Oil BDV", link: "/oil-bdv/" },
        { text: "Induced Over Voltage Test", link: "/induced-over-voltage-test/" },        
    ];

    const PageLocation = useLocation();

    return (
        <div className="main-sidebar">
            <ul className="side-list">
                {SideBarContentList.map((item, index) => (
                    <li className={`side-list-item ${PageLocation.pathname === item.link && "active"}`} key={index}> <Link className="side-link" to={item.link}>{item.text}</Link> </li>
                ))}
            </ul>
        </div>
    );
}
