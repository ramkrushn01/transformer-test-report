import React, { useEffect, useRef, useState } from "react";
import ContentTable from "./common/ContentTable";
import "../css/home.css";
import NextPreviousButton from "./common/NextPreviousButton";
import { useParams } from "react-router-dom";
import API from "../api/custom_axios";
import { useDispatch } from "react-redux";
import { setReportId } from "../redux/features/reportIdSlice";
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
    const params = useParams('reportId');
    const dispatch = useDispatch();
    const idRef = useRef();
    const [isSaving, setIsSaving] = useState(false);
    // console.log(params.reportId);
    const [customerData, setCustomerData] = useState();
    const ReferenceStandardOption = {"Option" : ["IEC 60076", "IEC 60289", "IEC 61378", "IS 2026", "IS 1180", "IS 3156", "ANSI/IEEE C57.12.00", "ANSI/IEEE C57.12.90", "ANSI/IEEE C57.13", "EN 60076", "EN 60289", "EN 61378", "BS 171", "GB/T 6451", "JIS C2101"] }
    // const HomePage = { CellName:[TableValuePlaceholder, ValueType, DefaultValue, ValueUnit] }
    const HomePageContent = {
        // "NAME OF THE CONSUMER" : ["Consumer Name", "text", customerData?.customer_name,], 
        // "WORK ORDER NO" : ["Transformer Number", "text", customerData?.work_order_number],
        // "CERTIFICATE NO" : ["Certificate Number", "text", customerData?.certificate_number],
        // "TRANSFORMER MAKE" : ["Who make transformer", "text", customerData?.transformer_make],
        // "SERIAL NO" : ["Serial Number", "text", customerData?.serial_number],
        // "RATING" : ["Transformer Rating", "text", customerData?.rating, "KVA"],
        // "REFERENCE STANDARD": ["Reference Standard", "text", customerData?.reference_standard],
        // "TESTING DATE" : ["Testing Date", "date", customerData?.testing_date],
        // "REMARK" : ["Remark", "text", customerData?.remark],

        "NAME OF THE CONSUMER": {TableValuePlaceholder: "Customer Name", ValueType: "text", DefaultValue: customerData?.customer_name, BackendName: "customer_name"},
        "WORK ORDER NO": { TableValuePlaceholder: "Transformer Number", ValueType: "text", DefaultValue: customerData?.work_order_number, BackendName: "work_order_number" },
        "CERTIFICATE NO": { TableValuePlaceholder: "Certificate Number", ValueType: "text", DefaultValue: customerData?.certificate_number, BackendName: "certificate_number" },
        "TRANSFORMER MAKE": { TableValuePlaceholder: "Who make transformer", ValueType: "text", DefaultValue: customerData?.transformer_make, BackendName: "transformer_make" },
        "SERIAL NO": { TableValuePlaceholder: "Serial Number", ValueType: "text", DefaultValue: customerData?.serial_number, BackendName: "serial_number" },
        "RATING": { TableValuePlaceholder: "Transformer Rating", ValueType: "number", DefaultValue: customerData?.rating, ValueUnit: "KVA", BackendName: "rating" },
        "REFERENCE STANDARD": { TableValuePlaceholder: "Reference Standard", ValueType: "option", DefaultValue: customerData?.reference_standard, BackendName: "reference_standard", OptionValue: ReferenceStandardOption },
        "TESTING DATE": { TableValuePlaceholder: "Testing Date", ValueType: "date", DefaultValue: customerData?.testing_date, BackendName: "testing_date" },
        "REMARK": { TableValuePlaceholder: "Remark", ValueType: "text", DefaultValue: customerData?.remark, BackendName: "remark" },
    };

    let [UpdatedValue, setUpdatedValue] = useState({});

    const OnValueChange = (e)=>{
        setUpdatedValue((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const OnSaveClick = (e)=>{
        console.log(UpdatedValue);
        if(Object.keys(UpdatedValue).length === 0){
            toast.info("Info! Nothing to save",{autoClose:1000})
            return
        }
        setIsSaving(true);
        API.patch(`/customer-details/${idRef.current}/`,UpdatedValue).then((response) => {
            setIsSaving(false);
            toast.success("Success! Information updated successfully.");
            setUpdatedValue({});
        }).catch((err) => {
            setIsSaving(false);
            toast.error(`Error! ${err}`);
        });
    }

    useEffect(() => {
    dispatch(setReportId(params.reportId));
      API.get(`/customer-details/${params.reportId}/`).then((response) => {
        idRef.current = response?.data?.id;
        setCustomerData(response.data);
      }).catch((err) => {
        
      });
    
    }, []);
    

    const NextPreviousButtonState = [true,false];
    const NextPrevLink = ["",`/transformer-basic-info/${params.reportId}`]
    return (
        <div className="main-content">
            <ToastContainer/>
            <div className="main-content-head">
                Customer Details
            </div>
            <ContentTable TableContent={HomePageContent} OnValueChange={OnValueChange} />
            <NextPreviousButton isSaving={isSaving} OnSaveClick={OnSaveClick} State={NextPreviousButtonState} NextPrevLink={NextPrevLink} />
        </div>
    );
}
