import { Link, Outlet } from "react-router-dom";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  
  ThemeProvider,
} from "react-bootstrap";
import { useContext,  } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Store } from "./Store";

function App() {
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);

  
  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  return (
    <ThemeProvider dir="rtl">
      <div className="d-flex flex-column vh-100">
        <ToastContainer position="bottom-center" limit={1} />
        <header className="container">
          <Navbar
            expand="lg"
            className="d-flex flex-column align-items-stretch p-2 pb-0 mb-3"
          >
            <div className="d-flex justify-content-between align-items-center">
              <LinkContainer to="/" className="header-link">
                <Navbar.Brand>
                  <img src="../images/logo.png" alt="logo" width={64} />
                </Navbar.Brand>
              </LinkContainer>

              <Navbar.Collapse>
                <Nav className="w-100 justify-content-end">
                <Link to="/" className="nav-link header-link">
                  פוסטים
                </Link>
                  {userInfo ? (
                    <NavDropdown
                      title={`שלום, ${userInfo.name}`}
                      className="header-link"
                    >
                      {/* <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider /> */}
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        התנתק
                      </Link>
                    </NavDropdown>
                  ) : (
                    <NavDropdown title={`שלום, התחבר`} className="header-link">
                      <LinkContainer to="/signin">
                        <NavDropdown.Item>התחבר</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                  
                </Nav>
              </Navbar.Collapse>
            </div>
          </Navbar>
        </header>

        <main>
          <Container className="mt-3">
            <Outlet />
          </Container>
        </main>

        <footer>
          <div className="text-center">All right reserved</div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
