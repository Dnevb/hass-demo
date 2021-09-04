import { BrowserRouter, Route, Switch } from "react-router-dom";
import Layout from "./components/Layout";
import HistorialPage from "./pages/Historial";
import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ProductCreate from "./pages/ProductCreate";
import ProductoPage from "./pages/ProductoPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/producto/create" component={ProductCreate} />
          <Route path="/historial" component={HistorialPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/:id" component={ProductoPage} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
