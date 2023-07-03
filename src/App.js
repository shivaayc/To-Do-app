import React, { useEffect, useState } from 'react';
import './App.css';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllTasks, setShowAllTasks] = useState(false);

  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));

    setNewTitle('');
    setNewDescription('');
    setSearchQuery('');
  };

  const handleDeleteTodo = (index) => {
    const updatedTodoArr = allTodos.filter((_, i) => i !== index);
    setTodos(updatedTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
  };

  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = `${dd}-${mm}-${yyyy} at ${h}:${m}:${s}`;

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };
    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index);
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr));
  };

  const handleCompletedDeleteTodo = (index) => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1);

    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
  };

  const handleSearch = () => {
    const filteredTodos = allTodos.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setTodos(filteredTodos);
  };

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodo) {
      setTodos(savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);

  return (
    <div>
      <h1>To-Do List</h1>
      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the Task Title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the Task Description?"
            />
          </div>
          <div className="todo-input-item">
            <button type="button" onClick={handleAddTodo} className="primaryBtn">
              Add
            </button>
          </div>
          <div className="todo-input-item">
            <label>Search</label>
            <div className="search-input">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for tasks"
              />
              <button type="button" onClick={handleSearch} className="secondaryBtn">
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`secondaryBtn ${!isCompleteScreen && !showAllTasks && 'active'}`}
            onClick={() => {
              setIsCompleteScreen(false);
              setShowAllTasks(false);
            }}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen && !showAllTasks && 'active'}`}
            onClick={() => {
              setIsCompleteScreen(true);
              setShowAllTasks(false);
            }}
          >
            Completed
          </button>
          <button
            className={`secondaryBtn ${showAllTasks && 'active'}`}
            onClick={() => setShowAllTasks(true)}
          >
            All
          </button>
        </div>
        <div className="todo-list">
          {(!isCompleteScreen || showAllTasks) &&
            allTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteTodo(index)}
                      title="Delete?"
                    />
                    {!isCompleteScreen && (
                      <BsCheckLg
                        className="check-icon"
                        onClick={() => handleComplete(index)}
                        title="Complete?"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          {(isCompleteScreen || showAllTasks) &&
            completedTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <p>
                    <small>Completed On: {item.completedOn}</small>
                  </p>
                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleCompletedDeleteTodo(index)}
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
