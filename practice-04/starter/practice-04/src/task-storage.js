export const STORAGE_VERSION = 1;

const priorities = ["low", "medium", "high"];

function cloneTasks(tasks) {
    return tasks.map(task => ({ ...task }));
}

export function isValidTaskList(value) {
    if (!Array.isArray(value)) {
        return false;
    }

    const ids = new Set();

    for (const task of value) {
        if (!task || typeof task !== "object") {
            return false;
        }

        if (!Number.isSafeInteger(task.id) || task.id <= 0) {
            return false;
        }

        if (ids.has(task.id)) {
            return false;
        }

        if (
            typeof task.title !== "string" ||
            task.title.trim().length === 0 ||
            task.title.length > 100
        ) {
            return false;
        }

        if (typeof task.completed !== "boolean") {
            return false;
        }

        if (!priorities.includes(task.priority)) {
            return false;
        }

        ids.add(task.id);
    }

    return true;
}

export function loadTasks(storage, key, fallbackTasks) {
    try {
        const raw = storage.getItem(key);

        if (raw === null) {
            return {
                ok: true,
                source: "initial",
                tasks: cloneTasks(fallbackTasks)
            };
        }

        const data = JSON.parse(raw);

        if (
            !data ||
            data.version !== STORAGE_VERSION ||
            !isValidTaskList(data.tasks)
        ) {
            throw new Error("Некорректная структура данных.");
        }

        return {
            ok: true,
            source: "storage",
            tasks: cloneTasks(data.tasks)
        };
    } catch (error) {
        return {
            ok: false,
            source: "fallback",
            tasks: cloneTasks(fallbackTasks),
            error: `Ошибка загрузки: ${error.message}`
        };
    }
}

export function saveTasks(storage, key, tasks) {
    try {
        if (!isValidTaskList(tasks)) {
            throw new Error("Некорректный список задач.");
        }

        storage.setItem(key, JSON.stringify({
            version: STORAGE_VERSION,
            tasks
        }));

        return { ok: true };
    } catch (error) {
        return {
            ok: false,
            error: `Ошибка сохранения: ${error.message}`
        };
    }
}

export function removeSavedTasks(storage, key) {
    try {
        storage.removeItem(key);

        return { ok: true };
    } catch (error) {
        return {
            ok: false,
            error: `Ошибка удаления: ${error.message}`
        };
    }
}