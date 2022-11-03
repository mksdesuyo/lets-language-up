const todos = [];
const RENDER_EVENT = "render-todo";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";

document.addEventListener("DOMContentLoaded", () => {
    const submitForm = document.getElementById("form");
 
    submitForm.addEventListener("submit", (event) => {
        event.preventDefault();
        addTodo();

        submitForm.reset();
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, () => {
    const uncompletedTodos = document.getElementById("todos");
    uncompletedTodos.innerHTML = "";

    const completedTodos = document.getElementById("completed-todos");
    completedTodos.innerHTML = "";

    todos.forEach((todoItem) => {
        const todoElement = makeTodo(todoItem);
    
        todoItem.isCompleted == false ? uncompletedTodos.append(todoElement) : completedTodos.append(todoElement);
    });
});

const generateId = () => {
    return +new Date();
};
 
const generateTodoObject = (id, task, detail, timestamp, isCompleted) => {
    return {
        id,
        task,
        detail,
        timestamp,
        isCompleted
    };
};

const makeTodo = (todoObject) => {
    const textTitle = document.createElement("h3");
    textTitle.classList.add("card-title", "text-capitalize");
    textTitle.innerText = todoObject.task;

    const textDetail = document.createElement("p");
    textDetail.classList.add("card-text", "mb-2");
    textDetail.innerText = todoObject.detail;

    const textTimestamp = document.createElement("p");
    textTimestamp.classList.add("card-subtitle", "mb-2");
    textTimestamp.innerText = todoObject.timestamp;

    const textContainer1 = document.createElement("div");
    textContainer1.append(textTitle, textTimestamp, textDetail);

    const textContainer2 = document.createElement("div");
    textContainer2.classList.add("mb-2");

    const container = document.createElement("div");
    container.classList.add("card", "shadow-sm", "px-3", "py-2", "mt-3");
    container.append(textContainer1, textContainer2);
    container.setAttribute("id", `todo-${todoObject.id}`);

    if(todoObject.isCompleted){
        const undoButton = document.createElement("button");
        undoButton.classList.add("btn", "btn-warning", "me-2");
        undoButton.innerText = "Undo";
        undoButton.addEventListener("click", () => {
            undoTaskFromCompleted(todoObject.id);
        });
   
        const trashButton = document.createElement("button");
        trashButton.classList.add("btn", "btn-danger");
        trashButton.innerText = "Delete";
        trashButton.addEventListener("click", () => {
            removeTaskFromCompleted(todoObject.id);
        });
   
        textContainer2.append(undoButton, trashButton);
    }else{
        const checkButton = document.createElement("button");
        checkButton.classList.add("btn", "btn-success");
        checkButton.innerText = "Done";
        checkButton.addEventListener("click", () => {
            addTaskToCompleted(todoObject.id);
        });
   
        textContainer2.append(checkButton);
    }
    return container;
}

const addTodo = () => {
    const textTodo = document.getElementById("title").value;
    const textDesc = document.getElementById("description").value;
    const timestamp = document.getElementById("date").value;
  
    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTodo, textDesc, timestamp, false);
    todos.push(todoObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const addTaskToCompleted = (todoId) => {
    const todoTarget = findTodo(todoId);
    if(todoTarget == null) return;
  
    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const findTodo = (todoId) => {
    let todoItems = null;

    todos.forEach((todoItem) => {
        if(todoItem.id === todoId){
            todoItems = todoItem;
        }
    });
    return todoItems;
}

const removeTaskFromCompleted = (todoId) => {
    const todoTarget = findTodoIndex(todoId);
    if(todoTarget === -1) return;
    todos.splice(todoTarget, 1);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const undoTaskFromCompleted = (todoId) => {
    const todoTarget = findTodo(todoId);
    if(todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const findTodoIndex = (todoId) => {
    for(index in todos){
        if(todos[index].id === todoId){
            return index;
        }
    }
    return -1;
}

const saveData = () => {
    if(isStorageExist()){
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const isStorageExist = () => {
    typeof(Storage) === undefined ? alert("Browser kamu tidak mendukung local storage") : false;
    return true;
}

document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
});

const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
   
    let data = JSON.parse(serializedData);
   
    const filtered = todos.filter(data => data !== null);

    if(filtered){
        data.forEach((todo) => {
            todos.push(todo);
        });
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}