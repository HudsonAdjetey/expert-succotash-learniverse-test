import React, { useEffect } from "react";
import {
  RouterProvider,
  Outlet,
  createBrowserRouter,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Home from "./container/pages/Home";
import Navbar from "./components/nav/Navbar";
import Account from "./container/pages/Account";
import Classes from "./container/pages/Classes";
import Student from "./container/pages/Student";
import Login from "./container/pages/Login";
import SignUp from "./container/pages/SignUp";
import ScheduleClass from "./container/pages/ScheduleClass";
import Settings from "./container/pages/Settings";
import { useSelector } from "react-redux";
import Demo from "./container/pages/Demo";
import Subscription from "./container/pages/Subscription";
import AdminHome from "./container/pages/Home2";
import Navbar2 from "./components/nav/Navbar2";
import ErrorPage from "./container/pages/ErrorPage";
import ErrorBoundary from "./container/pages/ErrorBoundary";

const App = () => {
  const { user } = useSelector((state) => state.user);

  // check for admin User

  const AuthGuard = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
      if (user !== null) {
        navigate("/");
      }
    }, []);
    return children;
  };
  const isAdmin = user && user.va1 === import.meta.env.VITE_VAL;
  const Layout = () => {
    return user ? (
      <section className="container">
        {isAdmin ? <Navbar /> : <Navbar2 />}
        <Outlet />
      </section>
    ) : (
      <Navigate to={"/login"} replace />
    );
  };
  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <AuthGuard>
          <Login />
        </AuthGuard>
      ),
    },
    {
      path: "/signup",
      element: <SignUp />,
    },

    {
      path: "/",
      element: (
        <ErrorBoundary>
          <Layout />
        </ErrorBoundary>
      ),
      children: [
        {
          path: "/",
          // element: <Home />,
          element: isAdmin ? <AdminHome /> : <Home />,
        },
        {
          path: "/account",
          element: <Account />,
        },
        {
          path: "/classes",
          element: <Classes />,
        },
        {
          path: "/student",
          element: <Student />,
        },
        {
          path: "/schedule-class",
          element: <ScheduleClass />,
        },
        {
          path: "/subscription",
          element: <Subscription />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
      ],
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
