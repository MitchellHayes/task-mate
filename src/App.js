import React from "react";
import Todo from "./components/todo";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Mate</h1>
      </header>
      <div className="Todo">
        <Todo />
      </div>
    </div>
  );
}

export default App;
