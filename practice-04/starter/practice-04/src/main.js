import {
    demoTasks,
    variantTasks,
    variantNumber
} from "./data.js";

import {
    addTask,
    findTaskById,
    removeTask,
    setTaskCompleted,
    updateTask
} from "./task-service.js";

import { getVisibleTasks } from "./task-selectors.js";

import {
    renderEmptyState,
    renderSummary,
    renderTaskList
} from "./task-view.js";

import { validateTaskDraft } from "./form-validation.js";

import {
    loadTasks,
    removeSavedTasks,
    saveTasks
} from "./task-storage.js";

const elements = {
    list: document.querySelector("#task-list"),
    filters: document.querySelector("#task-filters"),
    summary: document.querySelector("#task-summary"),
    empty: document.querySelector("#empty-message"),
    message: document.querySelector("#operation-message"),
    datasetLabel: document.querySelector("#dataset-label"),
    storageStatus: document.querySelector("#storage-status"),
    form: document.querySelector("#task-form"),
    formHeading: document.querySelector("#form-heading"),
    formMode: document.querySelector("#form-mode"),
    formMessage: document.querySelector("#form-message"),
    idInput: document.querySelector("#task-id"),
    titleInput: document.querySelector("#task-title"),
    priorityInput: document.querySelector("#task-priority"),
    submitButton: document.querySelector("#form-submit"),
    cancelButton: document.querySelector("#cancel-edit"),
    resetButton: document.querySelector("#reset-data")
};

const params = new URLSearchParams(window.location.search);

const isVariant = params.get("dataset") === "variant";
const isCheckRun = params.get("mode") === "check";

const initialTasks = isVariant
    ? variantTasks
    : demoTasks;

const datasetName = isVariant
    ? "variant"
    : "demo";

const storageKey = isCheckRun
    ? `tip-js-practice-04:checks:${datasetName}`
    : `tip-js-practice-04:${datasetName}`;

let loaded;

try {
    loaded = loadTasks(
        window.localStorage,
        storageKey,
        initialTasks
    );
} catch (error) {
    loaded = {
        ok: false,
        source: "fallback",
        tasks: initialTasks.map(task => ({ ...task })),
        error: `Ошибка хранилища: ${error.message}`
    };
}

let currentTasks = loaded.tasks;
let currentFilter = "all";
let editingId = null;

elements.datasetLabel.textContent = isVariant
    ? `Индивидуальный вариант: ${variantNumber}`
    : "Общий контрольный набор";

if (loaded.source === "storage") {
    elements.storageStatus.textContent =
        "Данные восстановлены из localStorage.";
} else if (loaded.ok) {
    elements.storageStatus.textContent =
        "Используется исходный набор; сохранённых данных пока нет.";
} else {
    elements.storageStatus.textContent = loaded.error;
    elements.storageStatus.classList.add("is-warning");
}

// Отрисовка приложения
function renderApp() {
    const visibleTasks = getVisibleTasks(
        currentTasks,
        currentFilter
    );

    renderTaskList(
        elements.list,
        visibleTasks
    );

    renderSummary(
        elements.summary,
        currentTasks,
        visibleTasks.length
    );

    renderEmptyState(
        elements.empty,
        currentTasks.length,
        visibleTasks.length
    );

    elements.filters.querySelectorAll(
        "button[data-filter]"
    ).forEach(button => {
        const active =
            button.dataset.filter === currentFilter;

        button.classList.toggle("is-active", active);

        button.setAttribute(
            "aria-pressed",
            String(active)
        );
    });
}

// Очистка ошибки отдельного поля
function clearFieldError(name) {
    const input = elements.form.elements.namedItem(name);

    const message = elements.form.querySelector(
        `[data-error-for="${name}"]`
    );

    if (
        input instanceof HTMLInputElement ||
        input instanceof HTMLSelectElement
    ) {
        input.setCustomValidity("");
        input.removeAttribute("aria-invalid");
    }

    if (message) {
        message.textContent = "";
    }
}

// Очистка всех ошибок формы
function clearFormErrors() {
    ["id", "title", "priority"].forEach(clearFieldError);

    elements.formMessage.textContent = "";
}

// Отображение ошибок формы
function showFormErrors(errors) {
    clearFormErrors();

    for (const [name, text] of Object.entries(errors)) {
        const input = elements.form.elements.namedItem(name);

        const message = elements.form.querySelector(
            `[data-error-for="${name}"]`
        );

        if (
            input instanceof HTMLInputElement ||
            input instanceof HTMLSelectElement
        ) {
            input.setCustomValidity(text);
            input.setAttribute("aria-invalid", "true");
        }

        if (message) {
            message.textContent = text;
        }
    }

    elements.formMessage.textContent =
        "Проверьте введённые данные.";

    elements.form.reportValidity();
}

// Переключение режимов формы
function setFormMode(id = null) {
    clearFormErrors();

    if (id === null) {
        editingId = null;

        elements.form.reset();

        elements.idInput.disabled = false;
        elements.idInput.readOnly = false;
        elements.idInput.value = "";

        elements.titleInput.value = "";
        elements.priorityInput.value = "medium";

        elements.formHeading.textContent =
            "Добавление задачи";

        elements.formMode.textContent =
            "Режим создания новой задачи.";

        elements.submitButton.textContent =
            "Добавить задачу";

        elements.cancelButton.hidden = true;

        return;
    }

    const task = findTaskById(currentTasks, id);

    if (!task) {
        elements.message.textContent =
            "Редактируемая задача не найдена.";

        return;
    }

    editingId = id;

    elements.idInput.value = String(task.id);
    elements.idInput.disabled = true;
    elements.idInput.readOnly = true;

    elements.titleInput.value = task.title;
    elements.priorityInput.value = task.priority;

    elements.formHeading.textContent =
        "Редактирование задачи";

    elements.formMode.textContent =
        `Редактируется задача ID ${task.id}.`;

    elements.submitButton.textContent =
        "Сохранить изменения";

    elements.cancelButton.hidden = false;

    elements.titleInput.focus();
}

// Сохранение и обновление интерфейса
function persistCurrentTasks(successMessage) {
    let saved;

    try {
        saved = saveTasks(
            window.localStorage,
            storageKey,
            currentTasks
        );
    } catch (error) {
        saved = {
            ok: false,
            error: `Ошибка сохранения: ${error.message}`
        };
    }

    elements.storageStatus.classList.toggle(
        "is-warning",
        !saved.ok
    );

    elements.storageStatus.textContent = saved.ok
        ? "Изменения сохранены в localStorage."
        : saved.error;

    elements.message.textContent = saved.ok
        ? successMessage
        : `${successMessage} ${saved.error}`;

    renderApp();

    return saved;
}

// Восстановление фокуса
function restoreTaskFocus(id, action) {
    const actionButton = elements.list.querySelector(
        `[data-task-id="${id}"] button[data-action="${action}"]`
    );

    const filterButton = elements.filters.querySelector(
        `[data-filter="${currentFilter}"]`
    );

    (actionButton ?? filterButton)?.focus();
}

// Обработка отправки формы
function handleFormSubmit(event) {
    event.preventDefault();

    clearFormErrors();

    const draft = {
        id: elements.idInput.value,
        title: elements.titleInput.value,
        priority: elements.priorityInput.value
    };

    const validation = validateTaskDraft(
        draft,
        currentTasks,
        editingId
    );

    if (!validation.ok) {
        showFormErrors(validation.errors);
        return;
    }

    const { id, title, priority } = validation.value;

    const wasEditing = editingId !== null;

    const result = wasEditing
        ? updateTask(currentTasks, id, title, priority)
        : addTask(currentTasks, id, title, priority);

    if (!result.ok) {
        elements.formMessage.textContent = result.error;
        return;
    }

    currentTasks = result.tasks;

    setFormMode();

    persistCurrentTasks(
        wasEditing
            ? "Задача успешно изменена."
            : "Задача успешно добавлена."
    );
}

// Обработка действий на карточках
function handleTaskListClick(event) {
    if (!(event.target instanceof Element)) {
        return;
    }

    const button = event.target.closest(
        "button[data-action]"
    );

    if (!button || !elements.list.contains(button)) {
        return;
    }

    const action = button.dataset.action;

    if (!["toggle", "edit", "delete"].includes(action)) {
        return;
    }

    const card = button.closest(
        "li[data-task-id]"
    );

    if (!card || !elements.list.contains(card)) {
        return;
    }

    const id = Number(card.dataset.taskId);

    if (!Number.isSafeInteger(id) || id <= 0) {
        elements.message.textContent =
            "Некорректный идентификатор задачи.";

        return;
    }

    const task = findTaskById(currentTasks, id);

    if (!task) {
        elements.message.textContent =
            "Задача не найдена.";

        return;
    }

    if (action === "edit") {
        setFormMode(id);
        return;
    }

    const result = action === "toggle"
        ? setTaskCompleted(
            currentTasks,
            id,
            !task.completed
        )
        : removeTask(
            currentTasks,
            id
        );

    if (!result.ok) {
        elements.message.textContent = result.error;
        return;
    }

    currentTasks = result.tasks;

    if (action === "delete" && editingId === id) {
        setFormMode();
    }

    persistCurrentTasks(
        action === "toggle"
            ? "Статус задачи изменён."
            : "Задача удалена."
    );

    restoreTaskFocus(id, action);
}

// Обработка фильтров
function handleFilterClick(event) {
    if (!(event.target instanceof Element)) {
        return;
    }

    const button = event.target.closest(
        "button[data-filter]"
    );

    if (!button || !elements.filters.contains(button)) {
        return;
    }

    const filter = button.dataset.filter;

    if (!["all", "pending", "completed"].includes(filter)) {
        return;
    }

    currentFilter = filter;

    elements.message.textContent = "";

    renderApp();
}

// Сброс сохранённых данных
function handleResetClick() {
    let removed;

    try {
        removed = removeSavedTasks(
            window.localStorage,
            storageKey
        );
    } catch (error) {
        removed = {
            ok: false,
            error: `Ошибка сброса: ${error.message}`
        };
    }

    currentTasks = initialTasks.map(task => ({ ...task }));

    currentFilter = "all";

    setFormMode();

    elements.storageStatus.classList.toggle(
        "is-warning",
        !removed.ok
    );

    elements.storageStatus.textContent = removed.ok
        ? "Сохранённые данные удалены. Используется исходный набор."
        : removed.error;

    elements.message.textContent = removed.ok
        ? "Исходный список задач восстановлен."
        : removed.error;

    renderApp();
}

// Назначение обработчиков событий
elements.form.addEventListener(
    "submit",
    handleFormSubmit
);

elements.form.addEventListener("input", event => {
    if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLSelectElement
    ) {
        clearFieldError(event.target.name);
    }
});

elements.list.addEventListener(
    "click",
    handleTaskListClick
);

elements.filters.addEventListener(
    "click",
    handleFilterClick
);

elements.cancelButton.addEventListener(
    "click",
    () => setFormMode()
);

elements.resetButton.addEventListener(
    "click",
    handleResetClick
);

// Первоначальный запуск
try {
    setFormMode();
    renderApp();
} catch (error) {
    elements.message.textContent =
        `Ошибка запуска: ${error.message}`;

    console.error(error);
}