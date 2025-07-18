import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "@/pages/home/HomePage";
import LoginPage from "@/pages/login/LoginPage";
import Layout from "@/components/layout/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
