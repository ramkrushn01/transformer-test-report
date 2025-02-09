import React from "react";
import "../../css/common/content-table.css";

export default function ContentTable(props) {
    const TableContent = props.TableContent;

    return (
        <div className="main-table-content">
            <table className="main-table">
                <tbody className="main-table-body">
                    {Object.entries(TableContent).map(([key, value], index) => (
                        <tr key={index} className="main-table-row">
                            <th className="main-table-head">
                                <label className="main-table-head-label" htmlFor={value}>{key}</label>
                            </th>
                            <td> : </td>
                            <td className="main-table-data">
                                { value[1] === "option" ?
                                <select className="main-table-data-input">
                                    {
                                        value[0]["Option"]?.map((item,index)=>(
                                            <option key={index} value={item}>{item}</option>
                                        ))
                                    }
                                </select>
                                :
                                    <input className="main-table-data-input" type={value[1]} placeholder={value[0]} defaultValue={value[2]} min={value[4]} max={value[5]} />
                                }
                            </td>
                            <td>{value[3]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
