const githubAccessToken = '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';

const saveTasksToGitHub = async (tasks) => {
  try {
    const githubUsername = 'AndreiLud';
    const repoName = 'Coisinhas';
    const filePath = 'log.json';
    const url = `https://api.github.com/repos/${githubUsername}/${repoName}/contents/${filePath}`;
    
    const headers = {
      Authorization: `Bearer ${githubAccessToken}`,
    };

    const content = JSON.stringify(tasks);
    const data = {
      message: 'Atualizar lista de afazeres',
      content: Buffer.from(content).toString('base64'),
    };

    await axios.put(url, data, { headers });
  } catch (error) {
    console.error('Erro ao salvar as tarefas no GitHub:', error);
  }
};

function getAllTasks() {
  const tasks = [];
  const todoListItems = todoList.querySelectorAll('li');

  todoListItems.forEach((task) => {
    tasks.push(task.textContent);
  });

  return tasks;
}

document.addEventListener("DOMContentLoaded", function () {
  const todoList = document.getElementById("todo-list");
  const completedList = document.getElementById("completed-list");
  const editBtn = document.getElementById("edit-btn");
  const addBtn = document.getElementById("add-btn");
  const newTaskInput = document.getElementById("new-task");
  let isEditMode = false;

  // Estilo inicial para ocultar a caixa de texto e o botão "Adicionar"
  newTaskInput.style.display = "none";
  addBtn.style.display = "none";

  function toggleEditMode() {
    isEditMode = !isEditMode;
    if (isEditMode) {
      editBtn.innerHTML = '<i class="fas fa-check"></i>';
      newTaskInput.style.display = "inline-block";
      addBtn.style.display = "inline-block";
      todoList.querySelectorAll(".delete-task").forEach(deleteTask => {
        deleteTask.style.display = "inline";
      });
    } else {
      editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
      newTaskInput.style.display = "none";
      addBtn.style.display = "none";
      todoList.querySelectorAll(".delete-task").forEach(deleteTask => {
        deleteTask.style.display = "none";
      });
    }
  }

  function addActivity() {
    const activity = newTaskInput.value.trim();
    if (activity && isEditMode) {
      const li = document.createElement("li");
      li.textContent = activity;

      const deleteTask = document.createElement("span");
      deleteTask.classList.add("delete-task");
      li.appendChild(deleteTask);

      todoList.appendChild(li);
      newTaskInput.value = "";

      // Salvar a lista atualizada no GitHub
      saveTasksToGitHub(getAllTasks());
    }
  }

  function toggleTaskCompletion(event) {
    if (!isEditMode && event.target.tagName === "LI") {
      const task = event.target;
      task.classList.toggle("completed-task");

      if (task.classList.contains("completed-task")) {
        completedList.prepend(task);
      } else {
        todoList.appendChild(task);
      }

      // Salvar a lista atualizada no GitHub
      saveTasksToGitHub(getAllTasks());
    }
  }

  function deleteActivity(event) {
    if (isEditMode && event.target.classList.contains("delete-task")) {
      const li = event.target.parentElement;
      if (confirm(`Deseja excluir a atividade: "${li.textContent}"?`)) {
        li.remove();

        // Salvar a lista atualizada no GitHub
        saveTasksToGitHub(getAllTasks());
      }
    }
  }

  editBtn.addEventListener("click", toggleEditMode);
  addBtn.addEventListener("click", addActivity);
  todoList.addEventListener("click", deleteActivity);
  todoList.addEventListener("click", toggleTaskCompletion);
  completedList.addEventListener("click", toggleTaskCompletion);

  // Salvar a lista inicial no GitHub quando a página carregar
  saveTasksToGitHub(getAllTasks());
});
