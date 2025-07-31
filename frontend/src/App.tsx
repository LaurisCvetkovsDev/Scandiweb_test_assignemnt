import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProductGrid from "./pages/ProductGrid";
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
            <Route path="/" element={<Navigate to="/all" replace />} />
            <Route path="/all" element={<ProductGrid />} />
            <Route path="/tech" element={<ProductGrid />} />
            <Route path="/clothes" element={<ProductGrid />} />
            <Route path="/Detail/:id" element={<Detail />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
