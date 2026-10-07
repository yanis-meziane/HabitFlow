import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Habits from "./components/Habits.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
            <Route path="/" element = {<Habits />} />
            <Route path="/register" element = {<Register />} />
            <Route path="/login" element = {<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
