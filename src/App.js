import "./App.css";
import { useState, useEffect, useRef } from "react";
import { Task } from "./components/Task";
import { motivationalQuotes } from "./components/Motivational";

function App() {
  const alarmRef = useRef(null);
  const THREE_HOURS = 3 * 60 * 60;

  const today = new Date().toDateString(); // Used for daily-based keys
  const displayToday = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Africa/Lagos",
  });

  const [timeLeft, setTimeLeft] = useState(THREE_HOURS);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "");
  const [submittedName, setSubmittedName] = useState(() => localStorage.getItem("userName") || "");

  const [quote, setQuote] = useState(() => {
    const savedQuote = localStorage.getItem(`quote_${today}`);
    return savedQuote || "";
  });

  const [todoList, setTodoList] = useState(() => {
    const savedTasks = localStorage.getItem(`todoList_${today}`);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    let savedStartTime = localStorage.getItem("startTime");
    const savedDate = localStorage.getItem("timerDate");

    if (savedDate !== today || !savedStartTime) {
      const now = Date.now();
      localStorage.setItem("startTime", now);
      localStorage.setItem("timerDate", today);
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
  }, [today]);

  useEffect(() => {
    localStorage.setItem(`todoList_${today}`, JSON.stringify(todoList));
  }, [todoList, today]);

  const handleNameSubmit = () => {
    if (userName.trim()) {
      setSubmittedName(userName.trim());
      localStorage.setItem("userName", userName.trim());

      if (!quote) {
        const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        setQuote(randomQuote);
        localStorage.setItem(`quote_${today}`, randomQuote);
      }

      setUserName("");
    }
  };

  const handleChange = (event) => setNewTask(event.target.value);

  const addTask = () => {
    if (newTask.trim() === "") return;
    const task = {
      id: todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1,
      taskName: newTask.trim(),
      completed: false,
    };
    setTodoList([...todoList, task]);
    setNewTask("");
  };

  const deleteTask = (id) => setTodoList(todoList.filter((task) => task.id !== id));

  const completeTask = (id) =>
    setTodoList(
      todoList.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

  const progressPercentage = ((THREE_HOURS - timeLeft) / THREE_HOURS) * 100;

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
          onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
        />
        <button onClick={handleNameSubmit}>Submit</button>
      </div>

      <h2>
        {submittedName
          ? `${submittedName}'s To-Do List for ${displayToday}`
          : `To-Do List for ${displayToday}`}
      </h2>

      {quote && (
        <div className="quote-box">
          <p>"{quote}"</p>
        </div>
      )}

      <div style={{ marginTop: "20px", backgroundColor: "#f2f2f2", padding: "10px" }}>
        <h2 style={{ color: "black" }}>Countdown Timer</h2>
        <p style={{ fontSize: "20px", fontWeight: "bold", color: "black" }}>
          {Math.floor(timeLeft / 3600)}h : {Math.floor((timeLeft % 3600) / 60)}m : {timeLeft % 60}s
        </p>

        {/* Progress Bar */}
        <div
          style={{
            width: "100%",
            backgroundColor: "#ddd",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "10px",
            height: "20px",
          }}
        >
          <div
            style={{
              width: `${progressPercentage}%`,
              height: "100%",
              backgroundColor: "#4CAF50",
              transition: "width 1s linear",
            }}
          />
        </div>

        {isTimeUp && (
          <div
            style={{
              backgroundColor: "#ffcccb",
              color: "#333",
              padding: "10px",
              borderRadius: "6px",
              marginTop: "10px",
            }}
          >
            <strong>⏰ Time's up!</strong> Please click the tasks you have completed.
            <audio ref={alarmRef} autoPlay loop>
              <source src="reign.mp3" type="audio/mp3" />
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
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="list-container">
        {todoList.map((task) => (
          <Task
            key={task.id}
            taskName={task.taskName}
            id={task.id}
            deleteTask={deleteTask}
            completed={task.completed}
            completeTask={completeTask}
            isTimeUp={isTimeUp}
          />
        ))}
      </div>

      {showCongrats && (
        <div className="congrats-message">
          🎉 Well done, {submittedName || "champ"}! See you tomorrow. Stay consistent 💪
        </div>
      )}

      <footer className="app-footer">
        <p>Made with ❤️ by Dev Ajala</p>
      </footer>
    </div>
  );
}

export default App;
