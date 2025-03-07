import { nanoid } from "nanoid";
import React from "react";

export default function LoopInput(props) {
    const DefaultValue = props?.DefaultValue ? JSON.parse(props?.DefaultValue) : JSON.parse("{}");
    const ReadOnly = props?.ReadOnly;

    const ConvertToLabel = (label)=>{
        return label
        .replace(/_/g, " ") // Replace underscores with spaces
        .split(" ") // Split into words
        .map(word => word.toUpperCase()) // Convert each word to uppercase
        .join(" "); // Join back into a string
    }

    return Object.entries(DefaultValue)?.map(([key, value], index) => (
        <tr key={nanoid()} className="main-table-row">
            <th className="main-table-head">
                <label htmlFor={value}>{ConvertToLabel(key)}</label>
            </th>
            <td> : </td>
            <td className="main-table-data">
                <input readOnly={ReadOnly} className="main-table-data-input" type="input" placeholder={ConvertToLabel(key)} defaultValue={value} min={value?.ValueIntegralMIN} max={value?.ValueIntegralMax} name={value?.BackendName} />
            </td>
        </tr>
    ));
}
