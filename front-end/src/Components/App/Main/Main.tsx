import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";

import "./Main.css";

import AddingTask from "./AddingTask/AddingTask";
import Loading from "../../Loading/Loading";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  deadline: Date;
  user: string;
}

const Main = ({
  changeAuthStatus,
  apiUrl,
  isLoading,
}: {
  changeAuthStatus: (status: boolean) => void;
  apiUrl: string;
  isLoading: boolean;
  setIsLoading: any;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addTaskComponentVision, setAddTaskComponentVision] = useState(false);
  // const [taskItemVision, setTaskItemVision] = useState(true);
  const taskRef = useRef(null);
  const addTask = useRef<HTMLElement | null>(null);
  let deadlineString: string;

  const logOut = () => {
    Cookies.remove("id");
    Cookies.remove("name");
    Cookies.remove("email");
    Cookies.remove("sessionId");
    changeAuthStatus(false);
  };

  const handleAddTaskVision = () => {
    if (addTaskComponentVision) {
      setAddTaskComponentVision(false);
    } else {
      setAddTaskComponentVision(true);
    }
  };

  const createTask = async (e: any) => {
    e.preventDefault();
    try {
      const body = { title: e.target.task.value, user_id: Cookies.get("id") };
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${Cookies.get("sessionId")} ${Cookies.get(
            "email"
          )}`,
        },
        body: JSON.stringify(body),
      };
      const response = await fetch(`${apiUrl}/tasks/create`, requestOptions);
      const parseRes = await response.json();
      console.log(parseRes);
      if (response.ok) {
        e.target.task.value = "";
        const newTask: Task = parseRes.newTask;
        setTasks([...tasks, newTask]);
      } else {
        console.log(parseRes);
      }
    } catch (error) {
      return console.error(error);
    }
  };

  const deleteTask = async (e: any, task: Task) => {
    e.preventDefault();
    try {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${Cookies.get("sessionId")} ${Cookies.get(
            "email"
          )}`,
        },
      };
      const response = await fetch(
        `${apiUrl}/tasks/delete/${task._id}`,
        requestOptions
      );
      const parseRes = await response.json();
      if (response.ok) {
        task.completed = true;
        setTasks([...tasks]);
      } else {
        console.log(parseRes);
      }
    } catch (error) {
      return console.error(error);
    }
  };

  useEffect(() => {
    const getTasks = async () => {
      try {
        const user_id = Cookies.get("id");
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${Cookies.get("sessionId")} ${Cookies.get(
              "email"
            )}`,
          },
        };
        const response = await fetch(
          `${apiUrl}/tasks/${user_id}`,
          requestOptions
        );
        const parseRes = await response.json();
        if (response.ok) {
          setTasks(parseRes.tasks);
        } else {
          console.log(parseRes);
        }
      } catch (error) {
        return console.error(error);
      }
    };
    getTasks();
  }, []);

  return (
    <div className="Main">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="header">
            <button title="Settings" className="header-settings">
              <i className="fa-solid fa-gear fa-2xl"></i>
            </button>
            <h1 className="header-title">Simple Task</h1>
            <button title="Log out" className="header-logout" onClick={logOut}>
              <i className="fa-solid fa-arrow-right-from-bracket fa-2xl"></i>
            </button>
          </div>
          <div className="tasks-field">
            <ul>
              {tasks.length > 0 ? (
                tasks.map((task: Task) => {
                  deadlineString =
                    task.deadline.toString() !== "2100-06-01T09:00:00.000Z"
                      ? new Date(task.deadline).toLocaleString(undefined, {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })
                      : "";

                  return (
                    <li ref={taskRef} className="task-item" key={task._id}>
                      <div className="complete-button">
                        <i
                          title="complete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(e, task);
                          }}
                          className={
                            task.completed ? "" : "fa-solid fa-circle-check"
                          }
                        ></i>
                      </div>
                      <div className="title">
                        <p>
                          {task.completed ? <s>{task.title}</s> : task.title}
                        </p>
                        <i>{deadlineString}</i>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="no-items">No tasks yet</li>
              )}
            </ul>
            <div className="add-icon">
              <i
                onClick={() => handleAddTaskVision()}
                className="fa-solid fa-circle-plus fa-2xl"
              ></i>
            </div>
            <AddingTask
              addTaskComponentVision={addTaskComponentVision}
              addTask={addTask}
              tasks={tasks}
              setTasks={setTasks}
              apiUrl={apiUrl}
            />
          </div>
          <div className="input-field">
            <form onSubmit={createTask}>
              <input
                className="input-task"
                autoComplete="off"
                type="text"
                name="task"
                placeholder="Quick task"
              />
              <button className="add-task" title="Add a task" type="submit">
                Add a task
              </button>
            </form>
          </div>
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default Main;
