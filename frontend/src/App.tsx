import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Layout children={<span>Home page</span>} />}
        ></Route>
        <Route
          path="/search"
          element={<Layout children={<span>search page</span>} />}
        ></Route>
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        ></Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
