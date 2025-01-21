import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import LoggedInLayout from "../layout";
import Dashboard from "../pages/Dashboard";
import Tickets from "../pages/Tickets";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Connections from "../pages/Connections";
import Settings from "../pages/Settings";
import Users from "../pages/Users";
import Contacts from "../pages/Contacts";
import QuickAnswers from "../pages/QuickAnswers";
import Queues from "../pages/Queues";
import { AuthProvider } from "../context/Auth/AuthContext";
import { WhatsAppsProvider } from "../context/WhatsApp/WhatsAppsContext";
import { ThemeProvider } from "../context/DarkMode";
// import Route from "./Route";
import PrivateRoute from "./PrivateRouter";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <WhatsAppsProvider>
                    <LoggedInLayout>
                      <Dashboard />
                    </LoggedInLayout>
                  </WhatsAppsProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="/tickets/:ticketId?"
              element={
                <PrivateRoute>
                  <LoggedInLayout>
                    <WhatsAppsProvider>
                      <Tickets />
                    </WhatsAppsProvider>
                  </LoggedInLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/connections"
              element={
                <PrivateRoute>
                  <LoggedInLayout>
                    <WhatsAppsProvider>
                      <Connections />
                    </WhatsAppsProvider>
                  </LoggedInLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/contacts"
              element={
                <PrivateRoute>
                  <LoggedInLayout>
                    <WhatsAppsProvider>
                      <Contacts />
                    </WhatsAppsProvider>
                  </LoggedInLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <LoggedInLayout>
                    <WhatsAppsProvider>
                      <Users />
                    </WhatsAppsProvider>
                  </LoggedInLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/quickAnswers"
              element={
                <PrivateRoute>
                  <LoggedInLayout>
                    <WhatsAppsProvider>
                      <QuickAnswers />
                    </WhatsAppsProvider>
                  </LoggedInLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/Settings"
              element={
                <PrivateRoute>
                  <LoggedInLayout>
                    <WhatsAppsProvider>
                      <Settings />
                    </WhatsAppsProvider>
                  </LoggedInLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/Queues"
              element={
                <PrivateRoute>
                  <LoggedInLayout>
                    <WhatsAppsProvider>
                      <Queues />
                    </WhatsAppsProvider>
                  </LoggedInLayout>
                </PrivateRoute>
              }
            />
          </Routes>
          <ToastContainer autoClose={3000} />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
