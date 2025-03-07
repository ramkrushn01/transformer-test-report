import React, { useEffect, useRef, useState } from 'react';
import ContentTable from './common/ContentTable';
import NextPreviousButton from './common/NextPreviousButton';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setReportId } from '../redux/features/reportIdSlice';
import API from '../api/custom_axios';
import { toast, ToastContainer } from 'react-toastify';

export default function TransformerBasicInfo() {
    const params = useParams();
    const dispatch = useDispatch();
    const idRef = useRef();
    const [transformerBasicInfo, setTransformerBasicInfo] = useState();
    const VectorGroupOption = {"Option" : ["Dyn11", "Dyn1", "YNd11", "YNd1", "DdO", "YNyno"], "default": "Dyn11"}
    const PhaseOption = {"Option" : ["Single Phase", "Three Phase"], "default":"Three Phase"}
    const TappingOption = {"Option": ["Yes","No"], "default":"Yes"}
    const TypeOfTappingOption = {"Option": ["OCTC","OLTC"], "default":"OCTC"}
    const TappingOnOption = {"Option": ["HV","LV"], "default":"HV"}
    const RatedFrequencyOption = {"Option": [50, 60], "default":50}
    const ConductorMaterialOption = {"Option": ["Copper", "Aluminum"], "default":"Copper"}

    const [homePageContent, setHomePageContent] = useState({
        // "CAPACITY" : ["Capacity", "number", "", "KVA", "1","315000"], 
        // "HV VOLTAGE" : ["HV Winding Voltage", "number","","VOLTS", "1"],
        // "LV VOLTAGE" : ["LV Winding Voltage", "number", "" , "VOLTS", "1"],
        // "VECTOR GROUP" : [VectorGroupOption, "option", "",""],
        // "PHASE" : [PhaseOption, "option", "" ],
        // "No OF LV WINDING" : ["No of LV Windings", "number", "","","1"],
        // "TAPPING" : [TappingOption, "option", "" ], // yes/no
        // "TYPE OF TAPPING" : [TypeOfTappingOption, "option", ""], // OCTC OLTC
        // "TAPPING ON": [TappingOnOption, "option", "" ,""], // HV LV
        // "TAPPING RANGE" : ["","hidden"], 
        // "MIN" : ["Negative Voltage Variation", "number", "", "%", "", "-1"],
        // "MAX" : ["Positive Voltage Variation", "number", "" ,"%", "1", ""],
        // "at %" : ["at %","number","","","1",""],
        // "RATED FREQUENCY": [RatedFrequencyOption, "option", 50 ,"HZ"], // 50, 60
        // "CONDUCTOR MATERIAL" : [ConductorMaterialOption,"option"] // Copper Aluminum

        "CAPACITY" : {TableValuePlaceholder: "Capacity", ValueType: "number", DefaultValue: transformerBasicInfo?.capacity, ValueUnit: "KVA", ValueIntegralMIN: "1", ValueIntegralMAX: "315000", BackendName: "capacity"},
        "HV VOLTAGE": { TableValuePlaceholder: "HV Winding Voltage", ValueType: "number", DefaultValue: transformerBasicInfo?.hv_voltage, ValueUnit: "VOLTS", ValueIntegralMIN: "1", BackendName: "hv_voltage" },
        "LV VOLTAGE": { TableValuePlaceholder: "LV Winding Voltage", ValueType: "number", DefaultValue: transformerBasicInfo?.lv_voltage, ValueUnit: "VOLTS", ValueIntegralMIN: "1", BackendName: "lv_voltage" },
        "VECTOR GROUP": { TableValuePlaceholder: "Vector Group", ValueType: "option", DefaultValue: transformerBasicInfo?.vector_group , OptionValue: VectorGroupOption, BackendName: "vector_group" },
        "PHASE": { TableValuePlaceholder: "Phase", ValueType: "option", DefaultValue: transformerBasicInfo?.phase , OptionValue: PhaseOption, BackendName: "phase" },
        "No OF LV WINDING": { TableValuePlaceholder: "No of LV Windings", ValueType: "number", DefaultValue: transformerBasicInfo?.no_of_lv_winding, ValueIntegralMIN: "1", BackendName: "no_of_lv_winding" },
        "TAPPING": { TableValuePlaceholder: "Tapping", ValueType: "option", DefaultValue: transformerBasicInfo?.tapping , OptionValue: TappingOption, BackendName: "tapping" }, // yes/no
        "TYPE OF TAPPING": { TableValuePlaceholder: "Type of Tapping", ValueType: "option", DefaultValue: transformerBasicInfo?.type_of_tapping , OptionValue: TypeOfTappingOption, BackendName: "type_of_tapping" }, // OCTC OLTC
        "TAPPING ON": { TableValuePlaceholder: "Tapping On", ValueType: "option", DefaultValue: transformerBasicInfo?.tapping_on , OptionValue: TappingOnOption, BackendName: "tapping_on" }, // HV LV
        "TAPPING RANGE": { TableValuePlaceholder: "", ValueType: "hidden", DefaultValue: transformerBasicInfo?.tapping_range, BackendName: "tapping_range" },
        "MIN": { TableValuePlaceholder: "Negative Voltage Variation", ValueType: "number", DefaultValue: transformerBasicInfo?.tapping_range_min, ValueUnit: "%", ValueIntegralMIN: "-1", BackendName: "tapping_range_min" },
        "MAX": { TableValuePlaceholder: "Positive Voltage Variation", ValueType: "number", DefaultValue: transformerBasicInfo?.tapping_range_max, ValueUnit: "%", ValueIntegralMAX: "1", BackendName: "tapping_range_max" },
        "at %": { TableValuePlaceholder: "at %", ValueType: "number", DefaultValue: transformerBasicInfo?.tapping_percentage_at, ValueIntegralMIN: "1", BackendName: "tapping_percentage_at" },
        "RATED FREQUENCY": { TableValuePlaceholder: "Rated Frequency", ValueType: "option", DefaultValue: transformerBasicInfo?.rated_frequency , OptionValue: RatedFrequencyOption, ValueUnit: "HZ", BackendName: "rated_frequency" }, // 50, 60
        "CONDUCTOR MATERIAL": { TableValuePlaceholder: "Conductor Material", ValueType: "option", DefaultValue: transformerBasicInfo?.conductor_material , OptionValue: ConductorMaterialOption, BackendName: "conductor_material" } // Copper, Aluminum
    });

    const NextPreviousButtonState = [false,false];
    const NextPrevLink = [`/customer-details/${params.reportId}`,`/transformer-information/${params.reportId}`]

    const UpdatedValue = {}
    const OnValueChange = (e)=>{
        if(e.target.name === 'tapping'){
            console.log(e.target.value)
            const tapping = e.target.value === "Yes" ? false : true
            setHomePageContent((prev) => ({
                ...prev,
                "TYPE OF TAPPING": {
                    ...prev["TYPE OF TAPPING"],
                    ReadOnly: tapping
                },
                "TAPPING ON": {
                    ...prev["TAPPING ON"],
                    ReadOnly: tapping
                },
                "MIN": {
                    ...prev["MIN"],
                    ReadOnly: tapping,
                },
                "MAX": {
                    ...prev["MAX"],
                    ReadOnly: tapping
                },
                "at %": {
                    ...prev["at %"],
                    ReadOnly: tapping
                }}))
        }

        UpdatedValue[e.target.name] = e.target.value;
    }
    
    const OnSaveClick = (e)=>{
        API.patch(`/transformer-basic-information/${idRef.current}/`,UpdatedValue).then((response) => {
            toast.success("Success! Information updated successfully.");
        }).catch((err) => {
            
        });
    }

    useEffect(() => {
        dispatch(setReportId(params.reportId));
        API.get(`/transformer-basic-information/by-customer/${params.reportId}/`).then((response) => {
            idRef.current = response?.data[0]?.id;
            const RespData = response?.data[0];
            setHomePageContent(
                (prev)=>({
                    ...prev,
                    "CAPACITY": { ...prev["CAPACITY"], DefaultValue: RespData.capacity },
                    "HV VOLTAGE": { ...prev["HV VOLTAGE"], DefaultValue: RespData.hv_voltage },
                    "LV VOLTAGE": { ...prev["LV VOLTAGE"], DefaultValue: RespData.lv_voltage },
                    "VECTOR GROUP": { ...prev["VECTOR GROUP"], DefaultValue: RespData.vector_group },
                    "PHASE": { ...prev["PHASE"], DefaultValue: RespData.phase },
                    "No OF LV WINDING": { ...prev["No OF LV WINDING"], DefaultValue: RespData.no_of_lv_winding },
                    "TAPPING": { ...prev["TAPPING"], DefaultValue: RespData.tapping },
                    "TYPE OF TAPPING": { ...prev["TYPE OF TAPPING"], DefaultValue: RespData.type_of_tapping },
                    "TAPPING ON": { ...prev["TAPPING ON"], DefaultValue: RespData.tapping_on },
                    "TAPPING RANGE": { ...prev["TAPPING RANGE"], DefaultValue: RespData.tapping_range },
                    "MIN": { ...prev["MIN"], DefaultValue: RespData.tapping_range_min },
                    "MAX": { ...prev["MAX"], DefaultValue: RespData.tapping_range_max },
                    "at %": { ...prev["at %"], DefaultValue: RespData.tapping_percentage_at },
                    "RATED FREQUENCY": { ...prev["RATED FREQUENCY"], DefaultValue: RespData.rated_frequency },
                    "CONDUCTOR MATERIAL": { ...prev["CONDUCTOR MATERIAL"], DefaultValue: RespData.conductor_material },
                })
            )
            setTransformerBasicInfo(response.data[0]);
        }).catch((err) => {
            
        });
    }, []);

    return (
        <div className="main-content">
            <ToastContainer/>
            <div className="main-content-head">
                Transformer Basic Information
            </div>
            <ContentTable TableContent={homePageContent} OnValueChange={OnValueChange}/>
            <NextPreviousButton OnSaveClick={OnSaveClick} State={NextPreviousButtonState} NextPrevLink={NextPrevLink} />
        </div>
    );
}
