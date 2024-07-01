import React, { useContext, useEffect, useReducer } from "react";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { Store } from "../Store";
import { getError } from "../Util";
import * as XLSX from "xlsx";
import "./userListPage.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function UserListPage() {
  const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await fetch(
          "https://d6d9-62-24-114-242.ngrok-free.app/api/users",
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch");
        }
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (user) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        const response = await fetch(
          `https://d6d9-62-24-114-242.ngrok-free.app/api/users/${user._id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to delete");
        }
        toast.success("User deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "UserList.xlsx");
  };

  return (
    <div>
      <Helmet>
        <title>Attaches</title>
      </Helmet>
      <h1 style={{ textAlign: "center", textDecoration: "underline" }}>
        Attaches
      </h1>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <div>
          <h2>Total number of attaches: {users.length}</h2>
          <div className='buttons'>
            <Button onClick={exportToExcel} className='mb-3' variant='success'>
              Export to Excel
            </Button>
            <Button
              type='button'
              variant='success'
              onClick={() => navigate("/admin/users/departments")}
            >
              Sort attaches by Department
            </Button>
          </div>
          <table className='attache-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>COURSE</th>
                <th>SCHOOL</th>
                <th>DEPARTMENT</th>
                <th>START DATE</th>
                <th>END DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.course}</td>
                  <td>{user.school}</td>
                  <td>{user.department}</td>
                  <td>{new Date(user.startDate).toLocaleDateString()}</td>
                  <td>{new Date(user.endDate).toLocaleDateString()}</td>
                  <td>
                    <Button
                      type='button'
                      variant='success'
                      onClick={() => navigate(`/admin/user/${user._id}`)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      type='button'
                      variant='danger'
                      onClick={() => deleteHandler(user)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
