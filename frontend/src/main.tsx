import React from "react";
import ReactDOM from "react-dom/client";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
// import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StoreProvider } from "./Store.tsx";
import SigninPage from "./pages/SigninPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import StartPage from "./pages/StartPage.tsx";
import WhatPage from "./pages/WhatPage.tsx";
import WherePage from "./pages/WherePage.tsx";
import WhenPage from "./pages/WhenPage.tsx";
import SummaryPage from "./pages/SummaryPage.tsx";
import PostPage from "./pages/PostPage.tsx";
import AdminStartPage from "./pages/AdminStartPage.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="signin" element={<SigninPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route index={true} element={<StartPage />} />

        <Route path="/post/:id" element={<PostPage />} />
        <Route path="what" element={<WhatPage />} />
        <Route path="where" element={<WherePage />} />
        <Route path="when" element={<WhenPage />} />
        <Route path="summary" element={<SummaryPage />} />
        <Route path="admin" element={<AdminStartPage />} />
      </Route>
    </Route>
  )
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </HelmetProvider>
      
    </StoreProvider>
  </React.StrictMode>
);
