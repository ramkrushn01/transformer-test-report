import React, { useEffect } from 'react';
import ContentTable from './common/ContentTable';
import NextPreviousButton from './common/NextPreviousButton';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setReportId } from '../redux/features/reportIdSlice';

export default function TransformerBasicInfo() {
    const params = useParams();
    const dispatch = useDispatch();
 // const HomePage = { CellName:[TableValuePlaceholder, ValueType, DefaultValue, ValueUnit, ValueIntegralMIN, ValueIntegralMIN] }
    const VectorGroupOption = {"Option" : ["Dyn11", "Dyn1", "YNd11", "YNd1", "DdO", "YNyno"], "default": "Dyn11"}
    const PhaseOption = {"Option" : ["Single Phase", "Three Phase"], "default":"Three Phase"}
    // const NoOfLVWindingOption = {"Option": []}
    const TappingOption = {"Option": ["Yes","No"], "default":"Yes"}
    const TypeOfTappingOption = {"Option": ["OCTC","OLTC"], "default":"OCTC"}
    const TappingOnOption = {"Option": ["HV","LV"], "default":"HV"}
    const RatedFrequencyOption = {"Option": [50, 60], "default":50}
    const ConductorMaterialOption = {"Option": ["Copper", "Aluminum"], "default":"Copper"}

    const HomePageContent = {
        "CAPACITY" : ["Capacity", "number", "", "KVA", "1","315000"],
        "HV VOLTAGE" : ["HV Winding Voltage", "number","","VOLTS", "1"],
        "LV VOLTAGE" : ["LV Winding Voltage", "number", "" , "VOLTS", "1"],
        "VECTOR GROUP" : [VectorGroupOption, "option", "",""],
        "PHASE" : [PhaseOption, "option", "" ],
        "No OF LV WINDING" : ["No of LV Windings", "number", "","","1"],
        "TAPPING" : [TappingOption, "option", "" ], // yes/no
        "TYPE OF TAPPING" : [TypeOfTappingOption, "option", ""], // OCTC OLTC
        "TAPPING ON": [TappingOnOption, "option", "" ,""], // HV LV
        "TAPPING RANGE" : ["","hidden"], 
        "MIN" : ["Negative Voltage Variation", "number", "", "%", "", "-1"],
        "MAX" : ["Positive Voltage Variation", "number", "" ,"%", "1", ""],
        "at %" : ["at %","number","","","1",""],
        "RATED FREQUENCY": [RatedFrequencyOption, "option", 50 ,"HZ"], // 50, 60
        "CONDUCTOR MATERIAL" : [ConductorMaterialOption,"option"] // Copper Aluminum
    };

    const NextPreviousButtonState = [false,false];
    const NextPrevLink = [`/customer-details/${params.reportId}`,`/transformer-information/${params.reportId}`]

    useEffect(() => {
        dispatch(setReportId(params.reportId));
    }, []);

    return (
        <div className="main-content">
            <div className="main-content-head">
                Transformer Basic Information
            </div>
            <ContentTable TableContent={HomePageContent}/>
            <NextPreviousButton State={NextPreviousButtonState} NextPrevLink={NextPrevLink} />
        </div>
    );
}
