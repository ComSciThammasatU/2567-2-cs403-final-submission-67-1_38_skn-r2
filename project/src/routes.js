import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import CreateProject from "./pages/CreateProject";
import Notepad from "./pages/Notepad";
import EditorLayout from "./pages/EditorLayout";
import ItemsPanel from "./pages/ItemsPanel";
import TimelinePanel from "./pages/TimelinePanel";
import NewCharacter from "./pages/NewCharacter";
import CharacterListPanel from "./pages/CharacterListPanel";
import ProjectList from "./pages/ProjectList";


function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Create" element={<CreateProject />} />
                <Route path="/NewCharacter" element={<NewCharacter />} />
                <Route path="/Notepad" element={<Notepad />} />
                <Route path="/editor" element={<EditorLayout />} />
                <Route path="/items" element={<ItemsPanel />} />
                <Route path="/timeline" element={<TimelinePanel />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default AppRoutes;
