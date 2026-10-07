import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Habits from "./components/Habits.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
            <Route path="/" element = {<Home />} />
            <Route path="/register" element = {<Register />} />
            <Route path="/login" element = {<Login />} />
            <Route path="/habit" element = {<Habits />} />
      </Routes>
    </BrowserRouter>
  );
}
