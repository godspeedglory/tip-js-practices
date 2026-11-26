import { getTaskStats } from "./task-service.js";

const priorityLabels = {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий"
};

function createActionButton(action, label) {
    const button = document.createElement("button");

    button.type = "button";
    button.dataset.action = action;

    const span = document.createElement("span");
    span.classList.add("action-label");
    span.textContent = label;

    button.append(span);

    return button;
}

export function createTaskElement(task) {
    const card = document.createElement("li");

    card.classList.add("task-card");
    card.dataset.taskId = String(task.id);
    card.classList.toggle("is-completed", task.completed);

    const title = document.createElement("h3");

    title.classList.add("task-title");
    title.textContent = task.title;

    const status = document.createElement("span");

    status.classList.add("task-status");
    status.textContent = task.completed
        ? "Выполнена"
        : "В работе";

    const priority = document.createElement("span");

    priority.classList.add("task-priority");
    priority.textContent = priorityLabels[task.priority];

    const actions = document.createElement("div");
    actions.classList.add("task-actions");

    const toggleButton = createActionButton(
        "toggle",
        "Выполнена"
    );

    toggleButton.setAttribute(
        "aria-pressed",
        String(task.completed)
    );

    const editButton = createActionButton(
        "edit",
        "Изменить"
    );

    const deleteButton = createActionButton(
        "delete",
        "Удалить"
    );

    actions.append(
        toggleButton,
        editButton,
        deleteButton
    );

    card.append(
        title,
        status,
        priority,
        actions
    );

    return card;
}

export function renderTaskList(listElement, tasks) {
    listElement.replaceChildren(
        ...tasks.map(createTaskElement)
    );
}

export function renderSummary(summaryElement, tasks, visibleCount) {
    const stats = getTaskStats(tasks);

    const values = {
        total: stats.total,
        completed: stats.completed,
        pending: stats.pending,
        progress: `${stats.progress.toFixed(1)}%`,
        visible: visibleCount
    };

    for (const [name, value] of Object.entries(values)) {
        summaryElement.querySelector(
            `[data-stat="${name}"]`
        ).textContent = String(value);
    }
}

export function renderEmptyState(messageElement, total, visibleCount) {
    if (total === 0) {
        messageElement.textContent = "Список задач пуст.";
        messageElement.hidden = false;
    } else if (visibleCount === 0) {
        messageElement.textContent = "Нет задач по выбранному фильтру.";
        messageElement.hidden = false;
    } else {
        messageElement.textContent = "";
        messageElement.hidden = true;
    }
}