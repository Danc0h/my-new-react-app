import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { getError } from "../Util";
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
    default:
      return state;
  }
};

export default function UsersByDepartmentPage() {
  const { department } = useParams();
  const [{ loading, error, users }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await fetch(
          `https://d6d9-62-24-114-242.ngrok-free.app/api/users/department/${department}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users by department");
        }
        const data = await response.json();
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [department]);

  return (
    <div>
      <Helmet>
        <title>Users by Department</title>
      </Helmet>
      <h1 style={{ textAlign: "center", textDecoration: "underline" }}>
        {department}
      </h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <div>
          <h2>Total number of attaches: {users.length}</h2>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
