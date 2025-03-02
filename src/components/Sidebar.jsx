import React from "react";
import "../css/sidebar.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Sidebar() {
    const reportId = useSelector((state)=> state.reportId.reportId);
    const SideBarContentList = [
        { text: "Customer Details", link: `/customer-details/${reportId}` },
        { text: "Transformer Basic Information", link: `/transformer-basic-info/${reportId}` },
        { text: "Transformer Technical Information", link: `/transformer-information/${reportId}` },
        { text: "Measurement of Insulation Resistance", link: `/measurement-of-insulation-resistance/${reportId}` },
        { text: "Measurement of Voltage Ratio", link: `/measurement-of-voltage-ratio/${reportId}` },
        { text: "Magnetic Balance and Magnetizing Current Test", link: `/magnetic-balance-and-magnetizing-current-test/${reportId}` },
        { text: "Measurement Of Winding Resistance", link: `/measurement-of-winding-resistance/${reportId}` },
        { text: "Vector Group Test", link: `/vector-group-test/${reportId}` },
        { text: "Measurement of No Load Loss and No Load Current", link: `/measurement-of-no-load-loss-and-no-load-current/${reportId}` },
        { text: "Measurement Of Load Loss and Impedance", link: `/measurement-of-load-loss-and-impedance/${reportId}` },
        { text: "Measurement Of Load Loss and Test", link: `/measurement-of-load-loss-and-test/${reportId}` },
        { text: "Oil BDV", link: `/oil-bdv/${reportId}` },
        { text: "Induced Over Voltage Test", link: `/induced-over-voltage-test/${reportId}` },
    ];

    const PageLocation = useLocation();

    return (
        <div className="main-sidebar">
            <ul className="side-list">
                {SideBarContentList.map((item, index) => (
                    <li className={`side-list-item ${PageLocation.pathname.split("/")[1] === item.link.split("/")[1] && "active"}`} key={index}> <Link className="side-link" to={item.link}>{item.text}</Link> </li>
                ))}
            </ul>
        </div>
    );
}
