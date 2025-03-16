import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { setReportId } from "../redux/features/reportIdSlice";
import API from "../api/custom_axios";
import NextPreviousButton from "./common/NextPreviousButton";
import { nanoid } from "nanoid";

export default function MeasurementOfWindingResistance() {
    const dispatch = useDispatch();
    const params = useParams();
    const idRef = useRef();
    const [isSaving, setIsSaving] = useState(false);
    const [isAnyDataChange, setIsAnyDataChange] = useState(false);
    const activeInputRef = useRef(null);
    const [averageOilTemperature, setAverageOilTemperature] = useState();
    const [primaryWindingResistanceUnit, setPrimaryWindingResistanceUnit] =
        useState();
    const [secondaryWindingResistanceUnit, setSecondaryWindingResistanceUnit] =
        useState();
    const [primaryWindingTable, setPrimaryWindingTable] = useState({});
    const [secondaryWindingTable, setSecondaryWindingTable] = useState({});
    const KConstant = useRef();

    const OnSaveClick = (e) => {
        if (!isAnyDataChange) {
            toast.info("Info! Nothing to save", { autoClose: 1000 });
            return;
        }
        setIsSaving(true);
        API.patch(`/measurement-of-winding-resistance/${idRef.current}/`, {
            average_oil_temperature: averageOilTemperature,
            primary_winding_resistance_unit: primaryWindingResistanceUnit,
            secondary_winding_resistance_unit: secondaryWindingResistanceUnit,
            primary_winding_table: primaryWindingTable,
            secondary_winding_table: secondaryWindingTable,
        })
            .then((response) => {
                setIsSaving(false);
                toast.success("Success! Information updated successfully.");
                setIsAnyDataChange(false);
            })
            .catch((err) => {
                setIsSaving(false);
                toast.error(`Error! ${err}`);
            });
    };

    const OnPrimaryResistanceUnitChange = (e) => {
        setIsAnyDataChange(true);
        setPrimaryWindingResistanceUnit(e.target.value);
    };

    const OnSecondaryResistanceUnitChange = (e) => {
        setIsAnyDataChange(true);
        setSecondaryWindingResistanceUnit(e.target.value);
    };

    const OnAverageOilTemperatureChange = (e) => {
        setIsAnyDataChange(true);
        setAverageOilTemperature(e.target.value);

        Object.entries(primaryWindingTable)?.map(([key,value],index)=>{
            const K_Const = KConstant.current;
            const AverageOilTemperature = parseFloat(e.target.value);
            const RAvg = parseFloat(value['Ravg']);
            const CalculatedAvgResistanceAt75degSent = (((K_Const + 75) / (K_Const + AverageOilTemperature)) * RAvg).toFixed(4);  
            value["Avg. Resistance at 75°C"] = CalculatedAvgResistanceAt75degSent; 
        });

        Object.entries(secondaryWindingTable).map(([table_name, table_content], index)=>{
            Object.entries(table_content)?.map(([key_i,value_i],index)=>{
                const K_Const = KConstant.current;
                const AverageOilTemperature = parseFloat(e.target.value);
                const RAvg = parseFloat(value_i['Ravg']);
                const CalculatedAvgResistanceAt75degSent = (((K_Const + 75) / (K_Const + AverageOilTemperature)) * RAvg).toFixed(4);  
                secondaryWindingTable[table_name][key_i]["Avg. Resistance at 75°C"] = CalculatedAvgResistanceAt75degSent; 
            });
        });

        setPrimaryWindingTable(primaryWindingTable);
    };

    const OnPrimaryWindingTableChange = (e) => {
        const ColumnName = e.target.name;
        const RowName = e.target.dataset.rowName;
        const NewValue = e.target.value;

        const NewPrimaryWindingTable = { ...primaryWindingTable };
        NewPrimaryWindingTable[ColumnName][RowName] = NewValue;

        const CalculatedRavgValue =
            ((parseFloat(NewPrimaryWindingTable[ColumnName][
                `${Object.keys(NewPrimaryWindingTable[ColumnName])[0]}`
            ]) + parseFloat(
            NewPrimaryWindingTable[ColumnName][
                `${Object.keys(NewPrimaryWindingTable[ColumnName])[1]}`
            ]) + parseFloat(
            NewPrimaryWindingTable[ColumnName][
                `${Object.keys(NewPrimaryWindingTable[ColumnName])[2]}`
            ]))/3
        ).toFixed(4);

        const CalculatedAvgResistanceAt75degSent = (((KConstant.current + 75) / (KConstant.current + averageOilTemperature)) * CalculatedRavgValue).toFixed(4);

        NewPrimaryWindingTable[ColumnName]['Ravg'] = CalculatedRavgValue;
        NewPrimaryWindingTable[ColumnName]['Avg. Resistance at 75°C'] = CalculatedAvgResistanceAt75degSent;
        setPrimaryWindingTable(NewPrimaryWindingTable);
        setIsAnyDataChange(true);
    };

    const OnSecondaryWindingTableChange = (e) => {
        const TableName = e.target.dataset.tableName;
        const ColumnName = e.target.name;
        const RowName = e.target.dataset.rowName;
        const NewValue = e.target.value;

        const NewSecondaryWindingTable = { ...secondaryWindingTable };
        NewSecondaryWindingTable[TableName][ColumnName][RowName] = NewValue;

        const CalculatedRavgValue =
            ((parseFloat(NewSecondaryWindingTable[TableName][ColumnName][
                `${Object.keys(NewSecondaryWindingTable[TableName][ColumnName])[0]}`
            ]) + parseFloat(
                NewSecondaryWindingTable[TableName][ColumnName][
                `${Object.keys(NewSecondaryWindingTable[TableName][ColumnName])[1]}`
            ]) + parseFloat(
                NewSecondaryWindingTable[TableName][ColumnName][
                `${Object.keys(NewSecondaryWindingTable[TableName][ColumnName])[2]}`
            ]))/3
        ).toFixed(4);

        const CalculatedAvgResistanceAt75degSent = (((KConstant.current + 75) / (KConstant.current + averageOilTemperature)) * CalculatedRavgValue).toFixed(4);


        NewSecondaryWindingTable[TableName][ColumnName]['Ravg'] = CalculatedRavgValue;
        NewSecondaryWindingTable[TableName][ColumnName]['Avg. Resistance at 75°C'] = CalculatedAvgResistanceAt75degSent;
        
        setSecondaryWindingTable(NewSecondaryWindingTable);
        setIsAnyDataChange(true);
    };

    useEffect(() => {
        dispatch(setReportId(params.reportId));
        API.get(
            `/measurement-of-winding-resistance/by-customer/${params.reportId}/`
        )
            .then((response) => {
                const resp_data = response?.data[0];
                idRef.current = resp_data.id;
                setAverageOilTemperature(resp_data.average_oil_temperature);
                setPrimaryWindingResistanceUnit(
                    resp_data.primary_winding_resistance_unit
                );
                setSecondaryWindingResistanceUnit(
                    resp_data.secondary_winding_resistance_unit
                );
                setPrimaryWindingTable(resp_data.primary_winding_table);
                setSecondaryWindingTable(resp_data.secondary_winding_table);
                KConstant.current =
                    resp_data.conductor_material.toLowerCase() === "copper"
                        ? 235
                        : 225;
            })
            .catch((err) => {});
    }, []);

    useEffect(() => {
        document.getElementById(activeInputRef.current)?.focus();
    }, [primaryWindingTable, secondaryWindingTable]);

    const NextPreviousButtonState = [false, true];
    const NextPrevLink = [
        `/magnetic-balance-and-magnetizing-current-test/${params.reportId}`,
        `/vector-group-test/${params.reportId}`,
    ];

    return (
        <div className="main-content winding-resistance">
            <ToastContainer />
            <div className="main-content-head">
                Measurement of Winding Resistance
            </div>
            <div className="head-info">
                <table className="test-main-table">
                    <tbody className="test-main-table-body">
                        <tr>
                            <td>
                                <label
                                    htmlFor="primary-winding-resistance"
                                    className="main-label">
                                    PRIMARY WINDING RESISTANCE UNIT:{" "}
                                </label>
                            </td>
                            <td>
                                <select
                                    onChange={OnPrimaryResistanceUnitChange}
                                    id="primary-winding-resistance"
                                    className="main-input"
                                    value={primaryWindingResistanceUnit}
                                    name="primary_winding_resistance_unit">
                                    <option value="mΩ">mΩ (Miliohms)</option>
                                    <option value="Ω">Ω (Ohms)</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label
                                    htmlFor="secondary-winding-resistance"
                                    className="main-label">
                                    SECONDARY WINDING RESISTANCE UNIT:{" "}
                                </label>
                            </td>
                            <td>
                                <select
                                    onChange={OnSecondaryResistanceUnitChange}
                                    id="secondary-winding-resistance"
                                    className="main-input"
                                    value={secondaryWindingResistanceUnit}
                                    name="secondary_winding_resistance_unit">
                                    <option value="mΩ">mΩ (Miliohms)</option>
                                    <option value="Ω">Ω (Ohms)</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label
                                    htmlFor="avg-oil-temp"
                                    className="main-label">
                                    Avg. OIL TEMPERATURE (°C):
                                </label>
                            </td>
                            <td>
                                <input
                                    id="avg-oil-temp"
                                    type="number"
                                    value={averageOilTemperature}
                                    onChange={OnAverageOilTemperatureChange}
                                    name="average_oil_temperature"
                                    className="main-input"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* report table */}
                <h3 className="table-name">Primary Winding</h3>
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>TAP NO</th>
                            {Object.keys(
                                primaryWindingTable?.[
                                    Object.keys(primaryWindingTable || {})[0]
                                ] || {}
                            )?.map((key) => (
                                <th key={nanoid()}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(primaryWindingTable).map(
                            ([key, value], index) => (
                                <tr key={nanoid()}>
                                    <td>{key}</td>
                                    {Object.entries(value).map(
                                        ([key_i, value_i], index) => (
                                            <td key={nanoid()}>
                                                {
                                                    (key_i.toLowerCase() === 'ravg' || key_i.toLowerCase() === 'avg. resistance at 75°c' ) ? value_i
                                                    : 
                                                        <input
                                                            id={`${key}_${key_i}`}
                                                            onFocus={(e) => {
                                                                activeInputRef.current =
                                                                    e.target.id;
                                                            }}
                                                            type="number"
                                                            value={value_i}
                                                            data-row-name={key_i}
                                                            name={key}
                                                            onChange={
                                                                OnPrimaryWindingTableChange
                                                            }
                                                        />
                                                }
                                            </td>
                                        )
                                    )}
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
                <h3 className="table-name">Secondary Winding</h3>
                {Object.entries(secondaryWindingTable).map(
                    ([table_name, table_content], index) => (
                        <>
                            <h3 key={nanoid()} className="table-name">
                                {/* {table_name} */}
                            </h3>
                            <p>{table_name}</p>
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        {Object.entries(
                                            table_content[
                                                Object.keys(table_content)[0]
                                            ]
                                        ).map(([row_name]) => (
                                            <th key={nanoid()}>{row_name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(table_content).map(
                                        ([key, value], index) => (
                                            <tr>
                                                {Object.entries(value).map(
                                                    (
                                                        [key_i, value_i],
                                                        index
                                                    ) => (
                                                        <td>
                                                            {
                                                                (key_i.toLowerCase() === 'ravg' || key_i.toLowerCase() === 'avg. resistance at 75°c' ) ?
                                                                 value_i : 
                                                                <input
                                                                    type="number"
                                                                    id={`${table_name}_${key}_${key_i}`}
                                                                    title={`${key} ${key_i}`}
                                                                    value={value_i}
                                                                    data-row-name={
                                                                        key_i
                                                                    }
                                                                    name={key}
                                                                    data-table-name={
                                                                        table_name
                                                                    }
                                                                    onChange={
                                                                        OnSecondaryWindingTableChange
                                                                    }
                                                                    onFocus={(
                                                                        e
                                                                    ) => {
                                                                        activeInputRef.current =
                                                                            e.target.id;
                                                                    }}
                                                                />
                                                            }
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </>
                    )
                )}
            </div>
            <NextPreviousButton
                isSaving={isSaving}
                OnSaveClick={OnSaveClick}
                State={NextPreviousButtonState}
                NextPrevLink={NextPrevLink}
            />
        </div>
    );
}
