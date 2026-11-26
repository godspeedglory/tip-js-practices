import { validateTaskDraft } from "./src/form-validation.js";

const tasks = [];

const result1 = validateTaskDraft({
    id: "20",
    title: "  Изучить localStorage  ",
    priority: "high"
}, tasks);

const result2 = validateTaskDraft({
    id: "20",
    title: "   ",
    priority: "high"
}, tasks);

console.log("Проверка 1:", result1);
console.log("Проверка 2:", result2);