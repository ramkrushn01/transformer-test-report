import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import API from "../api/custom_axios";
import { setReportId } from "../redux/features/reportIdSlice";
import { useParams } from "react-router-dom";
import NextPreviousButton from "./common/NextPreviousButton";
import "../css/measurement-of-load-loss-and-impedance.css";

export default function MeasurementOfLoadLossAndImpedance() {
    const dispatch = useDispatch();
    const idRef = useRef();
    const activeInputRef = useRef(null);
    const params = useParams();
    const [isSaving, setIsSaving] = useState(false);
    const [isAnyDataChange, setIsAnyDataChange] = useState(false);

    const [temperature, setTemperature] = useState(NaN);
    const [tapNo, setTapNo] = useState(NaN);
    const [voltageAppliedOn, setVoltageAppliedOn] = useState("HV");
    const [sideShorted, setSideShorted] = useState("HV");
    const [noLoadLossImpedanceTable, setNoLoadLossImpedanceTable] = useState(
        no_load_loss_impedance_table
    );
    const [appliedVoltage, setAppliedVoltage] = useState(0);
    const [measuredCurrent, setMeasuredCurrent] = useState(0);
    const [measuredLoadLoss, setMeasuredLoadLoss] = useState(0);
    const [ratedHVVoltage, setRatedHVVoltage] = useState(0);
    const [ratedHVCurrent, setRatedHVCurrent] = useState(0);
    const [loadLossAtRatedCurrent, setLoadLossAtRatedCurrent] = useState(0);
    const [percentageImpedance, setPercentageImpedance] = useState(0);
    const [totalLoadLoss, setTotalLoadLoss] = useState(0);

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

    const OnTemperatureChange = (e) => {
        setIsAnyDataChange(true);
        setTemperature(e.target.value);
    };

    const OnTapOnChange = (e) => {
        setIsAnyDataChange(true);
        setTapNo(e.target.value);
    };

    const OnVoltageAppliedOnChange = (e) => {
        setIsAnyDataChange(true);
        setVoltageAppliedOn(e.target.value);
    };

    const OnsideShortedChange = (e) => {
        setIsAnyDataChange(true);
        setSideShorted(e.target.value);
    };

    const OnPtrChange = (e) => {
        setIsAnyDataChange(true);
        const Resultant = (
            e.target.name === "primary_side"
                ? parseFloat(e.target.value) / parseFloat(ptr.secondary_side)
                : parseFloat(ptr.primary_side) / parseFloat(e.target.value)
        ).toFixed(4);

        setPtr((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
            resultant: Resultant,
        }));
        const MF = (parseFloat(Resultant) * parseFloat(ctr.resultant)).toFixed(
            4
        );
        setMf(MF);

        const Applied_Voltage =
            parseFloat(noLoadLossImpedanceTable["Voltage/Ph"]["Avg"]) *
            parseFloat(Resultant) *
            Math.sqrt(3);
        setAppliedVoltage(Applied_Voltage);

        const Measured_Load_Loss =
            parseFloat(noLoadLossImpedanceTable["Power"]["SUM"]) * MF;
        setMeasuredLoadLoss(Measured_Load_Loss);
    };

    const OnCtrChange = (e) => {
        setIsAnyDataChange(true);
        const Resultant = (
            e.target.name === "primary_side"
                ? parseFloat(e.target.value) / parseFloat(ctr.secondary_side)
                : parseFloat(ctr.primary_side) / parseFloat(e.target.value)
        ).toFixed(4);

        setCtr((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
            resultant: Resultant,
        }));
        const MF = (parseFloat(ptr.resultant) * parseFloat(Resultant)).toFixed(
            4
        );
        setMf(MF);

        const Measured_Current =
            parseFloat(noLoadLossImpedanceTable["Current"]["Avg"]) *
            parseFloat(Resultant);
        setMeasuredCurrent(Measured_Current);

        const Measured_Load_Loss =
            parseFloat(noLoadLossImpedanceTable["Power"]["SUM"]) * MF;
        setMeasuredLoadLoss(Measured_Load_Loss);
    };

    const OnNoLoadLossImpedanceUnitChange = (e) => {
        setIsAnyDataChange(true);
        const TableName = e.target.dataset.tableName;
        const ColumnName = e.target.dataset.columnName;
        const RowName = e.target.name;
        const NewValue = e.target.value;
        const UnitUpdatedValue = { ...noLoadLossImpedanceTable };
        UnitUpdatedValue[ColumnName][RowName] = NewValue;
        setNoLoadLossImpedanceTable(UnitUpdatedValue);
    };

    const OnNoLoadLossImpedanceDataChange = (e) => {
        setIsAnyDataChange(true);
        const TableName = e.target.dataset.tableName;
        const RowName = e.target.dataset.rowName;
        const ColumnName = e.target.name;
        const NewValue = e.target.value;
        const UpdatedValue = { ...noLoadLossImpedanceTable };
        UpdatedValue[ColumnName][RowName] = NewValue;

        const RowPrefix = RowName.charAt(0);
        var CalculatedAvg = 0;
        if (RowPrefix === "V" || RowPrefix === "I") {
            for (let i = 1; i < 4; i++) {
                CalculatedAvg =
                    parseFloat(UpdatedValue[ColumnName][`${RowPrefix}${i}`]) +
                    parseFloat(CalculatedAvg);
            }
            CalculatedAvg = (parseFloat(CalculatedAvg) / 3).toFixed(4);
            UpdatedValue[ColumnName]["Avg"] = CalculatedAvg;
            if (RowPrefix === "V") {
                const Voltage_Applied = (
                    parseFloat(CalculatedAvg) *
                    ptr.resultant *
                    Math.sqrt(3)
                ).toFixed(4);
                setAppliedVoltage(Voltage_Applied);
            } else {
                const Measured_Current = (
                    parseFloat(CalculatedAvg) * ctr.resultant
                ).toFixed(4);
                setMeasuredCurrent(Measured_Current);
            }
        } else {
            for (let i = 1; i < 4; i++) {
                CalculatedAvg =
                    parseFloat(UpdatedValue[ColumnName][`${RowPrefix}${i}`]) +
                    parseFloat(CalculatedAvg);
            }
            CalculatedAvg = parseFloat(CalculatedAvg.toFixed(4));
            UpdatedValue[ColumnName]["SUM"] = CalculatedAvg;
            // for further calculation
            const Measured_Load_Loss = CalculatedAvg * mf;
            setMeasuredLoadLoss(Measured_Load_Loss);
        }

        setNoLoadLossImpedanceTable(UpdatedValue);
    };

    const OnRatedHVVoltageChange = (e) => {
        setIsAnyDataChange(true);
        setRatedHVVoltage(e.target.value);
    };

    const OnRatedHVCurrentChange = (e) => {
        setIsAnyDataChange(true);
        setRatedHVCurrent(e.target.value);
    };

    const OnSaveClick = (e) => {
        if (!isAnyDataChange) {
            toast.info("Info! Nothing to save", { autoClose: 1000 });
            return;
        }
        setIsSaving(true);
        API.patch(`/measurement-of-load-loss-and-impedance/${idRef.current}/`, {
            temperature: temperature,
            tap_no: tapNo,
            voltage_applied_on: voltageAppliedOn,
            side_shorted: sideShorted,
            ptr: ptr,
            ctr: ctr,
            mf: mf,
            no_load_loss_impedance_table: noLoadLossImpedanceTable,
            applied_voltage: appliedVoltage,
            measured_current: measuredCurrent,
            measured_load_loss: measuredLoadLoss,
            rated_hv_voltage: ratedHVVoltage,
            rated_hv_current: ratedHVCurrent,
            load_loss_at_rated_current: loadLossAtRatedCurrent,
            percentage_impedance: percentageImpedance,
            total_load_loss: totalLoadLoss,
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

    useEffect(() => {
        dispatch(setReportId(params.reportId));
        API.get(
            `/measurement-of-load-loss-and-impedance/by-customer/${params.reportId}/`
        )
            .then((response) => {
                const resp_data = response?.data[0];
                idRef.current = resp_data.id;
                setTemperature(resp_data.temperature);
                setTapNo(resp_data.tap_no);
                setVoltageAppliedOn(resp_data.voltage_applied_on);
                setSideShorted(resp_data.side_shorted);
                setPtr(resp_data.ptr);
                setCtr(resp_data.ctr);
                setMf(resp_data.mf);
                setNoLoadLossImpedanceTable(
                    resp_data.no_load_loss_impedance_table
                );
                setAppliedVoltage(resp_data.applied_voltage);
                setMeasuredCurrent(resp_data.measured_current);
                setMeasuredLoadLoss(resp_data.measured_load_loss);
                setRatedHVVoltage(resp_data.rated_hv_voltage);
                setRatedHVCurrent(resp_data.rated_hv_current);
                setLoadLossAtRatedCurrent(resp_data.load_loss_at_rated_current);
                setPercentageImpedance(resp_data.percentage_impedance);
                setTotalLoadLoss(resp_data.total_load_loss);
            })
            .catch((err) => {});
    }, []);

    const NextPreviousButtonState = [false, false];
    const NextPrevLink = [
        `/measurement-of-no-load-loss-and-no-load-current/${params.reportId}`,
        `/oil-bdv/${params.reportId}`,
    ];

    useEffect(() => {
        document.getElementById(activeInputRef.current)?.focus();
    }, [noLoadLossImpedanceTable]);

    // for update Load Loss at Rated Current
    useEffect(() => {
        const Load_Loss_at_Rated_Current = (
            parseFloat(measuredLoadLoss) *
            Math.pow(
                parseFloat(ratedHVCurrent) / parseFloat(measuredCurrent),
                2
            )
        ).toFixed(4);

        setLoadLossAtRatedCurrent(Load_Loss_at_Rated_Current);
    }, [measuredLoadLoss, ratedHVCurrent, measuredCurrent]);

    // for update Percentage Impedance

    useEffect(() => {
        const Percentage_Impedance = (
            (parseFloat(appliedVoltage) / parseFloat(ratedHVVoltage)) *
            (parseFloat(ratedHVCurrent) / parseFloat(measuredCurrent)) *
            100
        ).toFixed(4);

        setPercentageImpedance(Percentage_Impedance);
    }, [appliedVoltage, ratedHVVoltage, ratedHVCurrent, measuredCurrent]);

    // for update Total Load Loss

    useEffect(() => {
        const Total_Load_Loss = (
            parseFloat(loadLossAtRatedCurrent) / 1000
        ).toFixed(4);
        setTotalLoadLoss(Total_Load_Loss);
    }, [loadLossAtRatedCurrent]);

    const RenderNoLoadLossImpedanceTable = ({
        no_load_loss_impedance_table,
        table_name,
        on_data_change,
    }) => (
        <table className="report-table no-load-loss-no-load-current-table">
            <thead>
                <tr>
                    {Object.entries(no_load_loss_impedance_table).map(
                        ([key, value], index) => (
                            <td>
                                {key}{" "}
                                <select
                                    name="_unit"
                                    id={`${table_name}_${key}_unit`}
                                    value={value._unit}
                                    data-row-name={"_unit"}
                                    data-table-name={table_name}
                                    data-column-name={key}
                                    onChange={OnNoLoadLossImpedanceUnitChange}
                                    onFocus={(e) => {
                                        activeInputRef.current = e.target.id;
                                    }}>
                                    {key === "Power" ? (
                                        <>
                                            <option value="W">W</option>
                                            <option value="KW">KW</option>
                                        </>
                                    ) : key === "Current" ? (
                                        <>
                                            <option value="mA">mA</option>
                                            <option value="A">A</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="V">V</option>
                                            <option value="KV">KV</option>
                                        </>
                                    )}
                                </select>
                            </td>
                        )
                    )}
                </tr>
            </thead>
            <tbody>
                {Object.entries(no_load_loss_impedance_table).map(
                    ([key, value], index) => (
                        <td className={`consider-d-r ${key.toLowerCase()}`}>
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
                                                            onFocus={(e) => {
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
    );

    return (
        <div className="main-content load-loss-impedance no-load-loss-no-load-current">
            <ToastContainer />
            <div className="main-content-head">
                Measurement of Load Loss and Impedance
            </div>
            <div className="head-info">
                <table className="test-main-table">
                    <tbody className="test-main-table-body">
                        <tr>
                            <td>
                                <label
                                    className="main-label"
                                    htmlFor="temperature">
                                    TEMPERATURE:
                                </label>
                            </td>
                            <td>
                                <input
                                    className="main-input"
                                    type="number"
                                    name="value"
                                    onChange={OnTemperatureChange}
                                    value={temperature}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label className="main-label" htmlFor="tap-no">
                                    TAP NO:
                                </label>
                            </td>
                            <td>
                                <input
                                    className="main-input"
                                    type="number"
                                    name="value"
                                    onChange={OnTapOnChange}
                                    value={tapNo}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <label
                                    className="main-label"
                                    htmlFor="voltage-applied-on">
                                    VOLTAGE APPLIED ON:
                                </label>
                            </td>
                            <td>
                                <select
                                    name="side"
                                    id="trans-energized-from"
                                    className="main-input"
                                    onChange={OnVoltageAppliedOnChange}
                                    value={voltageAppliedOn}>
                                    <option value="HV">HV</option>
                                    <option value="LV">LV</option>
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <label
                                    className="main-label"
                                    htmlFor="shorted-side">
                                    SIDE SHORTED:
                                </label>
                            </td>
                            <td>
                                <select
                                    name="side"
                                    id="trans-energized-from"
                                    className="main-input"
                                    onChange={OnsideShortedChange}
                                    value={sideShorted}>
                                    <option value="HV">HV</option>
                                    <option value="LV">LV</option>
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
                                <label htmlFor="ctr" className="main-label">
                                    CTR:
                                </label>
                            </td>
                            <td>
                                <input
                                    id="ctr"
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
                                <label className="main-label">MF:</label>
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
                    </tbody>
                </table>
                <RenderNoLoadLossImpedanceTable
                    no_load_loss_impedance_table={noLoadLossImpedanceTable}
                    table_name={"no_load_loss_and_impedance_table"}
                    on_data_change={OnNoLoadLossImpedanceDataChange}
                />
                <table className="test-main-table">
                    <tbody className="test-main-table-body">
                        <tr>
                            <td>
                                <label
                                    className="main-label"
                                    htmlFor="voltage-applied">
                                    APPLIED VOLTAGE:
                                </label>
                            </td>
                            <td>
                                <input
                                    className="main-input"
                                    type="number"
                                    name="value"
                                    readOnly={true}
                                    value={appliedVoltage}
                                />
                            </td>
                            <td>Volts</td>
                        </tr>
                        <tr>
                            <td>
                                <label
                                    className="main-label"
                                    htmlFor="measured-current">
                                    MEASURED CURRENT:
                                </label>
                            </td>
                            <td>
                                <input
                                    className="main-input"
                                    type="number"
                                    name="value"
                                    readOnly={true}
                                    value={measuredCurrent}
                                />
                            </td>
                            <td>Amps</td>
                        </tr>

                        <tr>
                            <td>
                                <label
                                    className="main-label"
                                    htmlFor="measured-load-loss">
                                    MEASURED LOAD LOSS:
                                </label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    id="measured-load-loss"
                                    className="main-input"
                                    readOnly="true"
                                    value={measuredLoadLoss}></input>
                            </td>
                            <td>Watts</td>
                        </tr>

                        <tr>
                            <td>
                                <label
                                    className="main-label"
                                    htmlFor="rated-hv-voltage">
                                    RATED {voltageAppliedOn} VOLTAGE:
                                </label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    id="rated-hv-voltage"
                                    className="main-input"
                                    value={ratedHVVoltage}
                                    onChange={OnRatedHVVoltageChange}
                                />
                            </td>
                            <td>Volts</td>
                        </tr>

                        <tr>
                            <td>
                                <label
                                    htmlFor="rated-hv-current"
                                    className="main-label">
                                    RATED {voltageAppliedOn} CURRENT:
                                </label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="main-input"
                                    value={ratedHVCurrent}
                                    onChange={OnRatedHVCurrentChange}
                                />
                            </td>
                            <td>Amps</td>
                        </tr>
                        <tr>
                            <td>
                                <label
                                    htmlFor="load-loss-at-current"
                                    className="main-label">
                                    LOAD LOSS AT RATED CURRENT (In Watts):
                                </label>
                            </td>
                            <td>
                                <input
                                    id="load-loss-at-current"
                                    type="number"
                                    className="main-input"
                                    readOnly={true}
                                    value={loadLossAtRatedCurrent}
                                />
                            </td>
                            <td>Amps</td>
                        </tr>
                        <tr>
                            <td>
                                <label className="main-label">
                                    PERCENTAGE IMPEDANCE:
                                </label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="main-input"
                                    readOnly={true}
                                    value={percentageImpedance}
                                />
                            </td>
                            <td>%</td>
                        </tr>
                        <tr>
                            <td>
                                <label className="main-label">
                                    TOTAL LOAD LOSSES:
                                </label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    className="main-input"
                                    readOnly={true}
                                    value={totalLoadLoss}
                                />
                            </td>
                            <td>KW</td>
                        </tr>
                    </tbody>
                </table>
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

const no_load_loss_impedance_table = {
    "Voltage/Ph": {
        _unit: "V",
        V1: null,
        V2: null,
        V3: null,
        Avg: null,
    },
    Current: {
        _unit: "A",
        I1: null,
        I2: null,
        I3: null,
        Avg: null,
    },
    Power: {
        _unit: "W",
        P1: null,
        P2: null,
        P3: null,
        SUM: null,
    },
};
