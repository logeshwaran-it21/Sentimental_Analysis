import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useIsAuthenticated } from "react-auth-kit";
// import PropTypes from "prop-types";
import Home from "./routes/Home";
import Error from "./routes/Error";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Navbar from "./components/Navbar";
import Logout from "./routes/Logout";
import PropTypes from "prop-types";

export default function App() {
  const PrivateRoute = ({ Component }) => {
    const isAuthenticated = useIsAuthenticated();
    const auth = isAuthenticated();
    return auth ? <Component /> : <Navigate to="/login" />;
  };

  PrivateRoute.propTypes = {
    Component: PropTypes.elementType.isRequired,
  };

  return (
    <AuthProvider
      authType="cookie"
      authName="_auth"
      cookieDomain={window.location.hostname}
      cookieSecure={false}
    >
      <div className="mx-auto max-w-7xl p-8">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<PrivateRoute Component={Home} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}
