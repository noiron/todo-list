var currentProjectId = 0;
var currentTaskId = -1;

initStorage();

// 初始化数据
function initStorage() {
    if (!localStorage.project || !localStorage.task) {
        var projectJson = [{
            "id": 0,
            "name": "学习前端",
            "child": [0]
        }];

        var taskJson = [{
            "id": 0,
            "parent": 0,
            "finish": false,
            "title": "学习Bootstrap",
            "content": "这里什么内容也没有"
        }];

        localStorage.project = JSON.stringify(projectJson);
        localStorage.task = JSON.stringify(taskJson);
    }
}

// 添加一个任务
function addTask(taskObject) {
    // 取得所有的任务
    var tasksArray = JSON.parse(localStorage.task);
    taskObject.id = tasksArray[tasksArray.length - 1].id + 1;
    tasksArray.push(taskObject);


    localStorage.task = JSON.stringify(tasksArray);
}

// 在输入框上绑定回车事件
document.getElementById("add-task-input").onkeydown = function(event) {
    if (event.keyCode == 13) {
        var title = this.value;
        console.log(title);
        this.value = "";

        var taskObject = {};
        taskObject.finish = false;
        taskObject.title = title;
        taskObject.parent = currentProjectId;

        addTask(taskObject);
    }
};

