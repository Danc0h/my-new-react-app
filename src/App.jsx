import "./App.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/HomePage";
import SigninPage from "./pages/SigninPages";
import SignupPage from "./pages/SignupPage";
import { NavDropdown, Navbar } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { useContext } from "react";
import { Store } from "./Store";
import { Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import AdminRoute from "./Components/AdminRoute";
import UserEditPage from "./pages/userEditPage";
import DepartmentListPage from "./pages/DepartmentListPage";
import UsersByDepartmentPage from "./pages/UsersByDepartmentPage";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  //state represents object data provided by Store,useContext allows us to consume the data from store
  //dispatch rep dispatch function provided by context,dispatch function(cxtDispatch) is used to send actions to update state
  const { userInfo } = state;
  //data variables destructured fom the state
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    window.location.href = "/signin";
  };

  return (
    <BrowserRouter>
      <ToastContainer position='bottom-center' limit={1} />
      <header>
        <Navbar bg='dark' variant='dark' expand='lg'>
          <Container>
            <LinkContainer to='/'>
              <Navbar.Brand>LIst of Attaches</Navbar.Brand>
            </LinkContainer>

            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='me-auto  w-100  justify-content-end'>
                {userInfo ? (
                  <NavDropdown
                    title={`Welcome, ${userInfo.name}`}
                    id='basic-nav-dropdown'
                  >
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className='dropdown-item'
                      to='#signout'
                      onClick={signoutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className='nav-link' to='/signin'>
                    Sign In
                  </Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <main>
        <Container className='mt-3'>
          <Routes>
            <Route path='/signin' element={<SigninPage />} />
            <Route path='/signup' element={<SignupPage />} />
            {/* Admin Routes */}

            <Route
              path='/admin/user/:id'
              element={
                <AdminRoute>
                  <UserEditPage />
                </AdminRoute>
              }
            ></Route>
            <Route path='/' element={<HomePage />} />
            <Route
              path='//admin/users/departments'
              element={<DepartmentListPage />}
            />
            <Route
              path='/admin/users/department/:department'
              element={<UsersByDepartmentPage />}
            />
          </Routes>
        </Container>
      </main>
    </BrowserRouter>
  );
}

export default App;
