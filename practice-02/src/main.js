import { demoTasks, variantNumber, variantTasks } from "./data.js"; 

import {
    addTask,
    setTaskCompleted,
    renameTask,
    removeTask,
    getPendingTasks,
    getTaskTitles,
    getTaskStats
} from "./task-service.js";

// Функция вывода статистики
function printStats(tasks) {
    const { total, completed, pending, progress } = getTaskStats(tasks);

    console.log(`Всего: ${total}`);
    console.log(`Выполнено: ${completed}`);
    console.log(`Осталось: ${pending}`);

    if (total === 0) {
        console.log("Задач пока нет");
    } else {
        console.log(`Прогресс: ${progress.toFixed(1)}%`);
    }
}

// Сохраняем исходные данные для сравнения
const originalTasks = JSON.stringify(demoTasks);

let currentTasks = demoTasks;

// Исходный список
console.log("\n1. Исходный список задач");
console.log(currentTasks);

console.log("Названия задач:");
console.log(getTaskTitles(currentTasks));

console.log("Невыполненные задачи:");
console.log(getPendingTasks(currentTasks));

printStats(currentTasks);

// Добавление задачи
console.log("\n2. Добавление задачи id = 20");

const addResult = addTask(
    currentTasks, 20, "Добавить проверку", "high"
);

if (addResult.ok) {
    currentTasks = addResult.tasks;
} else {
    console.log(addResult.error);
}

printStats(currentTasks);

// Изменение статуса
console.log("\n3. Выполнение задачи id = 4");

const completeResult = setTaskCompleted(currentTasks, 4, true);

if (completeResult.ok) {
    currentTasks = completeResult.tasks;
} else {
    console.log(completeResult.error);
}

printStats(currentTasks);

// Переименование задачи
console.log("\n4. Переименование задачи id = 10");

const renameResult = renameTask(
    currentTasks, 10, "Подготовить инструкцию запуска"
);

if (renameResult.ok) {
    currentTasks = renameResult.tasks;
} else {
    console.log(renameResult.error);
}

printStats(currentTasks);

// Удаление задачи
console.log("\n5. Удаление задачи id = 7");

const removeResult = removeTask(currentTasks, 7);

if (removeResult.ok) {
    currentTasks = removeResult.tasks;
} else {
    console.log(removeResult.error);
}

printStats(currentTasks);

// Проверка обработки ошибки
console.log("\n6. Повторное добавление задачи id = 20");

const errorResult = addTask(
    currentTasks, 20, "Повторная задача", "high"
);

if (errorResult.ok) {
    currentTasks = errorResult.tasks;
} else {
    console.log(`Ошибка: ${errorResult.error}`);
}

printStats(currentTasks);

// Итоговый список
console.log("\n7. Итоговый список задач");
console.log(currentTasks);

console.log("Идентификаторы итогового списка:");
console.log(currentTasks.map((task) => task.id));

// Проверка сохранности исходных данных
console.log("\n8. Проверка исходных данных");

console.log(
    "Исходный массив не изменился:",
    JSON.stringify(demoTasks) === originalTasks
);
// Индивидуальный демонстрационный сценарий

console.log(`\n=== Индивидуальный вариант № ${variantNumber} ===`);

const originalVariantTasks = JSON.stringify(variantTasks);

let currentVariantTasks = variantTasks;

// Исходный список
console.log("\n1. Исходный список задач");
console.log(currentVariantTasks);

printStats(currentVariantTasks);

// Добавление задачи
console.log("\n2. Добавление задачи id = 80");

const variantAdd = addTask(
    currentVariantTasks, 80, "Подготовить итоговый документ", "low"
);

if (variantAdd.ok) {
    currentVariantTasks = variantAdd.tasks;
} else {
    console.log(variantAdd.error);
}

printStats(currentVariantTasks);

// Изменение статуса
console.log("\n3. Выполнение задачи id = 11");

const variantComplete = setTaskCompleted(
    currentVariantTasks, 11, true
);

if (variantComplete.ok) {
    currentVariantTasks = variantComplete.tasks;
} else {
    console.log(variantComplete.error);
}

printStats(currentVariantTasks);

// Переименование задачи
console.log("\n4. Переименование задачи id = 23");

const variantRename = renameTask(
    currentVariantTasks, 23, "Разработать структуру технического документа"
);

if (variantRename.ok) {
    currentVariantTasks = variantRename.tasks;
} else {
    console.log(variantRename.error);
}

printStats(currentVariantTasks);

// Удаление задачи
console.log("\n5. Удаление задачи id = 37");

const variantRemove = removeTask(currentVariantTasks, 37);

if (variantRemove.ok) {
    currentVariantTasks = variantRemove.tasks;
} else {
    console.log(variantRemove.error);
}

printStats(currentVariantTasks);

// Проверка ошибки
console.log("\n6. Повторное добавление задачи id = 80");

const variantError = addTask(
    currentVariantTasks, 80, "Повторная задача", "low"
);

if (variantError.ok) {
    currentVariantTasks = variantError.tasks;
} else {
    console.log(`Ошибка: ${variantError.error}`);
}

printStats(currentVariantTasks);

// Итоговый список
console.log("\n7. Итоговый список задач");
console.log(currentVariantTasks);

console.log("Идентификаторы итогового списка:");
console.log(currentVariantTasks.map((task) => task.id));

printStats(currentVariantTasks);

// Проверка сохранности исходных данных
console.log("\n8. Проверка исходных данных");

console.log(
    "Исходный массив variantTasks не изменился:",
    JSON.stringify(variantTasks) === originalVariantTasks
);