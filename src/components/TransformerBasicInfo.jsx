import React from 'react';
import ContentTable from './common/ContentTable';
import NextPreviousButton from './common/NextPreviousButton';

export default function TransformerBasicInfo() {
 // const HomePage = { CellName:[TableValuePlaceholder, ValueType, DefaultValue, ValueUnit, ValueIntegralMIN, ValueIntegralMIN] }
    const HomePageContent = {
        "CAPACITY" : ["Capacity", "number", "", "KVA", "1","315000"],
        "HV VOLTAGE" : ["HV Winding Voltage", "number","","VOLTS", "1"],
        "LV VOLTAGE" : ["LV Winding Voltage", "number", "" , "VOLTS", "1"],
        "VECTOR GROUP" : ["OPTION", "Text", "",""],
        "PHASE" : ["OPTION", "Text", "" ],
        "No OF LV WINDING" : ["OPTION", "number", "","","1"],
        "TAPPING" : ["OPTION", "number", "" ], // yes/no
        "TYPE OF TAPPING" : ["OPTION", "number", ""], // OCTC OLTC
        "TAPPING ON": ["Option", "number", "" ,""], // HV LV
        "TAPPING RANGE" : ["","hidden"], 
        "MIN" : ["Negative Voltage Variation", "number", "", "%", "", "-1"],
        "MAX" : ["Positive Voltage Variation", "number", "" ,"%", "1", ""],
        "at %" : ["at %","number","","","1",""],
        "RATED FREQUENCY": ["OPTION", "number", 50 ,"HZ"], // 50, 60
        "CONDUCTOR MATERIAL" : ["Option","text"] // Copper Aluminum
    };

    const NextPreviousButtonState = [false,false];
    const NextPrevLink = ["/","/transformer-information/"]
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
