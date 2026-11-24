// Заготовка модуля. throw ниже отмечает отсутствие реализации,
// а не способ обработки некорректных данных в готовом решении.
// Для предусмотренных ошибок необходимо возвращать { ok: false, error: "..." }.
// console.log(), prompt(), document и чтение внешнего состояния здесь не нужны.

export function createTask(id, title, priority = "medium") {
  if (!Number.isSafeInteger(id) || id<=0){
    return {ok: false, error:"Недопустимые значения id."};
  }
  if (typeof title!=="string"){
    return {ok: false, error: "Название должно быть строкой."};
  }
  const normalizedTitle = title.trim();
  if (normalizedTitle.length<1 || normalizedTitle.length>100){
    return {ok: false, error:"Длина названия может быть длиной от 1 до 100 символов."};
  }
  if (priority!=="medium" && priority!=="low" && priority!=="high"){
    return {ok: false, error:"Некорректный приоритет задачи."};
  }
  return {
    ok:true,
    task:{
      id:id,
      title:normalizedTitle,
      completed: false,
      priority: priority,
    }
  };

}

export function findTaskById(tasks, id) {
  return (tasks.find((task)=> task.id=== id));
}

export function getPendingTasks(tasks) {
  return (tasks.filter((task)=> task.completed === false));
}

export function getTaskTitles(tasks) {
  return (tasks.map ((task)=> task.title));
}

export function getTaskStats(tasks) {
    const total = tasks.length;

    const completed = tasks.filter(
        (task) => task.completed === true
    ).length;

    const pending = total - completed;

    let progress = 0;

    if (total > 0) {
        progress = completed / total * 100;
    }

    return {
        total: total,
        completed: completed,
        pending: pending,
        progress: progress
    };
}

export function addTask(tasks, id, title, priority = "medium") {
  // TODO: проверить данные через createTask(), исключить дублирование id,
  // вернуть { ok: true, tasks: новыйМассив } без изменения исходного массива.
  const result = createTask(id, title, priority);
  if (!result.ok){
    return result;
  }
  if (findTaskById(tasks, id)!==undefined){
    return {ok: false, error: "Задача с таким id уже существует."};
  }
  return {
    ok: true,
    tasks: [...tasks, result.task]
  };
}

export function setTaskCompleted(tasks, id, completed) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "Некорректный id." };
  }

  if (typeof completed !== "boolean") {
    return { ok: false, error: "Некорректный статус." };
  }

  if (findTaskById(tasks, id) === undefined) {
    return { ok: false, error: "Задача не найдена." };
  }
  const newTasks = tasks.map((task)=>{
    if (task.id===id){
      return {...task,completed: completed};
    }
    return task;
  });
  return {ok: true, tasks: newTasks};
}

export function renameTask(tasks, id, title) {
  const result = createTask(id, title);
  if (!result.ok) {
    return result;
  }
  if (findTaskById(tasks, id) === undefined) {
    return { ok: false, error: "Задача не найдена." };
  }
  const newTasks = tasks.map((task)=>{
    if (task.id===id){
      return {...task, title: result.task.title};
    }
    return task;
  });
  return { ok: true, tasks: newTasks };
}

export function removeTask(tasks, id) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { ok: false, error: "Недопустимое значение id." };
  }
  if (findTaskById(tasks,id)===undefined){
    return {ok:false, error:"Задача не найдена"};
  }
  return {
    ok:true,
    tasks: tasks.filter((task)=> task.id!==id)
  };
}
