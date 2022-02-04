// tüm elementler seçildi
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

// site title
document.title = "Todo List Project";
//site icon  
const icon = document.createElement("link");
    icon.rel = "shortcut icon";
    icon.type = "image/x-icon";
    icon.href = "./websiteLogo.png";
    document.head.appendChild(icon);

eventListeners();

function eventListeners() { //tüm event listenerler bu kısımda
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}
// clear all todos
function clearAllTodos() {
    if (confirm("Tümünü silmek istediğinizden emin misiniz?")) {
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}

// filter todos
function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            listItem.setAttribute("style", "display:none !important");
        } else {
            listItem.setAttribute("style", "display:block");
        }
    })
}
// delete todo
function deleteTodo(e) {
    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("warning", "Todo başarıyla silindi")
    }
}

//Storageden todo silme
function deleteTodoFromStorage(deleteTodo) {
    let todos = getTodosFromStorage();
    todos.forEach(function (todo, index) {
        if (todo === deleteTodo) {
            todos.splice(index, 1); //arrayden değeri siliyoruz
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Storageden todoları otomatik çekme 
function loadAllTodosToUI() {
    let todos = getTodosFromStorage();
    todos.forEach(function (todo) {
        addToDoToUI(todo);
    });
}

function addTodo(e) {
    const newTodo = todoInput.value.trim();

    if (newTodo === "") {
        showAlert("danger", "Lütfen bir todo girin...");
    } else {
        addToDoToUI(newTodo);

        //Storage 'a todo ekleme
        addTodoToStorage(newTodo);

        //alert gösteriyoruz
        showAlert("success", "Başarılı bir şekilde eklendi!");
    }

    e.preventDefault();
}

// list item oluşturma
function addToDoToUI(newTodo) {
    const listItem = document.createElement("li");

    // link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";

    // text node ekleme 
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    // Todo list'e, list item' ı ekleme
    todoList.appendChild(listItem);


    // Todo değerlerini sıfırlama
    todoInput.value = "";
}

// Storage' dan todo' ları alma
function getTodosFromStorage() {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

// Storage 'a todo ekleme
function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos))
}

function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    // first card' ın altına alert eklendi
    firstCardBody.appendChild(alert);

    // alert için setTimeout 
    setTimeout(function () {
        alert.remove();
    }, 2000);
}