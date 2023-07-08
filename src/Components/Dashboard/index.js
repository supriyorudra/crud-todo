import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Tasks from '../Tasks';
import { useNavigate } from 'react-router';
import io from 'socket.io-client';

import './styles.css'

const socket = io.connect("http://localhost:3001")

const Dashboard = () => {
  
  let users = localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')) : [];
  let currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : {};

  const [taskId, setTaskId] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Complete');
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(null);
  const [filterValue, setFilterValue] = useState('All');
  const [complete, setComplete] = useState([]);
  const [progress, setProgress] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [myUpdate, setMyUpdate] = useState([]);
  const [current, setCurrent] = useState(currentUser);

  const navigate = useNavigate();

  //store todos of the user from previous data 
  useEffect(() => {
    users.filter(user => {
      if ((currentUser.email === user.email) && user.todos) {
        setTodos(user.todos)
        setMyUpdate(user.todos);
        setTaskId(user.todos.length);
      }

    })
  }, [])

  //function to handle the edit functionality of given tasks
  const handleEdit = (e) => {
    setIsEdit(true);
    setTitle(todos[e.target.id].title);
    setDescription(todos[e.target.id].description)
    setDueDate(todos[e.target.id].dueDate)
    setStatus(todos[e.target.id].status)
    setCurrentIdx(e.target.id)
  }

  //function to delete task
  const handleDelete = (e) => {
    let update = todos.filter(todo => {
      return todo.taskId !== todos[e.target.id].taskId
    })
    toast.success('Task Deleted')
    currentUser.todos = [...update];
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
    setTodos(update);
    setMyUpdate(update);
    users.map(user => {
      if (user.email === currentUser.email) {
        user.todos = currentUser.todos;
      }
    })
    localStorage.setItem('users', JSON.stringify(users));
  }


  //function to handle the edit task button for changes
  const handleEditTask = (e) => {
    e.preventDefault();

    todos[currentIdx].title = title;
    todos[currentIdx].description = description;
    todos[currentIdx].dueDate = dueDate;
    todos[currentIdx].status = status;

    if (title && description && dueDate) {
      let update = [...todos]
      currentUser.todos = [...update];
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      setTodos(update);
      setMyUpdate(update);
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('Complete')
      toast.success('Task Added Successfully!');
      setIsEdit(false);
    }
    else {
      toast.warning('Fill all the details!');
    }
    users.map(user => {
      if (user.email === currentUser.email) {
        user.todos = currentUser.todos;
      }
    })
    localStorage.setItem('users', JSON.stringify(users));

  }


  //Function to add new tasks
  const handleTask = (e) => {
    e.preventDefault();
    if (title && description && dueDate) {

      setTaskId(taskId + 1);
      let update = [...todos];
      update.push({ title, description, dueDate, status, taskId });
      currentUser.todos = [...update];
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      socket.emit(update);

      setTodos(update);
      setMyUpdate(update);
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('Complete')
      toast.success('Task Saved Successfully!');
    }
    else {
      toast.warning('Fill all the details!');
    }
    users.map(user => {
      if (user.email === currentUser.email) {
        user.todos = currentUser.todos;
      }
    })
    localStorage.setItem('users', JSON.stringify(users));
  }

  useEffect(()=>{
    socket.on("receive todos", (data)=>{
      alert('Todos Received');
    })
  },[socket])

  // function to filter as comapre to status
  const handleFilter = (e) => {
    setFilterValue(e.target.value);
    setComplete(todos.filter(todo => {
      return todo.status === 'Complete'
    }));
    setProgress(todos.filter(todo => {
      return todo.status === 'In Progress'
    }));
    setIncomplete(todos.filter(todo => {
      return todo.status === 'Incomplete'
    }));

  }

  //function for sorting according to due date
  const handleSort = (e) => {
    e.preventDefault();
    let update = [...todos]
    setIsSorted(!isSorted);
    if (isSorted === true) {
      setTodos(update.sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA - dateB;
      }))
    }
    if (isSorted === false) {
      setTodos([...myUpdate]);
    }
  }

  //function to logout
  const handleLogout = (e) => {
    e.preventDefault();
    if(localStorage.getItem('currentUser')){
      toast.success('Logged Out!');
      localStorage.removeItem('currentUser');
      navigate('/login');
    }else{
      toast.error('User already Logged out! Please Login again to save data!')
    }
    
    
  }

  return (
    <div className='dashboard'>

      {/* Add new tasks form */}
      <form>
        <h2>To Do App</h2>

        <input 
          type="text" 
          placeholder='Title' 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder='Description' 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
        />
        <label htmlFor="dueDate">Due Date: </label>
        <input 
          type="date" 
          value={dueDate} 
          onChange={e => setDueDate(e.target.value)} 
        />
        <select 
          value={status} 
          onChange={e => setStatus(e.target.value)}
        >
          <option>Complete</option>
          <option>In Progress</option>
          <option>Incomplete</option>
        </select>
        {
          !isEdit ? (
            <button onClick={handleTask}>Add Task</button>
          ) : (
            <button onClick={handleEditTask}>Edit Task</button>
          )
        }
      </form>

      {/* display all the tasks and sorting and filtering functionality */}
      <hr />
      <div className="surfing">
        <select onChange={handleFilter}>
          <option>All</option>
          <option>Complete</option>
          <option>In Progress</option>
          <option>Incomplete</option>
        </select>

        <button onClick={handleSort}>
          Sort by Due Date
        </button>

        <button onClick={handleLogout}>Logout</button>

      </div>

      <ul>

        {/* show all the tasks */}
        {
          (filterValue == 'All') && todos && current && todos.map((todo, index) => (
            <Tasks
              key={index}
              todo={todo}
              index={index}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))
        }

        {/* show the tasks with complete status */}
        {
          (filterValue == 'Complete') && complete && complete.map((todo, index) => (
            <Tasks
              key={index}
              todo={todo}
              index={index}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))
        }

        {/* show the tasks with in progress status */}
        {
          (filterValue == 'In Progress') && progress && progress.map((todo, index) => (
            <Tasks
              key={index}
              todo={todo}
              index={index}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))
        }

        {/* show the task with incomplete status */}
        {
          (filterValue == 'Incomplete') && incomplete && incomplete.map((todo, index) => (
            <Tasks
              key={index}
              todo={todo}
              index={index}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))
        }
      </ul>

    </div>
  )
}

export default Dashboard