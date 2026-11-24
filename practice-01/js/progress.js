"use strict";

const totalTasks = 14;
const completedTasks = 4;

if (!Number.isInteger(totalTasks) || !Number.isInteger(completedTasks) || totalTasks < 0 ||
    totalTasks > 1000 ||
    completedTasks < 0 ||
    completedTasks > totalTasks){
        console.log("Ошибка: некорректные данные");
    }
else if(totalTasks===0){
    console.log("Задач пока нет");
}
else{
    const lastTasks = totalTasks - completedTasks;
    const procentTasksComplete = (completedTasks/totalTasks)*100;
    let status;
    if (completedTasks===totalTasks){
        status="Завершено";
    }
    else if(completedTasks===0){
        status="Не начато";
    }
    else{
        status="В работе";
    }
    console.log("Всего задач:", totalTasks);
    console.log("Выполнено:", completedTasks);
    console.log("Осталось:", lastTasks);
    console.log(`Прогресс: ${procentTasksComplete.toFixed(1)}%`);
    console.log("Статус:", status);
}