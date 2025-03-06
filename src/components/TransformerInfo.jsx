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
        // "RATED CAPACITY" : ["Rated Capacity", "number", "", "MVA"],
        // "RATED HV VOLTAGE" : ["Rated Voltage On HV Winding", "number","","KV"],
        // "RATED LV1 VOLTAGE" : ["Rated Voltage In LV1 Winding", "number", "" , "KV"],
        // "RATED LV2 VOLTAGE" : ["Rated Voltage In LV2 Winding", "number", "" , "KV"],
        // "RATED HV CURRENT" : ["Rated Current In HV Winding", "number", "" ,"AMPS"],
        // "RATED LV1 CURRENT" : ["Rated Current In LV1 Winding", "number", "" ,"AMPS"],
        // "RATED LV2 CURRENT" : ["Rated Current In LV2 Winding", "number", "" ,"AMPS"],
        // "VECTOR GROUP" : ["Vector Group", "Text", "",""],
        // "RATED FREQUENCY": ["Rated Frequency", "number", 50 ,"HZ"],
        // "VOLTAGE VARIATION" : ["Voltage Variation", "text"],

        "RATED CAPACITY": { TableValuePlaceholder: "Rated Capacity", ValueType: "number", DefaultValue: "", ValueUnit: "MVA" , name: ""},
        "RATED HV VOLTAGE": { TableValuePlaceholder: "Rated Voltage On HV Winding", ValueType: "number", DefaultValue: "", ValueUnit: "KV" },
        "RATED LV1 VOLTAGE": { TableValuePlaceholder: "Rated Voltage In LV1 Winding", ValueType: "number", DefaultValue: "", ValueUnit: "KV" },
        "RATED LV2 VOLTAGE": { TableValuePlaceholder: "Rated Voltage In LV2 Winding", ValueType: "number", DefaultValue: "", ValueUnit: "KV" },
        "RATED HV CURRENT": { TableValuePlaceholder: "Rated Current In HV Winding", ValueType: "number", DefaultValue: "", ValueUnit: "AMPS" },
        "RATED LV1 CURRENT": { TableValuePlaceholder: "Rated Current In LV1 Winding", ValueType: "number", DefaultValue: "", ValueUnit: "AMPS" },
        "RATED LV2 CURRENT": { TableValuePlaceholder: "Rated Current In LV2 Winding", ValueType: "number", DefaultValue: "", ValueUnit: "AMPS" },
        "VECTOR GROUP": { TableValuePlaceholder: "Vector Group", ValueType: "text", DefaultValue: "" },
        "RATED FREQUENCY": { TableValuePlaceholder: "Rated Frequency", ValueType: "number", DefaultValue: 50, ValueUnit: "HZ" },
        "VOLTAGE VARIATION": { TableValuePlaceholder: "Voltage Variation", ValueType: "text", DefaultValue: "" }
    };

    const NextPreviousButtonState = [false,false];
    const NextPrevLink = [`/transformer-basic-info/${params.reportId}`,`/transformer-information/${params.reportId}`]

    const OnValueChange = (e)=>{
        console.log(e);
    }

    useEffect(() => {
        dispatch(setReportId(params.reportId));
    }, []);
    
    return (
        <div className="main-content">
            <div className="main-content-head">
                Transformer Technical Information
            </div>
            <ContentTable TableContent={HomePageContent} OnValueChange={OnValueChange}/>
            <NextPreviousButton State={NextPreviousButtonState} NextPrevLink={NextPrevLink} />
        </div>
    );
}


// ramkrushn