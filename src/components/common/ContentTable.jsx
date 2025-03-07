import React from "react";
import "../../css/common/content-table.css";
import LoopInput from "./LoopInput";
import { nanoid } from "nanoid";

export default function ContentTable(props) {
    const TableContent = props?.TableContent;

    return (
        <div className="main-table-content">
            <table className="main-table">
                <tbody className="main-table-body">
                    {Object.entries(TableContent)?.map(([key, value], index) => (
                        <>
                        {
                            value?.ValueType === 'loop-input' ? (
                                <LoopInput key={nanoid()} DefaultValue={value?.DefaultValue} ReadOnly={value?.ReadOnly}/>
                            ) :
                            <tr key={index} className="main-table-row">
                            <th className="main-table-head">
                                <label className="main-table-head-label" htmlFor={value}>{key}</label>
                            </th>
                            <td> : </td>
                            <td className="main-table-data">
                                { value?.ValueType === "option" ?
                                <select className="main-table-data-input" name={value?.BackendName} onChange={(e)=>(props?.OnValueChange(e))}>
                                    {
                                        value?.OptionValue?.Option?.map((item,index)=>(
                                            <option selected={item===value?.DefaultValue} key={index} value={item}>{item}</option>
                                        ))
                                    }
                                </select>
                                :
                                    <input readOnly={value?.ReadOnly} onChange={(e)=>(props?.OnValueChange(e))} className="main-table-data-input" type={value?.ValueType} placeholder={value?.TableValuePlaceholder} defaultValue={value?.DefaultValue} min={value?.ValueIntegralMIN} max={value?.ValueIntegralMax} name={value?.BackendName} />
                                }
                            </td>
                            <td>{value?.ValueUnit}</td>
                        </tr>
                        }
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
