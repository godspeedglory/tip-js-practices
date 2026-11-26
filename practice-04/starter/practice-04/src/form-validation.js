const ALLOWED_PRIORITIES = new Set([
    "low", "medium", "high"
]);

export function validateTaskDraft(draft, tasks, editingId = null) {
    const errors = {};

    const id = editingId === null
        ? Number(draft.id)
        : editingId;

    const title = typeof draft.title === "string"
        ? draft.title.trim()
        : "";

    const priority = draft.priority;

    if (!Number.isSafeInteger(id) || id <= 0) {
        errors.id = "Введите положительное целое число.";
    } else if (editingId === null && tasks.some(task => task.id === id)) {
        errors.id = "Задача с таким ID уже существует.";
    } else if (editingId !== null && !tasks.some(task => task.id === id)) {
        errors.id = "Редактируемая задача не найдена.";
    }

    if (title.length < 1 || title.length > 100) {
        errors.title = "Название должно содержать от 1 до 100 символов.";
    }

    if (!ALLOWED_PRIORITIES.has(priority)) {
        errors.priority = "Выберите допустимый приоритет.";
    }

    if (Object.keys(errors).length > 0) {
        return { ok: false, errors };
    }

    return {
        ok: true,
        value: { id, title, priority }
    };
}