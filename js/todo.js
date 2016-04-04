var currentProjectId = 0;
var currentTaskId = -1;

initStorage();
showProject();
document.getElementById("task-list").innerHTML = createProjectTaskList(0);

// 初始化数据
function initStorage() {
    if (!localStorage.project || !localStorage.task) {
        var projectJson = [{
            "id": 0,
            "name": "学习前端",
            "child": [0,1]
        }, {
            "id": 1,
            "name": "娱乐",
            "child": [2]
        }];

        var taskJson = [{
            "id": 0,
            "parent": 0,
            "finish": false,
            "title": "学习Bootstrap",
            "content": "学习Bootstrap官网教程<br>写Bootstrap <b>demo</b>"
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
            "content": "这里也是什么内容也没有"
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
    updateProjectChild(currentProjectId, taskObject.id);

    localStorage.task = JSON.stringify(tasksArray);
}

// 在输入框上绑定回车事件
document.getElementById("add-task-input").onkeydown = function(event) {
    if (event.keyCode == 13) {
        if (this.value === "") {return;}
        var title = this.value;
        this.value = "";

        var taskObject = {};
        taskObject.finish = false;
        taskObject.title = title;
        taskObject.parent = currentProjectId;

        addTask(taskObject);
        document.getElementById("task-list").innerHTML = createProjectTaskList(currentProjectId);
    }
};

// 创建一个目录下的列表用于显示
function createProjectTaskList(projectId) {
    var listHTML = "<ul>";
    var tasksArray = JSON.parse(localStorage.task);
    var liStr;
    for (var i = 0; i < tasksArray.length; i++) {
        if (tasksArray[i].parent == projectId) {
            liStr = '<li' + ' id="task-' + tasksArray[i].id + '" '
                + 'class="title-list"'
                + ' onclick="showTaskContent(this);">'
                + '<i class="fa fa-fw fa-square-o" onclick="checkTask(this);"></i>'
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

    cancelActive(document.getElementById("project-list"));
    addClass(element, "active");

    currentProjectId = element.id.slice(8);
    var projectName = "";
    var projectArray = JSON.parse(localStorage.project);
    for (var i = 0; i < projectArray.length; i++) {
        if (projectArray[i].id == currentProjectId) {
            projectName = projectArray[i].name;
            break;
        }
    }
    var titleElement = document.getElementById("project-name").getElementsByTagName("h3")[0];
    titleElement.innerHTML = projectName;
    // 修改输入框内的提示信息
    document.getElementById("add-task-input").setAttribute("placeholder",
        '添加任务至"' + projectName + '"');
    // 修改显示的任务列表
    document.getElementById("task-list").innerHTML = createProjectTaskList(currentProjectId);
}

// 取消列表上的active类
function cancelActive(element) {
    var lists = element.getElementsByTagName("li");
    for (var i = 0; i < lists.length; i++) {
        removeClass(lists[i], "active");
    }
}

// 增加一个新的目录
function addProject() {
    var name = prompt("请输入名称：");
    if (!name) return;
    var projectObject = {};
    var projectArray = JSON.parse(localStorage.project);
    projectObject.id = projectArray[projectArray.length - 1].id + 1;
    projectObject.name = name;
    projectObject.child = [];
    projectArray.push(projectObject);

    localStorage.project = JSON.stringify(projectArray);
    showProject();

    // 显示新建目录下的内容
    var newProject = document.getElementById("project-" + projectObject.id);
    clickProject(newProject);
}

// 显示所有的目录
function showProject() {
    var projectArray = JSON.parse(localStorage.project);
    var projectHTML = "<ul>";
    var liStr;
    for (var i = 0; i < projectArray.length; i++) {
        liStr = '<li id="project-'
            + i + '" onclick="clickProject(this)">'
            + '<i class="fa fa-bars"></i>'
            + '<span>'
            + projectArray[i].name
            +'</span></li>';
        projectHTML += liStr;
    }
    projectHTML += '<li onclick="addProject()"><i class="fa fa-plus-circle"></i><span>创建清单</span></li></ul>';
    document.getElementById("project-list").innerHTML = projectHTML;
}

// 切换一个任务完成或未完成的状态
function checkTask(element) {
    toggleClass(element, "fa-check-square-o");
    toggleClass(element, "fa-square-o");

    // 获得这个任务的Id值，eg: "id=task-2"
    var taskId = element.parentNode.id.slice(5);
    // 更新任务的完成状态
    updateTaskState(taskId);
}

// 添加一个新的任务时，更新project的child属性
function updateProjectChild(projectId, taskId) {
    var projectArray = JSON.parse(localStorage.project);
    for (var i = 0; i < projectArray.length; i++) {
        if (projectArray[i].id == projectId) {
            projectArray[i].child.push(taskId);
        }
    }
    localStorage.project = JSON.stringify(projectArray);
}

// 更新任务的完成状态
function updateTaskState(taskId) {
    var taskArray = JSON.parse(localStorage.task);
    for (var i = 0; i < taskArray.length; i++) {
        if (taskArray[i].id == taskId) {
            taskArray[i].finish = !taskArray[i].finish;
        }
    }
    localStorage.task = JSON.stringify(taskArray);
}

// 在右侧显示一个任务的具体内容
function showTaskContent(element) {
    var taskId = element.id.slice(5);
    console.log(taskId);
    var taskArray = JSON.parse(localStorage.task);
    var contentElement = document.getElementById("task-content");
    for (var i = 0; i < taskArray.length; i++) {
        if (taskArray[i].id == taskId) {
            if (taskArray[i].content) {
                contentElement.innerHTML = taskArray[i].content;
            } else {
                contentElement.innerHTML = "这里是任务的具体内容";
            }
            return;
        }
    }
}

function showDropdownMenu(element) {
    var menuElement = document.getElementById("project-dropdown-menu");
    menuElement.style.display = "block";
}

