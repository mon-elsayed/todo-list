// import { useRef, useState } from "react";
// import "./App.css";

// function App() {
//   const [todos, setTodos] = useState([]);

//   const inputRef = useRef();

//   const handleAddTodo = () => {
//     const text = inputRef.current.value;
//     const newItem = { completed: false, text };
//     setTodos([...todos, newItem]);
//     inputRef.current.value = "";
//   };

//   const handleItemDone = (index) => {
//     const newTodos = [...todos];
//     newTodos[index].completed = !newTodos[index].completed;
//     setTodos(newTodos);
//   };

//   const handleDeleteItem = (index) => {
//     const newTodos = [...todos];
//     newTodos.splice(index, 1)
//     setTodos(newTodos)
//   }

//   return (
//     <div className="App">
//       <h2>To Do List</h2>
//       <div className="to-do-container">
//         <ul>
//           {todos.map(({ text, completed }, index) => {
//             return (
//               <div className="item">
//                 <li
//                   className={completed ? "done" : ""}
//                   key={index}
//                   onClick={() => handleItemDone(index)}
//                 >
//                   {text}
//                 </li>
//                 <span onClick={() => handleDeleteItem(index)} className="trash">❌</span>
//               </div>
//             );
//           })}
//         </ul>
//         <input ref={inputRef} placeholder="Enter item..." />
//         <button onClick={handleAddTodo}>Add</button>
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import './index.css';
import { Trash } from 'lucide-react';

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput('');
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos
    .filter((todo) => todo.text.toLowerCase().includes(search.toLowerCase()))
    .filter((todo) => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'incomplete') return !todo.completed;
      return true;
    });

  return (
    <div className="min-h-screen bg-background dark:bg-[#111827] text-foreground transition-colors duration-300 flex items-center justify-center">
      <div className="container mx-auto p-4 max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary dark:text-white">Todo List</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <form onSubmit={addTodo} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              Add
            </button>
          </div>
        </form>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            } hover:bg-primary hover:text-white transition`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-lg ${
              filter === 'completed'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            } hover:bg-primary hover:text-white transition`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('incomplete')}
            className={`px-3 py-1 rounded-lg ${
              filter === 'incomplete'
                ? 'bg-primary text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            } hover:bg-primary hover:text-white transition`}
          >
            Incomplete
          </button>
        </div>

        <ul className="space-y-2">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-transform transform hover:-translate-y-1 animate-fadeIn"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-5 w-5 text-primary rounded focus:ring-primary"
                />
                <span
                  className={`${
                    todo.completed
                      ? 'line-through text-gray-500 dark:text-gray-400'
                      : 'text-foreground'
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                  <Trash />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;