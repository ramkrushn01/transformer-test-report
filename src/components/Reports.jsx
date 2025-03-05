import React, { useEffect, useState } from 'react';
import "../css/reports.css";
import API from '../api/custom_axios';
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setReportId } from '../redux/features/reportIdSlice';
import Loading from './common/Loading';
import { LuNotebookPen } from "react-icons/lu";
import { toast, ToastContainer } from 'react-toastify';

export default function Reports() {
    const navigate = useNavigate();
    const [data, setData] = useState();
    const [isReportDeleting, setIsReportDeleting] = useState([false, 0]);
    const [isReportCreating, setIsReportCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const dispatch =  useDispatch();

    const gotoReport = (e,id)=>{
        if(e.target.className === "btn-delete" || e.target.tagName === "svg" || e.target.tagName === "path"){
            return
        }
        navigate(`/customer-details/${id}`);
        dispatch(setReportId(id));
    }

	
	const CreateReport = ()=>{
        setIsReportCreating(true);
		API.post('customer-details/',{
			"customer_name": "",
			"work_order_number": "",
			"certificate_number": "",
			"transformer_make": "",
			"serial_number": "",
			"rating": "",
			"reference_standard": "",
			"remark": ""
		}).then((response) => {
            setIsReportCreating(false);
			const newReportId = response.data.id;
			navigate(`/customer-details/${newReportId}`);
			dispatch(setReportId(newReportId));
		}).catch((err) => {
            setIsReportCreating(false);
			console.log(err);
		});	
	}

    const DeleteReport = (id)=>{
        setIsReportDeleting([true, id]);
        API.delete(`customer-details/${id}`).then((response) => {
            setIsReportDeleting([false, 0]);
            setData(data.filter(item=> item.id !== id ));
            toast.success(`Delete! Report ${id} delete successfully`);
        }).catch((err) => {
            setIsReportDeleting([false, 0]);
        });
    }

    useEffect(() => {
        API.get('customer-details/').then((response) => {
            setData(response.data);
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
        });
    }, [])

  return (
      <div className="main-reports">
        <ToastContainer/>
        <div className="reports-head">
			<div className="left-head">
				{/* left */}
			</div>
            <h1 className="head-txt">Reports</h1>
			<div className="right-head">
				<button className='btn-create' disabled={isReportCreating ? true : false} onClick={CreateReport}> {isReportCreating ? <Loading size="10px"/> : <LuNotebookPen size="20px" />}  &nbsp; New Report</button>
			</div>
        </div>
          <div className="table-container">
              <table className="styled-table">
                  <thead>
                      <tr>
                          <th>Sr.No.</th>
                          <th>Rating</th>
                          <th>Customer Name</th>
                          <th>Work Order</th>
                          <th>Certificate No</th>
                          <th>Transformer Make</th>
                          <th>Serial No</th>
                          <th>Reference Standard</th>
                          <th>Testing Date</th>
                          <th>Remark</th>
                          <th>Action</th>
                      </tr>
                  </thead>
                  <tbody>
                      {data?.map((item, index) => (
                          <tr
                              key={item.id}
                              onClick={(e) => {
                                  gotoReport(e, item.id);
                              }}>
                              <td>{index + 1}</td>
                              <td>{item.rating}</td>
                              <td>{item.customer_name}</td>
                              <td>{item.work_order_number}</td>
                              <td>{item.certificate_number}</td>
                              <td>{item.transformer_make}</td>
                              <td>{item.serial_number}</td>
                              <td>{item.reference_standard}</td>
                              <td>{item.testing_date}</td>
                              <td>{item.remark}</td>
                              <td
                                  className="btn-delete"
                                  onClick={() => {
                                      DeleteReport(item.id);
                                  }}>
                                    {
                                        isReportDeleting[0] && item.id === isReportDeleting[1] ? <Loading size="24px" color="black"/> : <MdDeleteForever
                                        className="btn-delete"
                                        size={"30px"}
                                    />
                                    }
                              </td>
                          </tr>
                      ))}

                      {loading ? (
                          <tr>
                              <td className="no-record" colSpan="11">
                                  <Loading size="30px" />
                              </td>
                          </tr>
                      ) : (
                          !data && (
                              <tr>
                                  <td className="no-record" colSpan="11">
                                      No Record Found.
                                  </td>
                              </tr>
                          )
                      )}
                  </tbody>
              </table>
          </div>
      </div>
  );
}
