import React from 'react';
import TodoListItem from "../todo-list-item/TodoListItem";
import "./todo-list.css";

const TodoList = ({todos, onDeleted, onToggleImportant, onToggleDone}) => {
    if(!todos.length) {
        return <h1 style={{textAlign: "center"}}>Справ нема!</h1>
    }
   const elements = todos.map((todo) => {
       //todo: deserealization of object
       return (
           <li key={todo.id} className="list-group-item">
               <TodoListItem
                   todo={todo}
                   onDeleted={() => onDeleted(todo.id)}
                   onToggleDone={()=>onToggleDone(todo)}
                   onToggleImportant={()=>onToggleImportant(todo)}/>
           </li>
       )
   })

    return (
        <ul className="list-group todo-list">
            {elements}
        </ul>
    )
};

export default TodoList;