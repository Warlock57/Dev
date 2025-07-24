import { Button } from "@chakra-ui/react";
import './App.css';
import HomePage from "./pages/HomePage";
import { BrowserRouter as Routes, Route, Switch } from "react-router-dom";
import ChatPage from "./pages/ChatPage";


function App() {
  return (
    <div className="App">
      <Switch>
      <Route path="/" component={HomePage} exact />
      <Route path="/chats"  component={ChatPage} />
      </Switch>
    </div>
  );
}

export default App;
