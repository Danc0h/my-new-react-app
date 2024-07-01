import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useState, useContext, useEffect } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../Util";

export default function SigninPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://d6d9-62-24-114-242.ngrok-free.app/api/users/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to sign in");
      }

      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
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

  return (
    <Container className='small-container'>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-8'>
            <h1 className='text-center my-3'>Sign In</h1>
            <Form
              className='bg-light p-4 rounded shadow-sm'
              onSubmit={submitHandler}
            >
              <Form.Group className='mb-3' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='email'
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className='bg-white form-control' // Add bg-white and form-control classes
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className='bg-white form-control' // Add bg-white and form-control classes
                />
              </Form.Group>

              <div className='d-grid gap-2'>
                <Button type='submit'>Sign In</Button>
              </div>

              <div className='text-center mt-3'>
                New Attache?{" "}
                <Link to={`/signup?redirect=${redirect}`}>
                  Create your account
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Container>
  );
}
