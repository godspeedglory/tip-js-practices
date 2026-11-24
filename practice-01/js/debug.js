
"use strict";

const plannedText = "8";
const completedText = "3";
const additionalText = "2";

// Преобразование строк в числа
const completedTotal = Number(completedText) + Number(additionalText);
const remainingTasks = Number(plannedText) - completedTotal;

console.log("Выполнено:", completedTotal);
console.log("Осталось:", remainingTasks);

// Исправленная граница цикла
let controlSum = 0;

for (let taskNumber = 1; taskNumber <= 4; taskNumber += 1) {
    controlSum += taskNumber;
}

console.log("Контрольная сумма:", controlSum);
