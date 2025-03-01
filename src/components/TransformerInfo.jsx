import React, { useEffect } from "react";
import ContentTable from "./common/ContentTable";
import "../css/home.css";
import NextPreviousButton from "./common/NextPreviousButton";
import { useDispatch } from "react-redux";
import { setReportId } from "../redux/features/reportIdSlice";
import { useParams } from "react-router-dom";

export default function Home() {
    const dispatch = useDispatch();
    const params = useParams();
    // const HomePage = { CellName:[TableValuePlaceholder, ValueType, DefaultValue, ValueUnit] }
    const HomePageContent = {
        "RATED CAPACITY" : ["Rated Capacity", "number", "", "MVA"],
        "RATED HV VOLTAGE" : ["Rated Voltage On HV Winding", "number","","KV"],
        "RATED LV1 VOLTAGE" : ["Rated Voltage In LV1 Winding", "number", "" , "KV"],
        "RATED LV2 VOLTAGE" : ["Rated Voltage In LV2 Winding", "number", "" , "KV"],
        "RATED HV CURRENT" : ["Rated Current In HV Winding", "number", "" ,"AMPS"],
        "RATED LV1 CURRENT" : ["Rated Current In LV1 Winding", "number", "" ,"AMPS"],
        "RATED LV2 CURRENT" : ["Rated Current In LV2 Winding", "number", "" ,"AMPS"],
        "VECTOR GROUP" : ["Vector Group", "Text", "",""],
        "RATED FREQUENCY": ["Rated Frequency", "number", 50 ,"HZ"],
        "VOLTAGE VARIATION" : ["Voltage Variation", "text"],
    };

    const NextPreviousButtonState = [false,false];
    const NextPrevLink = [`/transformer-basic-info/${params.reportId}`,`/transformer-information/${params.reportId}`]

    useEffect(() => {
        dispatch(setReportId(params.reportId));
    }, []);
    
    return (
        <div className="main-content">
            <div className="main-content-head">
                Transformer Technical Information
            </div>
            <ContentTable TableContent={HomePageContent}/>
            <NextPreviousButton State={NextPreviousButtonState} NextPrevLink={NextPrevLink} />
        </div>
    );
}
