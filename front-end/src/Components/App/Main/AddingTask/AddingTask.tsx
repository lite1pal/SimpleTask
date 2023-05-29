import { useState } from "react";
import "./AddingTask.css";

import Cookies from "js-cookie";

const AddingTask = ({
  addTask,
  addTaskComponentVision,
  tasks,
  setTasks,
}: any) => {
  const [inputs, setInputs] = useState({ title: "", deadline: new Date() });

  const onChangeSetInputs = (e: any) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const createTaskWithDeadline = async (e: any) => {
    e.preventDefault();
    try {
      let { title, deadline } = inputs;
      deadline = new Date(deadline);
      const body = { title, deadline, user_id: Cookies.get("id") };
      if (!title || !deadline) return console.log("All inputs are required.");
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      };
      const response = await fetch(
        `http://localhost:4001/tasks/create`,
        requestOptions
      );
      const parseRes = await response.json();
      console.log(parseRes);
      if (response.ok) {
        // something's going on
        e.target.title.value = "";
        e.target.deadline.value = "";
        const newTask = parseRes.newTask;
        setTasks([...tasks, newTask]);
      }
    } catch (error) {
      return console.error(error);
    }
  };
  return (
    <div
      ref={addTask}
      className={`AddingTask ${addTaskComponentVision ? "" : "hide"}`}
    >
      <form onSubmit={(e) => createTaskWithDeadline(e)}>
        <div className="task-title">
          <h5>What is a task?</h5>
          <input onChange={onChangeSetInputs} type="text" name="title" />
        </div>
        <div className="task-deadline">
          <h5>Due date</h5>
          <input
            onChange={onChangeSetInputs}
            type="datetime-local"
            name="deadline"
            required
          />
        </div>
        <button type="submit" className="add-task2" title="Add a task">
          Add a task
        </button>
      </form>
    </div>
  );
};

export default AddingTask;
