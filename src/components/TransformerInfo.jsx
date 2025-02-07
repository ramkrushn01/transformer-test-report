import React from "react";
import ContentTable from "./common/ContentTable";
import "../css/home.css";
import NextPreviousButton from "./common/NextPreviousButton";

export default function Home() {
    // const HomePage = { CellName:[TableValuePlaceholder, ValueType, DefaultValue, ValueUnit] }
    const HomePageContent = {
        "RATED CAPACITY" : ["Rated Capacity", "number", "", "KVA"],
        "RATED VOLTAGE HV" : ["Rated Voltage On HV Winding", "number","","VOLTS"],
        "RATED VOLTAGE LV1" : ["Rated Voltage In LV1 Winding", "number", "" , "VOLTS"],
        "RATED VOLTAGE LV2" : ["Rated Voltage In LV2 Winding", "number", "" , "VOLTS"],
        "RATED CURRENT HV" : ["Rated Current In HV Winding", "number", "" ,"AMPS"],
        "RATED CURRENT LV1" : ["Rated Current In LV1 Winding", "number", "" ,"AMPS"],
        "RATED CURRENT LV2" : ["Rated Current In LV2 Winding", "number", "" ,"AMPS"],
        "RATED FREQUENCY": ["Rated Frequency", "number", 50 ,"HZ"],
        "VECTOR GROUP" : ["Vector Group", "Text", "",""],
        "VOLTAGE VARIATION" : ["Voltage Variation", "text"],
    };

    const NextPreviousButtonState = [false,false];
    const NextPrevLink = ["/","/transformer-information/"]
    return (
        <div className="main-content">
            <ContentTable TableContent={HomePageContent}/>
            <NextPreviousButton State={NextPreviousButtonState} NextPrevLink={NextPrevLink} />
        </div>
    );
}
