"use strict";
const totalTasks = 14;
const completedTasks =4;
const dailyLimit = 4;
if (
    !Number.isInteger(totalTasks) ||
    !Number.isInteger(completedTasks) ||
    !Number.isInteger(dailyLimit) ||
    totalTasks < 0 ||
    totalTasks > 1000 ||
    completedTasks < 0 ||
    completedTasks > totalTasks ||
    dailyLimit < 1 ||
    dailyLimit > 1000
) {
    console.log("Ошибка: некорректные данные");
} else {
    let remainingTasks = totalTasks - completedTasks;
    let day = 0;
    console.log("Осталось задач:", remainingTasks);
    if (remainingTasks === 0) {
        console.log("Все задачи уже выполнены");
    }
    while (remainingTasks > 0) {
        day += 1;
        const tasksToday = Math.min(remainingTasks, dailyLimit);
        remainingTasks -= tasksToday;
        console.log(`День ${day}: выполнено ${tasksToday}, осталось ${remainingTasks}`);
    }
    console.log("Потребуется дней:", day);
}
