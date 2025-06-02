export const Task = ({
  id,
  taskName,
  deleteTask,
  completeTask,
  completed,
  isTimeUp,
}) => {
  const handleCheckbox = (e) => {
    if (!completed && e.target.checked) {
      const audio = new Audio("complete audio.wav");
      audio.play();
      completeTask(id);
    }
  };

  return (
    <div
      key={id}
      className="task-card"
      style={{
        backgroundColor: completed ? "#4CAF50" : "#f0f0f0",
        color: completed ? "#fff" : "#000",
        transition: "0.3s",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <input
          type="checkbox"
          checked={completed}
          disabled={completed || !isTimeUp}
          onChange={(e) => {
            if (!completed && e.target.checked && isTimeUp) {
              const audio = new Audio("complete audio.wav");
              audio.play();
              completeTask(id);
            }
          }}
          style={{
            transform: "scale(1.2)",
            cursor: completed || !isTimeUp ? "not-allowed" : "pointer",
          }}
        />

        <h3
          style={{
            margin: 0,
            textDecoration: completed ? "line-through" : "none",
          }}
        >
          {taskName}
        </h3>
      </div>
      <button className="delete-btn" onClick={() => deleteTask(id)}>
        ❌
      </button>
    </div>
  );
};
