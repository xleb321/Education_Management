import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/Home/HomePage";
import AuthPage from "./pages/Auth/AuthPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route
            path="/register"
            element={<AuthPage initialMode="register" />}
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
