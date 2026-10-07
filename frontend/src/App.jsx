import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Habits from "./components/Habits.jsx";
import Calendar from "./components/Calendar.jsx";
import HabitDetail from "./components/HabitDetail.jsx";
import RequireAuth, { RedirectIfAuth } from "./components/RequireAuth.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
            <Route element={<RedirectIfAuth />}>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route path="/habits" element={<Habits />} />
              <Route path="/habits/:id" element={<HabitDetail />} />
              <Route path="/calendar" element={<Calendar />} />
            </Route>
      </Routes>
    </BrowserRouter>
  );
}
