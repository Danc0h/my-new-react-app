import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../Util";

export default function SignupPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [school, setSchool] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hashedOTP, setHashedOTP] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      toast.success("Please wait for the OTP prompt and check your email");
      const response = await fetch(
        "https://d6d9-62-24-114-242.ngrok-free.app/api/users/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            course,
            school,
            startDate,
            endDate,
            password,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setHashedOTP(data.hashedOTP); // Store the hashed OTP temporarily

      const userOTP = prompt("Enter OTP sent to your email");
      if (!userOTP) {
        toast.error("Invalid OTP or no OTP entered");
        return;
      }

      const verifyResponse = await fetch(
        "https://d6d9-62-24-114-242.ngrok-free.app/api/users/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            course: data.course,
            school: data.school,
            startDate: data.startDate,
            endDate: data.endDate,
            password: data.password,
            otp: userOTP,
            hashedOTP: data.hashedOTP,
          }),
        }
      );
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) {
        throw new Error(verifyData.message || "Invalid OTP");
      }

      ctxDispatch({ type: "USER_SIGNIN", payload: verifyData });
      localStorage.setItem("userInfo", JSON.stringify(verifyData));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className='small-container'>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-8'>
            <h1 className='text-center my-3'>Sign Up</h1>
            <Form
              className='bg-light p-4 rounded shadow-sm'
              onSubmit={submitHandler}
            >
              <Form.Group className='mb-3' controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  onChange={(e) => setName(e.target.value)}
                  required
                  className='bg-pink'
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className='bg-white'
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='course'>
                <Form.Label>Course</Form.Label>
                <Form.Control
                  required
                  onChange={(e) => setCourse(e.target.value)}
                  className='bg-white'
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='school'>
                <Form.Label>School</Form.Label>
                <Form.Control
                  required
                  onChange={(e) => setSchool(e.target.value)}
                  className='bg-white'
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='startDate'>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type='date'
                  required
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='endDate'>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type='date'
                  required
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className='bg-white'
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='confirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type='password'
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className='bg-white'
                />
              </Form.Group>

              <div className='d-grid gap-2'>
                <Button type='submit'>Sign Up</Button>
              </div>

              <div className='text-center mt-3'>
                Already have an account?{" "}
                <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
}
