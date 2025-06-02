import "./App.css";
import { useState } from "react";
import { Task } from "./components/Task";
import { motivationalQuotes } from "./components/Motivational";
import { useEffect } from "react";

function App() {
  const THREE_HOURS = 3 * 60 * 60; // in seconds
  const [timeLeft, setTimeLeft] = useState(300);//Testing
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // cleanup on unmount
  }, []);

  const [userName, setUserName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [quote, setQuote] = useState("");

  const handleNameSubmit = () => {
    if (userName.trim()) {
      setSubmittedName(userName.trim());
      const randomQuote =
        motivationalQuotes[
          Math.floor(Math.random() * motivationalQuotes.length)
        ];
      setQuote(randomQuote);
      setUserName("");
    }
  };

  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Africa/Lagos",
  });

  const [todoList, setTodoList] = useState([]);
  const [newTask, setNewTask] = useState("");

  const handleChange = (event) => {
    setNewTask(event.target.value);
  };

  const addTask = () => {
    if (newTask.trim() === "") return;

    const task = {
      id: todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1,
      taskName: newTask.trim(),
      completed: false,
    };
    setTodoList([...todoList, task]);
    setNewTask(""); // Clear input after adding
  };

  const deleteTask = (id) => {
    setTodoList(todoList.filter((task) => task.id !== id));
  };

  const completeTask = (id) => {
    setTodoList(
      todoList.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        } else {
          return task;
        }
      })
    );
  };

  return (
    <div className="App">
      <div className="splash-screen">
        <h1>Welcome to Dev Ajala's Productivity App</h1>
        <p>Stay motivated, stay organized 💪</p>
      </div>

      <div className="name-section">
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleNameSubmit();
            }
          }}
        />
        <button onClick={handleNameSubmit}>Submit</button>
      </div>

      <h2>
        {submittedName
          ? `${submittedName}'s To-Do List for ${today}`
          : `To-Do List for ${today}`}
      </h2>
      {quote && (
        <div className="quote-box">
          <p>"{quote}"</p>
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          backgroundColor: "#f2f2f2",
          padding: "10px",
        }}
      >
        <h2 style={{ color: "black" }}>Countdown Timer</h2>
        <p style={{ fontSize: "20px", fontWeight: "bold", color: "black" }}>
          {Math.floor(timeLeft / 3600)}h : {Math.floor((timeLeft % 3600) / 60)}m
          : {timeLeft % 60}s
        </p>

        {isTimeUp && (
          <div
            style={{
              backgroundColor: "#ffcccb", // soft red or coral
              color: "#333",
              padding: "10px",
              borderRadius: "6px",
              marginTop: "10px",
            }}
          >
            <strong>⏰ Time's up!</strong> Please click the task you have
            completed.
            <audio autoPlay loop>
              <source src="end of time audio.wav" type="audio/wav" />
            </audio>
          </div>
        )}
      </div>

      <div className="AddTask">
        <input
          type="text"
          placeholder="Enter your task"
          value={newTask}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask();
            }
          }}
        />

        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="list-container">
        {todoList.map((task) => {
          return (
            <Task
              taskName={task.taskName}
              id={task.id}
              deleteTask={deleteTask}
              completed={task.completed}
              completeTask={completeTask}
              isTimeUp={isTimeUp}
            />
          );
        })}
      </div>
      <footer className="app-footer">
        <p>Made with ❤️ by Dev Ajala</p>
      </footer>
    </div>
  );
}

export default App;
