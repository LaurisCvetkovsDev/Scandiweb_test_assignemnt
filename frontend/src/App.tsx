import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import ProductGrid from "./components/ProductGrid";
import Detail from "./pages/Detail";
import "./App.css";

function App() {
  console.log("App component loaded");

  return (
    <Router>
      <div className="App" data-testid="app">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ProductGrid category="all" />} />
            <Route
              path="/clothes"
              element={<ProductGrid category="clothes" />}
            />
            <Route path="/tech" element={<ProductGrid category="tech" />} />
            <Route path="/Detail/:id" element={<Detail />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
