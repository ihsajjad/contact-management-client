import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Main from "./layouts/Main";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MyContacts from "./pages/myContacts/MyContacts";
import Register from "./pages/register/Register";
import AuthProvider from "./providers/AuthProviders";
import Login from "./pages/login/Login";
import PrivetRouter from "./routes/PrivetRouter";
import PermittedContacts from "./pages/permittedContacts/PermittedContacts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: (
          <PrivetRouter>
            <MyContacts />
          </PrivetRouter>
        ),
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/permitted-contacts",
        element: <PermittedContacts />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className="max-w-screen-xl	mx-auto">
          <RouterProvider router={router} />
        </div>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
