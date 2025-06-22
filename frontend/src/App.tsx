import { HashRouter as Router, Routes, Route } from "react-router-dom";
import TechGrid from "./pages/techGrid";
import ClothesGrid from "./pages/clothesGrid";
import AllGrid from "./pages/allGrid";

import Layout from "./Layout";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Detail from "./pages/Detail";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<AllGrid />} />
            <Route path="tech" element={<TechGrid />} />
            <Route path="clothes" element={<ClothesGrid />} />
            <Route path="Detail/:id" element={<Detail />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
