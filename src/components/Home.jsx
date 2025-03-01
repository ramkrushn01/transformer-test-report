import React, { useEffect, useState } from "react";
import ContentTable from "./common/ContentTable";
import "../css/home.css";
import NextPreviousButton from "./common/NextPreviousButton";
import { useParams } from "react-router-dom";
import API from "../api/custom_axios";
import { useDispatch } from "react-redux";
import { setReportId } from "../redux/features/reportIdSlice";

export default function Home() {
    const params = useParams('reportId');
    const dispatch = useDispatch();
    // console.log(params.reportId);
    const [customerData, setCustomerData] = useState();
    // const HomePage = { CellName:[TableValuePlaceholder, ValueType, DefaultValue, ValueUnit] }
    const HomePageContent = {
        "NAME OF THE CONSUMER" : ["Consumer Name", "text", customerData?.customer_name,],
        "WORK ORDER NO" : ["Transformer Number", "text", customerData?.work_order_number],
        "CERTIFICATE NO" : ["Certificate Number", "text", customerData?.certificate_number],
        "TRANSFORMER MAKE" : ["Who make transformer", "text", customerData?.transformer_make],
        "SERIAL NO" : ["Serial Number", "text", customerData?.serial_number],
        "RATING" : ["Transformer Rating", "text", customerData?.rating],
        "REFERENCE STANDARD": ["Reference Standard", "text", customerData?.reference_standard],
        "TESTING DATE" : ["Testing Date", "date", customerData?.testing_date],
        "REMARK" : ["Remark", "text", customerData?.remark],
    };

    useEffect(() => {
    dispatch(setReportId(params.reportId));
      API.get(`/customer-details/${params.reportId}`).then((response) => {
        setCustomerData(response.data);
        // console.log(response.data)
      }).catch((err) => {
        
      });
    
    }, []);
    

    const NextPreviousButtonState = [true,false];
    const NextPrevLink = ["",`/transformer-basic-info/${params.reportId}`]
    return (
        <div className="main-content">
            <div className="main-content-head">
                Customer Details
            </div>
            <ContentTable TableContent={HomePageContent}/>
            <NextPreviousButton State={NextPreviousButtonState} NextPrevLink={NextPrevLink} />
        </div>
    );
}
