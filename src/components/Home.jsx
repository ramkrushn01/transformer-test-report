import React from "react";
import ContentTable from "./common/ContentTable";
import "../css/home.css";
import NextPreviousButton from "./common/NextPreviousButton";

export default function Home() {
    // const HomePage = { CellName:[TableValuePlaceholder, ValueType, DefaultValue, ValueUnit] }
    const HomePageContent = {
        "NAME OF THE CONSUMER" : ["Consumer Name", "text", "",],
        "WORK ORDER NO" : ["Transformer Number", "text"],
        "CERTIFICATE NO" : ["Certificate Number", "text"],
        "TRANSFORMER MAKE" : ["Who make transformer", "text"],
        "SERIAL NO" : ["Serial Number", "text"],
        "RATING" : ["Transformer Rating", "text"],
        "REFERENCE STANDARD": ["Reference Standard", "text"],
        "TESTING DATE" : ["Testing Date", "date"],
        "REMARK" : ["Remark", "text"],
    };

    const NextPreviousButtonState = [true,false];
    const NextPrevLink = ["","/transformer-basic-info/"]
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
