import React from "react";
import Todo from "./components/todo";
import EventList from "./components/eventList"
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Task Mate</h1>
      </header>
      <div className="EventList">
        <EventList />
      </div>
      <div className="Todo">
        <Todo />
      </div>
    </div>
  );
}

export default App;
