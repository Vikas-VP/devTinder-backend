import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./components/Home";
import Login from "./components/Login";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import { Profile } from "./components/Profile";
import { Feed } from "./components/Feed";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename={"/"}>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
