
import React, { useState, useEffect } from 'react';
import './index.css';
import { Trash, Pen, Save } from 'lucide-react'; // أضفنا Check لأيقونة الحفظ

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
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Toggle Dark Mode and save to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Add a new todo
  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput('');
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Start editing a todo
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  // Save edited todo
  const saveEdit = (id) => {
    if (!editText.trim()) {
      setEditingId(null);
      return;
    }
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditingId(null);
    setEditText('');
  };

  // Filter todos based on search and filter state
  const filteredTodos = todos
    .filter((todo) => todo.text.toLowerCase().includes(search.toLowerCase()))
    .filter((todo) => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'incomplete') return !todo.completed;
      return true;
    });

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-white transition-colors duration-300 flex items-center justify-center">
      <div className="container mx-auto p-4 max-w-lg">
        {/* Header with title and Dark Mode toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground dark:text-white">Todo List</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Add todo form */}
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

        {/* Search bar */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>

        {/* Filter buttons */}
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

        {/* Todo list */}
        <ul className="space-y-2">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-3 w-full break-words bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-transform transform hover:-translate-y-1 animate-fadeIn"
            >
              <div className="flex items-center gap-3 flex-1 overflow-hidden">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-5 w-5 text-primary rounded focus:ring-primary"
                />
                {editingId === todo.id ? (
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => saveEdit(todo.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(todo.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="flex-1 p-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary break-words max-w-full"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(todo.id)}
                      className="text-green-500 hover:text-green-700 transition hover:scale-110"
                    >
                       <Save  size={20}/>
                    </button>
                  </div>
                ) : (
                  <span
                    className={`flex-1 break-words max-w-full ${
                      todo.completed
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : 'text-foreground dark:text-white'
                    }`}
                  >
                    {todo.text}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                {editingId !== todo.id && (
                  <button
                    onClick={() => startEditing(todo.id, todo.text)}
                    className="text-blue-500 hover:text-blue-700 transition hover:scale-110"
                  >
                    <Pen size={20} />
                  </button>
                )}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 transition hover:scale-110"
                >
                  <Trash size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
