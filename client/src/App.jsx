import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home/Home";
import { Layout } from "./components/Layout/Layout";
import { listingPageLoader } from "./api/listingPageLoader";
import ListingPage from "./routes/ListingPage/ListingPage";
import User from "./routes/User/User";
import { userPageLoader } from "./api/userPageLoader";
import ListPage from "./routes/ListPage/ListPage";
import About from "./routes/About/About";
import { cityByNameLoader } from "./api/cityByNameLoader";
import ListingMapForLocation from "./routes/ListingMapForLocation/ListingMapForLocation";
import Register from "./routes/Register/Register";
import Login from "./routes/Login/Login";
import { Logout } from "./auth/Logout";
import PrivateRoute from "./auth/PrivateRoute";
import AddListing from "./routes/AddListing/AddListing";
import AdminLayout from "./admin/AdminLayout/AdminLayout";
import AdminRoute from "./auth/AdminRoute";
import AdminUsersList from "./admin/routes/AdminUsersList/AdminUsersList";
import AdminCityList from "./admin/routes/AdminCityList/AdminCityList";
import AdminCityPage from "./admin/routes/AdminCityPage/AdminCityPage";
import AdminAddCity from "./admin/routes/AdminAddCity/AdminAddCity";
import AdminEditCity from "./admin/routes/AdminEditCity/AdminEditCity";
import EditUser from "./routes/EditUser/EditUser";
import EditListing from "./routes/EditListing/EditListing";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/listings",
          element: <ListPage />,
        },
        {
          path: "/listing/:id",
          element: <ListingPage />,
          loader: listingPageLoader,
        },
        {
          path: "/listing/add",
          element: (
            <PrivateRoute>
              <AddListing />
            </PrivateRoute>
          ),
        },
        {
          path: "/listing/edit/:id",
          element: (
            <PrivateRoute>
              <EditListing />
            </PrivateRoute>
          ),
        },
        {
          path: "/listing/location/:name",
          element: <ListingMapForLocation />,
          loader: cityByNameLoader,
        },
        {
          path: "/profile/:id",
          element: <User />,
          loader: userPageLoader,
        },
        {
          path: "/profile/edit/:id",
          element: <EditUser />,
          loader: userPageLoader,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/logout",
          element: (
            <PrivateRoute>
              <Logout />
            </PrivateRoute>
          ),
        },
        {
          path: "/about",
          element: <About />,
        },
      ],
    },
    {
      path: "/",
      element: <AdminLayout />,
      children: [
        {
          path: "/admin/cities",
          element: (
            <AdminRoute>
              <AdminCityList />
            </AdminRoute>
          ),
        },
        {
          path: "/admin/cities/:id",
          element: (
            <AdminRoute>
              <AdminCityPage />
            </AdminRoute>
          ),
        },
        {
          path: "/admin/cities/add",
          element: (
            <AdminRoute>
              <AdminAddCity />
            </AdminRoute>
          ),
        },
        {
          path: "/admin/cities/edit/:id",
          element: (
            <AdminRoute>
              <AdminEditCity />
            </AdminRoute>
          ),
        },
        {
          path: "/admin/users",
          element: (
            <AdminRoute>
              <AdminUsersList />
            </AdminRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
