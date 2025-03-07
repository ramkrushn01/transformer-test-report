import React, { useEffect, useRef, useState } from "react";
import ContentTable from "./common/ContentTable";
import "../css/home.css";
import NextPreviousButton from "./common/NextPreviousButton";
import { useDispatch } from "react-redux";
import { setReportId } from "../redux/features/reportIdSlice";
import { useParams } from "react-router-dom";
import API from "../api/custom_axios";
import { toast, ToastContainer } from "react-toastify";

export default function Home() {
    const dispatch = useDispatch();
    const params = useParams();
    const idRef = useRef();
    const [transformerTechnicalInfo, setTransformerTechnicalInfo] = useState();
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

        "RATED CAPACITY": { TableValuePlaceholder: "Rated Capacity", ValueType: "number", DefaultValue: transformerTechnicalInfo?.rated_capacity, ValueUnit: "MVA" , name: "", BackendName: "rated_capacity", ReadOnly: true},
        "RATED HV VOLTAGE": { TableValuePlaceholder: "Rated Voltage On HV Winding", ValueType: "number", DefaultValue: transformerTechnicalInfo?.rated_hv_voltage, ValueUnit: "KV", BackendName: "rated_hv_voltage", ReadOnly: true },
        "RATED LV VOLTAGE": { TableValuePlaceholder: "Rated Voltage In LV1 Winding", ValueType: "loop-input", DefaultValue: transformerTechnicalInfo?.rated_lv_voltage, ValueUnit: "KV", BackendName: "rated_lv_voltage", ReadOnly: true },
        "RATED HV CURRENT": { TableValuePlaceholder: "Rated Current In HV Winding", ValueType: "number", DefaultValue: transformerTechnicalInfo?.rated_hv_current, ValueUnit: "AMPS", BackendName: "rated_hv_current", ReadOnly: true },
        "RATED LV CURRENT": { TableValuePlaceholder: "Rated Current In LV1 Winding", ValueType: "loop-input", DefaultValue: transformerTechnicalInfo?.rated_lv_current, ValueUnit: "AMPS", BackendName: "rated_lv_current", ReadOnly: true },
        "VECTOR GROUP": { TableValuePlaceholder: "Vector Group", ValueType: "text", DefaultValue: transformerTechnicalInfo?.vector_group, BackendName: "vector_group", ReadOnly: true },
        "RATED FREQUENCY": { TableValuePlaceholder: "Rated Frequency", ValueType: "number", DefaultValue: transformerTechnicalInfo?.rated_frequency, ValueUnit: "HZ", BackendName: "rated_frequency", ReadOnly: true },
        "VOLTAGE VARIATION": { TableValuePlaceholder: "Voltage Variation", ValueType: "text", DefaultValue: transformerTechnicalInfo?.voltage_variation, BackendName: "voltage_variation", ReadOnly: false },
    };

    const NextPreviousButtonState = [false,false];
    const NextPrevLink = [`/transformer-basic-info/${params.reportId}`,`/transformer-information/${params.reportId}`]

    const UpdatedValue = {}

    const OnValueChange = (e)=>{
        UpdatedValue[e.target.name] = e.target.value
    }

    const OnSaveClick = (e)=>{
        API.patch(`/transformer-technical-information/${idRef.current}/`, UpdatedValue).then((response) => {
            toast.success("Success! Information updated successfully.");
        }).catch((err) => {
            
        }); 
    }

    useEffect(() => {
        dispatch(setReportId(params.reportId));
        API.get(`/transformer-technical-information/by-customer/${params.reportId}`).then((response) => {
            idRef.current = response?.data[0]?.id;
            setTransformerTechnicalInfo(response.data[0]);
        }).catch((err) => {
            console.log(err);
        });
    }, []);
    
    return (
        <div className="main-content">
            <ToastContainer />
            <div className="main-content-head">
                Transformer Technical Information
            </div>
            <ContentTable TableContent={HomePageContent} OnValueChange={OnValueChange}/>
            <NextPreviousButton OnSaveClick={OnSaveClick} State={NextPreviousButtonState} NextPrevLink={NextPrevLink} />
        </div>
    );
}

