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
    const [isSaving, setIsSaving] = useState(false);
    const [transformerBasicInfo, setTransformerBasicInfo] = useState();
    const VectorGroupDictList = {
        1 : ["Dd0", "YNyn0", "Dyn1", "YNd1", "Dyn11", "YNd11"],
        2 : ["Dd0yn0", "Dd0yn11", "Dd0yn1","Dd0yn5", "Dd0yn9", "Dd0yn7", "Dd0yn2"],
        3 : ["YNyn0d0", "YNyn0d11", "YNyn0d1", "YNyn0d5", "YNyn0d9", "YNyn0d7", "YNyn0d2"],
        4 : ["Dd0yn0", "Dd0yn11", "Dd0yn1","Dd0yn5", "Dd0yn9", "Dd0yn7", "Dd0yn2"],
    }

    const NumberOfWinding = {"Option": [1, 2, 3 , 4], "default":1}
    const [vectorGroupOption, setVectorGroupOption] = useState({"Option": ["Dd0", "YNyn0", "Dyn1", "YNd1", "Dyn11", "YNd11"], "default": 1});
    const VectorGroupOption = {"Option": VectorGroupDictList[1], "default": VectorGroupDictList[1][0]}
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
        // "VECTOR GROUP" : [vectorGroupOption, "option", "",""],
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
        "PHASE": { TableValuePlaceholder: "Phase", ValueType: "option", DefaultValue: transformerBasicInfo?.phase , OptionValue: PhaseOption, BackendName: "phase" },
        "No OF LV WINDING": { TableValuePlaceholder: "No of LV Windings", ValueType: "option", DefaultValue: transformerBasicInfo?.no_of_lv_winding, OptionValue: NumberOfWinding, ValueIntegralMIN: "1", BackendName: "no_of_lv_winding" },
        // "VECTOR GROUP": { TableValuePlaceholder: "Vector Group", ValueType: "option", DefaultValue: transformerBasicInfo?.vector_group , OptionValue: VectorGroupOption, BackendName: "vector_group" },
        "VECTOR GROUP": { TableValuePlaceholder: "Vector Group", ValueType: "text", DefaultValue: transformerBasicInfo?.vector_group , OptionValue: VectorGroupOption, BackendName: "vector_group" },
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

    const [UpdatedValue, setUpdatedValue] = useState({});
    const OnValueChange = (e)=>{
        console.log(e.target.name);
        if(e.target.name === 'tapping'){
            UpdatedValue[e.target.name] = e.target.value;

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
        if(e.target.name === 'no_of_lv_winding'){
            const NoOfWindingVectorGroupList = VectorGroupDictList[e.target.value]
            setHomePageContent((prev) => ({
                ...prev,
                "VECTOR GROUP": {
                    ...prev["VECTOR GROUP"],
                    OptionValue: {"Option": NoOfWindingVectorGroupList, "default": NoOfWindingVectorGroupList[0]},
                },
            }));
            UpdatedValue['vector_group'] = NoOfWindingVectorGroupList[0];
        }        

        setUpdatedValue((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));

    }

    useEffect(() => {
        console.log("running....")
    }, [homePageContent]);
    
    const OnSaveClick = (e)=>{
        if(Object.keys(UpdatedValue).length === 0){
            toast.info("Info! Nothing to save",{autoClose:1000})
            return
        }
        setIsSaving(true);
        API.patch(`/transformer-basic-information/${idRef.current}/`,UpdatedValue).then((response) => {
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
        API.get(`/transformer-basic-information/by-customer/${params.reportId}/`).then((response) => {
            idRef.current = response?.data[0]?.id;
            const RespData = response?.data[0];
            const isTappingReadOnly = RespData.tapping === "No" ? true : false; 
            setHomePageContent(
                (prev)=>({
                    ...prev,
                    "CAPACITY": { ...prev["CAPACITY"], DefaultValue: RespData.capacity, ReadOnly: true },
                    "HV VOLTAGE": { ...prev["HV VOLTAGE"], DefaultValue: RespData.hv_voltage },
                    "LV VOLTAGE": { ...prev["LV VOLTAGE"], DefaultValue: RespData.lv_voltage },
                    "PHASE": { ...prev["PHASE"], DefaultValue: RespData.phase },
                    "No OF LV WINDING": { ...prev["No OF LV WINDING"], DefaultValue: RespData.no_of_lv_winding },
                    "VECTOR GROUP": { ...prev["VECTOR GROUP"], DefaultValue: RespData.vector_group, OptionValue: {"Option": VectorGroupDictList[RespData.no_of_lv_winding], "default": RespData.vector_group} },
                    "TAPPING": { ...prev["TAPPING"], DefaultValue: RespData.tapping },
                    "TYPE OF TAPPING": { ...prev["TYPE OF TAPPING"], DefaultValue: RespData.type_of_tapping, ReadOnly: isTappingReadOnly },
                    "TAPPING ON": { ...prev["TAPPING ON"], DefaultValue: RespData.tapping_on, ReadOnly: isTappingReadOnly },
                    "TAPPING RANGE": { ...prev["TAPPING RANGE"], DefaultValue: RespData.tapping_range, ReadOnly: isTappingReadOnly },
                    "MIN": { ...prev["MIN"], DefaultValue: RespData.tapping_range_min, ReadOnly: isTappingReadOnly },
                    "MAX": { ...prev["MAX"], DefaultValue: RespData.tapping_range_max, ReadOnly: isTappingReadOnly },
                    "at %": { ...prev["at %"], DefaultValue: RespData.tapping_percentage_at, ReadOnly: isTappingReadOnly },
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
            <NextPreviousButton isSaving={isSaving} OnSaveClick={OnSaveClick} State={NextPreviousButtonState} NextPrevLink={NextPrevLink} />
        </div>
    );
}
