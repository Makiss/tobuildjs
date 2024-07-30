// State of the app
const todos = ["Walk the dog", "Water the plants", "Sand the chairs"];

// HTML element references
const addTodoInput = document.getElementById("todo-input");
const addTodoButton = document.getElementById("add-todo-btn");
const todosList = document.getElementById("todos-list");

// Initialize the view
for (const todo of todos) {
  todosList.append(renderTodoInReadMode(todo));
}

addTodoInput.addEventListener("input", () => {
  addTodoButton.disabled = addTodoInput.value.length < 3;
});

addTodoInput.addEventListener("keydown", ({ key }) => {
  if (key === "Enter" && addTodoInput.value.length >= 3) {
    addTodo();
  }
});

addTodoButton.addEventListener("click", () => {
  addTodo();
});

// Functions
function renderTodoInReadMode(todo) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const button = document.createElement("button");

  span.textContent = todo;
  span.addEventListener("dblclick", () => {
    const todosIndex = todos.indexOf(todo);
    todosList.replaceChild(
      renderTodoInEditMode(todo),
      todosList.childNodes[todosIndex]
    );
  });

  button.textContent = "Done";
  button.addEventListener("click", () => {
    const todosIndex = todos.indexOf(todo);
    removeTodo(todosIndex);
  });

  li.append(span);
  li.append(button);

  return li;
}

function renderTodoInEditMode(todo) {
  const li = document.createElement("li");
  const input = document.createElement("input");
  const cancelBtn = document.createElement("button");
  const saveBtn = document.createElement("button");

  input.type = "text";
  input.value = todo;

  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", () => {
    const todoIndex = todos.indexOf(todo);
    updateTodo(todoIndex, input.value);
  });

  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", () => {
    const todoIndex = todos.indexOf(todo);
    todosList.replaceChild(
      renderTodoInReadMode(todo),
      todosList.childNodes[todoIndex]
    );
  });

  li.append(input);
  li.append(saveBtn);
  li.append(cancelBtn);

  return li;
}

function addTodo() {
  const description = addTodoInput.value;
  const todo = renderTodoInReadMode(description);

  todos.push(description);
  todosList.append(todo);

  addTodoInput.value = "";
  addTodoButton.disabled = true;
}

function updateTodo(index, description) {
  const todo = renderTodoInReadMode(description);

  todos[index] = description;
  todosList.replaceChild(todo, todosList.childNodes[index]);
}

function removeTodo(index) {
  todos.splice(index, 1);
  todosList.childNodes[index].remove();
}
