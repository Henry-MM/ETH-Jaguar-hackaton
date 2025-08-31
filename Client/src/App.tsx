import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import RequestPage from "@/pages/request";
import { useConnections } from "wagmi";
import { useEffect } from "react";
import Test from "./pages/test";

function App() {
  const connections = useConnections();
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   if (location.pathname !== "/" && !connections.length) {
  //     return navigate("/");
  //   }
  // }, [connections]);

  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<RequestPage />} path="/request-loan" />
      <Route element={<Test />} path="/test" />
    </Routes>
  );
}

export default App;
