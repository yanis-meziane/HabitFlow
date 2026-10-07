import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
            <Route path="/" element = {<Home />} />
            <Route path="/register" element = {<Register />} />
            <Route path="/login" element = {<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
