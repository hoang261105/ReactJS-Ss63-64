import axios from "axios";
import Signup from "./components/Signup/Signup";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login/Login";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
