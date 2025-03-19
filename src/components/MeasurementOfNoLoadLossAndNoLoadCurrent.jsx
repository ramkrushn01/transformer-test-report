import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { setReportId } from "../redux/features/reportIdSlice";
import { useParams } from "react-router-dom";
import "../css/measurement-of-no-load-loss-and-no-load-current.css";
import API from "../api/custom_axios";
import NextPreviousButton from "./common/NextPreviousButton";

export default function MeasurementOfNoLoadLossAndNoLoadCurrent() {
    const dispatch = useDispatch();
    const params = useParams();
    const idRef = useRef();
    const activeInputRef = useRef(null);
    const [isAnyDataChange, setIsAnyDataChange] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [transformerEnergizedFrom, setTransformerEnergizedFrom] = useState({
        side: null,
        value: null,
        unit: null,
    });

    const [ptr, setPtr] = useState({
        primary_side: null,
        secondary_side: null,
        resultant: null,
    });

    const [ctr, setCtr] = useState({
        primary_side: null,
        secondary_side: null,
        resultant: null,
    });

    const [mf, setMf] = useState(NaN);

    const [hVPhaseRatedCurrent, setHVPhaseRatedCurrent] = useState(NaN);

    const [noLoadCurrentPercentage, setNoLoadCurrentPercentage] = useState(NaN);
    const [excitationAt90PercentageTable, setExcitationAt90PercentageTable] =
        useState(excitation_at__percentage_table);

    const [excitationAt100PercentageTable, setExcitationAt100PercentageTable] =
        useState(excitation_at__percentage_table);
    const [excitationAt110PercentageTable, setExcitationAt110PercentageTable] =
        useState(excitation_at__percentage_table);

    const [noLoadLoss90Per, setNoLoadLoss90Per] = useState(NaN);
    const [noLoadLoss100Per, setNoLoadLoss100Per] = useState(NaN);
    const [noLoadLoss110Per, setNoLoadLoss110Per] = useState(NaN);

    const OnTransformerEnergizedFromChange = (e) => {
        setIsAnyDataChange(true);
        setTransformerEnergizedFrom((prev) => ({
            ...transformerEnergizedFrom,
            [e.target.name]: e.target.value,
        }));
    };

    const OnPtrChange = (e) => {
        setIsAnyDataChange(true);
        const Resultant = (
            e.target.name === "primary_side"
                ? e.target.value / ptr.secondary_side
                : ptr.primary_side / e.target.value
        ).toFixed(4);

        setPtr((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
            resultant: Resultant,
        }));
        setMf((parseFloat(Resultant) / parseFloat(ctr.resultant)).toFixed(4));
    };

    const OnCtrChange = (e) => {
        setIsAnyDataChange(true);
        const Resultant = (
            e.target.name === "primary_side"
                ? e.target.value / ptr.secondary_side
                : ptr.primary_side / e.target.value
        ).toFixed(4);

        setCtr((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
            resultant: Resultant,
        }));
        setMf((parseFloat(ptr.resultant) / parseFloat(Resultant)).toFixed(4));
    };

    const OnHVPhaseRatedCurrentChange = (e) => {
        setHVPhaseRatedCurrent(e.target.value);
    };

    const NoLoadCurrentPercentageChange = (e) => {
        setNoLoadCurrentPercentage(e.target.value);
    };

    const OnExcitation__PercentageTableChange = (e) => {
        setIsAnyDataChange(true);
        const TableName = e.target.dataset.tableName;
        const RowName = e.target.dataset.rowName;
        const ColumnName = e.target.name;
        const NewValue = e.target.value;
        var UpdatedExcitationAt__PercentageTable;
        if (TableName === "excitation_at_90_percentage_table") {
            UpdatedExcitationAt__PercentageTable = { ...excitationAt90PercentageTable };
        } else if (TableName === "excitation_at_100_percentage_table") {
            UpdatedExcitationAt__PercentageTable = { ...excitationAt100PercentageTable };
        } else if (TableName === "excitation_at_110_percentage_table") {
            UpdatedExcitationAt__PercentageTable = { ...excitationAt110PercentageTable };
        }        
        UpdatedExcitationAt__PercentageTable[ColumnName][RowName] = NewValue;

        const RowPrefix = RowName.charAt(0);
        var CalculatedAvg = 0;
        if (RowPrefix === "V" || RowPrefix === "I") {
            for (let i = 1; i < 4; i++) {
                CalculatedAvg =
                    parseFloat(
                        UpdatedExcitationAt__PercentageTable[ColumnName][
                            `${RowPrefix}${i}`
                        ]
                    ) + parseFloat(CalculatedAvg);
            }
            CalculatedAvg = (parseFloat(CalculatedAvg) / 3).toFixed(4);
            UpdatedExcitationAt__PercentageTable[ColumnName]["Avg"] =
                CalculatedAvg;
            if (RowPrefix === "V") {
                UpdatedExcitationAt__PercentageTable[ColumnName]["V Applied"] =
                    (
                        parseFloat(CalculatedAvg) *
                        ptr.resultant *
                        Math.sqrt(3)
                    ).toFixed(4);
            } else {
                UpdatedExcitationAt__PercentageTable[ColumnName]["I(N.L)"] = (
                    parseFloat(CalculatedAvg) * ctr.resultant
                ).toFixed(4);
            }
        } else {
            for (let i = 1; i < 4; i++) {
                CalculatedAvg =
                    parseFloat(
                        UpdatedExcitationAt__PercentageTable[ColumnName][
                            `${RowPrefix}${i}`
                        ]
                    ) + parseFloat(CalculatedAvg);
            }
            CalculatedAvg = parseFloat(CalculatedAvg.toFixed(4));
            UpdatedExcitationAt__PercentageTable[ColumnName]["SUM"] =
                CalculatedAvg;
                if (TableName === "excitation_at_90_percentage_table") {
                    setNoLoadLoss90Per((CalculatedAvg * mf) / 1000);
                } else if (TableName === "excitation_at_100_percentage_table") {
                    setNoLoadLoss100Per((CalculatedAvg * mf) / 1000);
                } else if (TableName === "excitation_at_110_percentage_table") {
                    setNoLoadLoss110Per((CalculatedAvg * mf) / 1000);
                }
        }

        if (TableName === "excitation_at_90_percentage_table") {
            setExcitationAt90PercentageTable(UpdatedExcitationAt__PercentageTable);
        } else if (TableName === "excitation_at_100_percentage_table") {
            setExcitationAt100PercentageTable(UpdatedExcitationAt__PercentageTable);
        } else if (TableName === "excitation_at_110_percentage_table") {
            setExcitationAt110PercentageTable(UpdatedExcitationAt__PercentageTable);
        }
        
    };

    const OnSaveClick = (e) => {
        if (!isAnyDataChange) {
            toast.info("Info! Nothing to save", { autoClose: 1000 });
            return;
        }
        setIsSaving(true);
        API.patch(
            `/measurement-of-no-load-loss-and-no-load-current/${idRef.current}/`,
            {
                transformer_energized_from: transformerEnergizedFrom,
                ptr: ptr,
                ctr: ctr,
                mf: mf,
                hv_phase_rated_current: hVPhaseRatedCurrent,
                no_load_current_percentage: noLoadCurrentPercentage,
                excitation_at_90_percentage_table:
                    excitationAt90PercentageTable,
                excitation_at_100_percentage_table:
                    excitationAt100PercentageTable,
                excitation_at_110_percentage_table:
                    excitationAt110PercentageTable,
                no_load_loss_at_90_percentage_excitation: noLoadLoss90Per,
                no_load_loss_at_100_percentage_excitation: noLoadLoss100Per,
                no_load_loss_at_110_percentage_excitation: noLoadLoss110Per,
            }
        )
            .then((response) => {
                setIsSaving(false);
                toast.success("Success! Information updated successfully.");
                setIsAnyDataChange(false);
            })
            .catch((err) => {
                setIsSaving(false);
                toast.error(`Error! ${err}`);
            });
        setIsSaving(false);
    };

    useEffect(() => {
        dispatch(setReportId(params.reportId));
        API.get(
            `/measurement-of-no-load-loss-and-no-load-current/by-customer/${params.reportId}/`
        )
            .then((response) => {
                const resp_data = response?.data[0];
                idRef.current = resp_data?.id;
                setTransformerEnergizedFrom(
                    resp_data.transformer_energized_from
                );
                setPtr(resp_data?.ptr);
                setCtr(resp_data?.ctr);
                setMf(resp_data?.mf);
                setHVPhaseRatedCurrent(resp_data?.hv_phase_rated_current);
                setNoLoadCurrentPercentage(
                    resp_data?.no_load_current_percentage
                );
                setExcitationAt90PercentageTable(
                    resp_data?.excitation_at_90_percentage_table
                );
                setExcitationAt100PercentageTable(
                    resp_data?.excitation_at_100_percentage_table
                );
                setExcitationAt110PercentageTable(
                    resp_data?.excitation_at_110_percentage_table
                );
                setNoLoadLoss90Per(
                    resp_data?.no_load_loss_at_90_percentage_excitation
                );
                setNoLoadLoss100Per(
                    resp_data?.no_load_loss_at_100_percentage_excitation
                );
                setNoLoadLoss110Per(
                    resp_data?.no_load_loss_at_110_percentage_excitation
                );
            })
            .catch((err) => {});
    }, []);

    const NextPreviousButtonState = [false, false];
    const NextPrevLink = [
        `/vector-group-test/${params.reportId}`,
        `/measurement-of-load-loss-and-impedance/${params.reportId}`,
    ];

    useEffect(() => {
        document.getElementById(activeInputRef.current)?.focus();
    }, [
        excitationAt90PercentageTable,
        excitationAt100PercentageTable,
        excitationAt110PercentageTable,
    ]);

    const RenderExcitationTable = ({
        excitation_at__percentage_table,
        table_name,
        on_data_change,
    }) => (
        <>
            <table className="report-table no-load-loss-no-load-current">
                <thead>
                    <tr>
                        {Object.entries(excitation_at__percentage_table).map(
                            ([key, value], index) => (
                                <td>
                                    {key} ({value._unit})
                                </td>
                            )
                        )}
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(excitation_at__percentage_table).map(
                        ([key, value], index) => (
                            <td className="consider-d-r">
                                {Object.entries(value).map(
                                    ([key_i, value_i], index) => (
                                        <>
                                            {key_i === "_unit" ? (
                                                ""
                                            ) : (
                                                <tr>
                                                    <td>{key_i}</td>
                                                    <td>
                                                        {key_i === "Avg" ||
                                                        key_i === "V Applied" ||
                                                        key_i === "SUM" ||
                                                        key_i === "I(N.L)" ? (
                                                            value_i
                                                        ) : (
                                                            <input
                                                                id={`${table_name}_${key}_${key_i}`}
                                                                title={`${table_name}_${key}_${key_i}`}
                                                                value={value_i}
                                                                onChange={
                                                                    on_data_change
                                                                }
                                                                data-row-name={
                                                                    key_i
                                                                }
                                                                name={key}
                                                                data-table-name={
                                                                    table_name
                                                                }
                                                                type="number"
                                                                onFocus={(
                                                                    e
                                                                ) => {
                                                                    activeInputRef.current =
                                                                        e.target.id;
                                                                }}
                                                            />
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    )
                                )}
                            </td>
                        )
                    )}
                </tbody>
            </table>
        </>
    );

    const RenderNoLoadLoss = ({ table_name, percentage, value }) => (
        <table
            className="test-main-table"
            style={{ width: "fit-content", margin: "0px" }}>
            <tbody className="test-main-table-body">
                <tr>
                    <td>
                        <label
                            className="main-label"
                            htmlFor="trans-energized-from">
                            NO LOAD LOSS {percentage}% EXCITATION:
                        </label>
                    </td>
                    <td>{value}</td>
                </tr>
            </tbody>
        </table>
    );

    return (
        <div className="main-content no-load-loss-no-load-current">
            <ToastContainer />
            <div className="main-content-head">
                Measurement of No Load Loss and No Load Current
            </div>
            <div className="head-info">
                <table className="test-main-table">
                    <tbody className="test-main-table-body">
                        <tr>
                            <td>
                                <label
                                    className="main-label"
                                    htmlFor="trans-energized-from">
                                    TRANSFORMER ENERGIZED FROM:
                                </label>
                            </td>
                            <td>
                                <select
                                    name="side"
                                    id="trans-energized-from"
                                    className="main-input"
                                    onChange={OnTransformerEnergizedFromChange}
                                    value={transformerEnergizedFrom?.side}>
                                    <option value="HV">HV</option>
                                    <option value="LV">LV</option>
                                </select>
                            </td>
                            <td>
                                <input
                                    className="main-input"
                                    type="number"
                                    name="value"
                                    onChange={OnTransformerEnergizedFromChange}
                                    value={transformerEnergizedFrom?.value}
                                />
                            </td>
                            <td>
                                <select
                                    name="unit"
                                    className="main-input"
                                    onChange={OnTransformerEnergizedFromChange}
                                    value={transformerEnergizedFrom?.unit}>
                                    <option value="V">V</option>
                                    <option value="KV">KV</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="ptr" className="main-label">
                                    PTR:
                                </label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="main-input"
                                    name="primary_side"
                                    onChange={OnPtrChange}
                                    value={ptr.primary_side}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="main-input"
                                    name="secondary_side"
                                    onChange={OnPtrChange}
                                    value={ptr.secondary_side}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="main-input"
                                    name="resultant"
                                    readOnly={true}
                                    value={ptr.resultant}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="ptr" className="main-label">
                                    CTR:
                                </label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="main-input"
                                    name="primary_side"
                                    onChange={OnCtrChange}
                                    value={ctr.primary_side}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="main-input"
                                    name="secondary_side"
                                    onChange={OnCtrChange}
                                    value={ctr.secondary_side}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="main-input"
                                    name="resultant"
                                    readOnly={true}
                                    value={ctr.resultant}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="mf" className="main-label">
                                    MF:
                                </label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="mf"
                                    className="main-input"
                                    readOnly={true}
                                    value={mf}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label
                                    htmlFor="hv-phase-rated-current"
                                    className="main-label">
                                    HV PHASE RATED CURRENT:
                                </label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="hv_phase_rated_current"
                                    className="main-input"
                                    onChange={OnHVPhaseRatedCurrentChange}
                                    value={hVPhaseRatedCurrent}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label
                                    htmlFor="no-load-current-per"
                                    className="main-label">
                                    % NO LOAD CURRENT:
                                </label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="no_load_current_percentage"
                                    id="no-load-current-per"
                                    className="main-input"
                                    onChange={NoLoadCurrentPercentageChange}
                                    value={noLoadCurrentPercentage}
                                />
                            </td>
                            <td>%</td>
                        </tr>
                    </tbody>
                </table>
                <h3 className="table-name">90% Excitation</h3>
                <RenderExcitationTable
                    excitation_at__percentage_table={
                        excitationAt90PercentageTable
                    }
                    table_name="excitation_at_90_percentage_table"
                    on_data_change={OnExcitation__PercentageTableChange}
                />
                <RenderNoLoadLoss
                    table_name="excitation_at_90_percentage_table"
                    percentage={90}
                    value={noLoadLoss90Per}
                />
                <hr style={{marginBlock:"20px"}}/>

                <h3 className="table-name">100% Excitation</h3>
                <RenderExcitationTable
                    excitation_at__percentage_table={
                        excitationAt100PercentageTable
                    }
                    table_name="excitation_at_100_percentage_table"
                    on_data_change={OnExcitation__PercentageTableChange}

                />
                <RenderNoLoadLoss
                    table_name="excitation_at_100_percentage_table"
                    percentage={100}
                    value={noLoadLoss100Per}
                />
                <hr style={{marginBlock:"20px"}}/>


                <h3 className="table-name">110% Excitation</h3>
                <RenderExcitationTable
                    excitation_at__percentage_table={
                        excitationAt110PercentageTable
                    }
                    table_name="excitation_at_110_percentage_table"
                    on_data_change={OnExcitation__PercentageTableChange}
                />
                <RenderNoLoadLoss
                    table_name="excitation_at_110_percentage_table"
                    percentage={110}
                    value={noLoadLoss110Per}
                />
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

const excitation_at__percentage_table = {
    "voltage/Ph": {
        _unit: "V",
        V1: null,
        V2: null,
        V3: null,
        Avg: null,
        "V Applied": null,
    },
    Current: {
        _unit: "A",
        I1: null,
        I2: null,
        I3: null,
        Avg: null,
        "I(N.L)": null,
    },
    Power: {
        _unit: "W",
        P1: null,
        P2: null,
        P3: null,
        SUM: null,
    },
};
