import {useEffect, useState} from "react";
import TodoService from "./services/TodoService";
import AppHeader from "./components/app-header/app-header";
import TodoList from "./components/todo-list/TodoList";
import 'bootstrap/dist/css/bootstrap.min.css';
import ItemAddForm from "./components/item-add-form/ItemAddForm";
import "./App.css";
import SearchPanel from "./components/search-panel/search-panel";
import ItemStatusFilter from "./components/item-status-filter/ItemStatusFilter";
import Footer from "./components/footer/footer";

function App() {

    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');
    const [term, setTerm] = useState('');

    useEffect(() => {
        TodoService.getAllTodos().then(response => {
            setTodos(response.data)
        });
    }, [])
    const deleteTodo = (id) => {
        TodoService.deleteTodo(id).then(response => {
            setTodos(todos.filter((todos) => todos.id !== id))
        })
    }

    const addItem = (message) => {
        let todo = {
            message: message,
            done: false,
            active: false,
            important: false
        };

        TodoService.addTodo(todo).then(response => {
            setTodos([...todos, response.data])
        })
    }

    const toggleProperty = (todos, response, id) => {
        const index = todos.findIndex(todo => todo.id === id);

        console.log("B")
        //Update value in general list!
        return [
            ...todos.slice(0, index),
            response,
            ...todos.slice(index + 1)
        ];
    };

    const onToggleImportant = (todo) => {
        TodoService.setImportantTodo(todo).then(response => {
            setTodos(toggleProperty(todos, response.data, todo.id));
        })
    }
    const onToggleDone = (todo) => {
        TodoService.setDoneTodo(todo).then(response => {
            setTodos(toggleProperty(todos, response.data, todo.id))
        })
    }
    const onFilterChange = (filter) => {
        setFilter(filter)
    }
    const doneCount = todos.filter((todo) => todo.done).length;
    const todoCount = todos.length - doneCount;

    const searchTodo = (items, term) => {
        if(term.length === 0)
            return items;
        return items.filter(item => {
            return item.message.toLowerCase().indexOf(term.toLowerCase()) > -1
        })
    }

    const filterTodo = (items, filter) => {
        switch(filter) {
            case 'all' : return items;
            case 'active' : return items.filter(item=>!item.done)
            case 'done' : return items.filter(item=>item.done);
            default : return items;
        }
    }

    const onSearchChange = (term) => {
        setTerm(term);
    }

    const visibleItems = filterTodo(searchTodo(todos, term), filter);

    return (
        <div>
            <div className="todo-app">
                <AppHeader toDo={todoCount} done={doneCount}/>
                <div className="top-panel d-flex">
                    <SearchPanel onSearchChange={onSearchChange}/>
                    <ItemStatusFilter filter={filter}
                                      onFilterChange={onFilterChange}/>
                </div>
                <TodoList todos={visibleItems}
                          onDeleted={deleteTodo}
                          onToggleImportant={onToggleImportant}
                          onToggleDone={onToggleDone}/>
                <ItemAddForm onItemAdded={addItem}/>
            </div>
            <Footer/>
        </div>
    );
}

export default App;
