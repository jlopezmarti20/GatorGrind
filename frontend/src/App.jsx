import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AddBusiness from "./pages/AddBusiness";
import Business from "./pages/Business";
import MapView from "./pages/MapView";
import GridView from "./pages/GridView"
import Bookmarks from "./pages/Bookmarks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-business" element={<AddBusiness />} />
        <Route path="/business/:id" element={<Business />} />
        <Route path="/map-view" element={<MapView />} />
        <Route path="/grid-view" element={<GridView />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
