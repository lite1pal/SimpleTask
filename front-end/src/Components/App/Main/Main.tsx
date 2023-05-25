import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  user: string;
}

const Main = ({
  changeAuthStatus,
}: {
  changeAuthStatus: (status: boolean) => void;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const logOut = () => {
    Cookies.remove("id");
    Cookies.remove("name");
    Cookies.remove("email");
    Cookies.remove("sessionId");
    changeAuthStatus(false);
  };
  const createTask = async (e: any) => {
    e.preventDefault();
    try {
      const body = { title: e.target.task.value, user: Cookies.get("id") };
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      };
      const response = await fetch(
        "http://localhost:4001/tasks/create",
        requestOptions
      );
      const parseRes = await response.json();
      if (response.ok) {
        console.log(parseRes);
        const newTask: Task = parseRes.newTask;
        setTasks([...tasks, newTask]);
      }
    } catch (error) {
      return console.error(error);
    }
  };

  useEffect(() => {
    const getTasks = async () => {
      try {
        const user_id = Cookies.get("id");
        console.log(1);
        const requestOptions = {
          method: "GET",
          headers: { "Content-type": "application/json" },
        };
        const response = await fetch(
          `http://localhost:4001/tasks/${user_id}`,
          requestOptions
        );
        const parseRes = await response.json();
        console.log(parseRes);
        if (response.ok) {
          setTasks(parseRes.tasks);
        }
      } catch (error) {
        return console.error(error);
      }
    };
    getTasks();
  }, []);
  return (
    <div className="Main">
      <div className="header">
        <h1>Your tasks for the day</h1>
        <button onClick={logOut}>Log out</button>
      </div>
      <div className="tasks-field">
        <ul>
          {tasks.map((task: Task) => {
            return <li key={task._id}>{task.title}</li>;
          })}
          {/* <li>make a bed</li>
          <li>create tests for react</li>
          <li>relax</li> */}
        </ul>
      </div>
      <div className="input-field">
        <form onSubmit={createTask}>
          <input type="text" name="task" placeholder="add a task to complete" />
          <button type="submit">+</button>
        </form>
      </div>
    </div>
  );
};

export default Main;
