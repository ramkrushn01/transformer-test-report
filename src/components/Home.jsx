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
        "RATING": { TableValuePlaceholder: "Transformer Rating", ValueType: "text", DefaultValue: customerData?.rating, ValueUnit: "KVA", BackendName: "rating" },
        "REFERENCE STANDARD": { TableValuePlaceholder: "Reference Standard", ValueType: "text", DefaultValue: customerData?.reference_standard, BackendName: "reference_standard" },
        "TESTING DATE": { TableValuePlaceholder: "Testing Date", ValueType: "date", DefaultValue: customerData?.testing_date, BackendName: "testing_date" },
        "REMARK": { TableValuePlaceholder: "Remark", ValueType: "text", DefaultValue: customerData?.remark, BackendName: "remark" },
    };

    let UpdatedValue ={}

    const OnValueChange = (e)=>{
        UpdatedValue[e.target.name] = e.target.value;
    }

    const OnSaveClick = (e)=>{
        if(Object.keys(UpdatedValue).length === 0){
            toast.info("Info! Nothing to save",{autoClose:1000})
            return
        }
        setIsSaving(true);
        API.patch(`/customer-details/${idRef.current}/`,UpdatedValue).then((response) => {
            setIsSaving(false);
            toast.success("Success! Information updated successfully.");
            UpdatedValue = {};
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
