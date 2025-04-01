import React, { useState, useEffect } from 'react';
import './App.css';

function App() {

  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    } else {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  },[todos]);

  const addTodo = (todo, priority) => {
    setTodos([ ...todos, {
      id:Date.now(),
      text:todo,
      completed:false,
      priority:priority,
      date:new Date().toLocaleDateString()
    }]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  const editTodo = (id, newText) => {
    setTodos(
      todos.map((todo) => todo.id === id ? {...todo, text:newText} : todo)
    );
  };

  const sortByDate = () => {
    setTodos([...todos].sort((a, b) => new Date(a.date) - new Date(b.date)));
  };
  const sortByPriority = () => {
    const priorityOrder = {
      '超急件': 1,
      '急件': 2,
      '普通件': 3
    };
    setTodos([...todos].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]));
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  function TodoItem({ todo, toggleTodo, deleteTodo, editTodo }) {
    
    let priorityStyle = {};
    switch (todo.priority) {
      case '超急件':
        priorityStyle = { color: 'red' };
        break;
      case '急件':
        priorityStyle = { color: 'orange' };
        break;
      case '普通件':
        priorityStyle = { color: 'green' };
        break;
      default:
        priorityStyle = {};
    }

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const [fadeClass, setFadeClass] = useState('fade-in');

    const handleToggle = () => {
      setFadeClass('fade-out');
      setTimeout(() => {
        toggleTodo(todo.id);
        setFadeClass('fade-in');
      }, 300); // 與 CSS 中的 transition 時間一致
    };
    
    const handleEdit = () => {
      editTodo(todo.id, editText);
      setIsEditing(false);
    };

    return (
      <li className={fadeClass}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        {todo.date} -
        {isEditing ? (
          <input type='text' value={editText} onChange={(e) => setEditText(e.target.value)} />
        ) : (
        <span style={{...priorityStyle,textDecoration:todo.completed ? 'line-through' : 'none'}}>
          {todo.text}
        </span>
        )}
        {!todo.completed ? (
          <>
            {isEditing ? (
          <button onClick={handleEdit}>儲存</button>
        ) : (
          <button onClick={() => setIsEditing(true)}>修改</button>
        )}
          </>) : ''
    }     
        <button onClick={() => deleteTodo(todo.id)}>刪除</button>
      </li>
    );
  }

  function TodoList({ todos, toggleTodo, deleteTodo, editTodo }) {
    const pendingTodos = todos.filter((todo) => !todo.completed);
    const completedTodos = todos.filter((todo) => todo.completed);

    return (
      <div>
        <h2>待辦事項</h2>
        <ul>
          {pendingTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} editTodo={editTodo} />
          ))}
        </ul>
        <h2>已完成事項</h2>
        <ul>
          {completedTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} toggleTodo={toggleTodo} deleteTodo={deleteTodo} editTodo={editTodo} />
          ))}
        </ul>
      </div>
    )
  }

  function TodoForm({ addTodo }) {
    const [todo,setTodo] = useState('');
    const [priority, setPriority] = useState('普通件');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (todo.trim()) {
        addTodo(todo,priority);
        setTodo('');
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <input type='text' value={todo} onChange={(e) => setTodo(e.target.value)} placeholder='新增待辦事項' />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value='普通件'>普通件</option>
          <option value='急件'>急件</option>
          <option value='超急件'>超急件</option>
        </select>
        <button type='submit'>新增</button>
        <button onClick={sortByDate} className='sortbtn'>依日期排序</button>
        <button onClick={sortByPriority} className='sortbtn'>依優先順序排序</button>
      </form>
    )

  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} editTodo={editTodo} />
    </div>
  );

}

export default App;
