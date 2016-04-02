var currentProjectId = 0;
var currentTaskId = -1;

initStorage();
document.getElementById("task-list").innerHTML = createProjectTaskList(0);

// 初始化数据
function initStorage() {
    if (!localStorage.project || !localStorage.task) {
        var projectJson = [{
            "id": 0,
            "name": "学习前端",
            "child": [0]
        }, {
            "id": 1,
            "name": "娱乐",
            "child": [0]
        }];

        var taskJson = [{
            "id": 0,
            "parent": 0,
            "finish": false,
            "title": "学习Bootstrap",
            "content": "这里什么内容也没有"
        }, {
            "id": 1,
            "parent": 0,
            "finish": false,
            "title": "完成Todolist",
            "content": "这里还是什么内容也没有"
        }, {
            "id": 2,
            "parent": 1,
            "finish": false,
            "title": "看电影",
            "content": "这里还是什么内容也没有"
        }
        ];

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
        if (this.value === "") {return;}
        var title = this.value;
        console.log(title);
        this.value = "";

        var taskObject = {};
        taskObject.finish = false;
        taskObject.title = title;
        taskObject.parent = currentProjectId;

        addTask(taskObject);
        document.getElementById("task-list").innerHTML = createProjectTaskList(currentProjectId);
    }
};

// 创建所有任务的列表用于显示
function createTaskList() {
    var listHTML = "<ul>";
    var tasksArray = JSON.parse(localStorage.task);
    var liStr;
    for (var i = 0; i < tasksArray.length; i++) {
        //console.log(tasksArray[i]);
        liStr = '<li' + ' id="task-' + tasksArray[i].id + '" '
            + 'class="title-list">'
            + '<i class="fa fa-square-o"></i>'
            + '<span class="task-title">'
            + tasksArray[i].title
            + '</span></li>';
        listHTML += liStr;
    }
    listHTML += "</ul>";
    return listHTML;
}

// 创建一个目录下的列表用于显示
function createProjectTaskList(projectId) {
    var listHTML = "<ul>";
    var tasksArray = JSON.parse(localStorage.task);
    var liStr;
    for (var i = 0; i < tasksArray.length; i++) {
        if (tasksArray[i].parent == projectId) {
            liStr = '<li' + ' id="task-' + tasksArray[i].id + '" '
                + 'class="title-list">'
                + '<i class="fa fa-square-o"></i>'
                + '<span class="task-title">'
                + tasksArray[i].title
                + '</span></li>';
            listHTML += liStr;
        }
    }
    listHTML += "</ul>";
    return listHTML;
}


// 当任务标题被修改时，保存
function saveTaskChange(element) {
    var parent = element.parentNode;    // 取出parent，类型为li
    var id = parent.id.slice(5);
    var tasksArray = JSON.parse(localStorage.task);
    for (var i = 0; i < tasksArray.length; i++) {
        if (tasksArray[i].id == id) {
            tasksArray[i].title = element.innerHTML;
            break;
        }
    }
    localStorage.task = JSON.stringify(tasksArray);
}

// 点击一个任务目录
function clickProject(element) {
    currentProjectId = element.parentNode.id.slice(8);

    var projectArray = JSON.parse(localStorage.project);
    for (var i = 0; i < projectArray.length; i++) {
        if (projectArray[i].id == currentProjectId) {
            var titleElement = document.getElementById("project-name").getElementsByTagName("h3")[0];
            titleElement.innerHTML = projectArray[i].name;
            document.getElementById("task-list").innerHTML = createProjectTaskList(currentProjectId);
        }
    }
}



