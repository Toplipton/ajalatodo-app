import "./App.css";
import { useState } from "react";
import { Task } from "./components/Task";
import { motivationalQuotes } from "./components/Motivational";
import { useEffect } from "react";
import { useRef } from "react";

function App() {
  const alarmRef = useRef(null);
  const THREE_HOURS = 3 * 60 * 60;
  const [timeLeft, setTimeLeft] = useState(THREE_HOURS); // Keep it, but it will now be updated by actual time diff
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    let savedStartTime = localStorage.getItem("startTime");
  
    if (!savedStartTime) {
      const now = Date.now();
      localStorage.setItem("startTime", now);
      savedStartTime = now;
    } else {
      savedStartTime = parseInt(savedStartTime, 10);
    }
  
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - savedStartTime) / 1000);
      const remaining = THREE_HOURS - elapsedSeconds;
  
      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        setIsTimeUp(true);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
  
    return () => clearInterval(timer);
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

  useEffect(() => {
    if (
      isTimeUp &&
      todoList.length > 0 &&
      todoList.every((task) => task.completed)
    ) {
      setTimeout(() => {
        setShowCongrats(true);
        if (alarmRef.current) {
          alarmRef.current.pause();
          alarmRef.current.currentTime = 0;
        }
      }, 500);
    }
  }, [todoList, isTimeUp]);

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
            <strong>⏰ Time's up!</strong> Please click the tasks you have
            completed.
            <audio ref={alarmRef} autoPlay loop>
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
      {showCongrats && (
        <div className="congrats-message">
          🎉 Well done, {submittedName || "champ"}! See you tomorrow. Stay
          consistent 💪
        </div>
      )}

      <footer className="app-footer">
        <p>Made with ❤️ by Dev Ajala</p>
      </footer>
    </div>
  );
}

export default App;
