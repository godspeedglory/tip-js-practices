function failure(error) {
    return { ok: false, error };
}

function validId(id) {
    return Number.isSafeInteger(id) && id > 0;
}

export function createTask(id, title, priority = "medium") {
    if (!validId(id)) {
        return failure("Некорректный идентификатор.");
    }

    if (typeof title !== "string") {
        return failure("Название должно быть строкой.");
    }

    const normalizedTitle = title.trim();

    if (normalizedTitle.length < 1 || normalizedTitle.length > 100) {
        return failure("Название должно содержать от 1 до 100 символов.");
    }

    if (!["low", "medium", "high"].includes(priority)) {
        return failure("Некорректный приоритет.");
    }

    return {
        ok: true,
        task: {
            id,
            title: normalizedTitle,
            completed: false,
            priority
        }
    };
}

export function findTaskById(tasks, id) {
    return tasks.find(task => task.id === id);
}

export function getPendingTasks(tasks) {
    return tasks.filter(task => !task.completed);
}

export function getTaskTitles(tasks) {
    return tasks.map(task => task.title);
}

export function getTaskStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const progress = total === 0
        ? 0
        : completed / total * 100;

    return {
        total,
        completed,
        pending,
        progress
    };
}

export function addTask(tasks, id, title, priority = "medium") {
    const result = createTask(id, title, priority);

    if (!result.ok) {
        return result;
    }

    if (findTaskById(tasks, id)) {
        return failure("Задача с таким ID уже существует.");
    }

    return {
        ok: true,
        tasks: [...tasks, result.task]
    };
}

export function setTaskCompleted(tasks, id, completed) {
    if (!validId(id)) {
        return failure("Некорректный идентификатор.");
    }

    if (typeof completed !== "boolean") {
        return failure("Статус должен быть логическим значением.");
    }

    if (!findTaskById(tasks, id)) {
        return failure("Задача не найдена.");
    }

    return {
        ok: true,
        tasks: tasks.map(task =>
            task.id === id
                ? { ...task, completed }
                : task
        )
    };
}

export function renameTask(tasks, id, title) {
    const existingTask = findTaskById(tasks, id);

    if (!existingTask) {
        return failure("Задача не найдена.");
    }

    return updateTask(tasks, id, title, existingTask.priority);
}

export function removeTask(tasks, id) {
    if (!validId(id)) {
        return failure("Некорректный идентификатор.");
    }

    if (!findTaskById(tasks, id)) {
        return failure("Задача не найдена.");
    }

    return {
        ok: true,
        tasks: tasks.filter(task => task.id !== id)
    };
}

export function updateTask(tasks, id, title, priority) {
    if (!validId(id)) {
        return failure("Некорректный идентификатор.");
    }

    if (!findTaskById(tasks, id)) {
        return failure("Задача не найдена.");
    }

    if (!["low", "medium", "high"].includes(priority)) {
        return failure("Некорректный приоритет.");
    }

    const result = createTask(id, title, priority);

    if (!result.ok) {
        return result;
    }

    return {
        ok: true,
        tasks: tasks.map(task =>
            task.id === id
                ? {
                    ...task,
                    title: result.task.title,
                    priority: result.task.priority
                }
                : task
        )
    };
}