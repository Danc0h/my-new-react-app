import React, { useContext, useEffect, useReducer, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../Components/LoadingBox";
import MessageBox from "../Components/MessageBox";
import { Store } from "../Store";
import { getError } from "../Util";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function UserEditPage() {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const response = await fetch(
          `https://d6d9-62-24-114-242.ngrok-free.app/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setName(data.name);
        setEmail(data.email);
        setCourse(data.course);
        setSchool(data.school);
        setDepartment(data.department);
        setStartDate(data.startDate);
        setEndDate(data.endDate);
        setIsAdmin(data.isAdmin);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const response = await fetch(
        `https://d6d9-62-24-114-242.ngrok-free.app/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify({
            _id: userId,
            name,
            email,
            course,
            school,
            department,
            startDate,
            endDate,
            isAdmin,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("User updated successfully");
      navigate("/");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <Container className='small-container'>
      <Helmet>
        <title>Edit Attache {userId}</title>
      </Helmet>
      <h1>Edit Attache {userId}</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant='danger'>{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={email}
              type='email'
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='course'>
            <Form.Label>Course</Form.Label>
            <Form.Control
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='school'>
            <Form.Label>School</Form.Label>
            <Form.Control
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='department'>
            <Form.Label>Department</Form.Label>
            <Form.Control
              as='select'
              value={department}
              required
              onChange={(e) => setDepartment(e.target.value)}
              className='bg-white'
            >
              <option value=''>Click to Select Department</option>
              <option value='ADMINISTRATION'>ADMINISTRATION</option>
              <option value='PUBLIC SERVICE'>PUBLIC SERVICE</option>
              <option value='SPECIAL PROGRAMS'>SPECIAL PROGRAMS</option>
              <option value='FINANCE'>FINANCE</option>
              <option value='ECONOMIC PLANNING'>ECONOMIC PLANNING</option>
              <option value='ICT'>ICT</option>
              <option value='AGRICULTURE'>AGRICULTURE</option>
              <option value='LIVESTOCK'>LIVESTOCK</option>
              <option value='FISHERIES AND COOPERATIVES'>
                FISHERIES AND COOPERATIVES
              </option>
              <option value='WATER'>WATER</option>
              <option value='SANITATION'>SANITATION</option>
              <option value='ENVIRONMENT'>ENVIRONMENT</option>
              <option value='NATURAL RESOURCES'>NATURAL RESOURCES</option>
              <option value='CLIMATE CHANGE'>CLIMATE CHANGE</option>
              <option value='MEDICAL SERVICES'>MEDICAL SERVICES</option>
              <option value='EDUCATION'>EDUCATION</option>
              <option value='YOUTH'>YOUTH</option>
              <option value='SPORTS'>SPORTS</option>
              <option value='VOCATIONAL TRAINING'>VOCATIONAL TRAINING</option>
              <option value='LANDS'>LANDS</option>
              <option value='HOUSING'>HOUSING</option>
              <option value='URBAN PLANNING'>URBAN PLANNING</option>
              <option value='ROADS'>ROADS</option>
              <option value='PUBLIC WORKS'>PUBLIC WORKS</option>
              <option value='TRANSPORT'>TRANSPORT</option>
              <option value='TRADE'>TRADE</option>
              <option value='ENERGY'>ENERGY</option>
              <option value='TOURISM'>TOURISM</option>
              <option value='INVESTMENT'>INVESTMENT</option>
              <option value='INDUSTRY'>INDUSTRY</option>
              <option value='GENDER'>GENDER</option>
              <option value='CULTURE'>CULTURE</option>
              <option value='SOCIAL SERVICES'>SOCIAL SERVICES</option>
              <option value='BOMET MUNICIPALITY'>BOMET MUNICIPALITY</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className='mb-3' controlId='startDate'>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='endDate'>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Check
            className='mb-3'
            type='checkbox'
            id='isAdmin'
            label='isAdmin'
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />

          <div className='mb-3'>
            <Button disabled={loadingUpdate} type='submit' variant='success'>
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}
