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
            "content": "学习Bootstrap官网教程\n写Bootstrap demo",
            "due-date": null
        }, {
            "id": 1,
            "parent": 0,
            "finish": false,
            "title": "完成Todolist",
            "content": "这里还是什么内容也没有",
            "due-date": null
        }, {
            "id": 2,
            "parent": 1,
            "finish": false,
            "title": "看电影",
            "content": "这里也是什么内容也没有",
            "due-date": null
        }
        ];

        localStorage.project = JSON.stringify(projectJson);
        localStorage.task = JSON.stringify(taskJson);
    }
}


// ----------------------------------------------------------------------------
// 数据的保存和读取
// ----------------------------------------------------------------------------

// 取得所有的任务，返回JSON格式
function getTask() {
    return JSON.parse(localStorage.task);
}

// 根据任务id取得任务的index
function getTaskIndexById(id) {
    var allTasks = getTask();
    for (var i = 0; i < allTasks.length; i++) {
        if (allTasks[i].id == id) {
            return i;
        }
    }
    return -1;
}

// 更新任务数据
function updateTask(tasks) {
    localStorage.task = JSON.stringify(tasks);
}

// 取得所有的目录
function getProject() {
    return JSON.parse(localStorage.project);
}

// 更新任务数据
function updateProject(projects) {
    localStorage.project = JSON.stringify(projects);
}

// ----------------------------------------------------------------------------
// 任务操作
// ----------------------------------------------------------------------------

// 添加一个任务
function addTask(taskObject) {
    // 取得所有的任务
    var tasksArray = getTask();
    if (tasksArray.length === 0) {
        taskObject.id = 0;
    } else {
        taskObject.id = tasksArray[tasksArray.length - 1].id + 1;
    }
    tasksArray.push(taskObject);
    updateProjectChild(currentProjectId, taskObject.id);
    updateTask(tasksArray);
}

// 在输入框上绑定回车事件
document.getElementById("add-task-input").onkeydown = function(event) {
    if (event.keyCode == 13) {
        if (this.value === "") {return;}
        if (currentProjectId === -1) {
            alert("请选择一个目录后再操作");
            return;
        }
        var title = this.value;
        this.value = "";

        var taskObject = {};
        taskObject.finish = false;
        taskObject.title = title;
        taskObject.parent = currentProjectId;

        addTask(taskObject);
        showTaskList();
    }
};

// 根据任务id删除一个任务
function deleteTaskById(id) {
    var tasksArray = getTask();
    for (var i = 0; i < tasksArray.length; i++) {
        if (tasksArray[i].id == id) {
            tasksArray.splice(i, 1);
            break;
        }
    }
    updateProjectChild(currentProjectId, id, "delete");
    updateTask(tasksArray);
    showTaskList();
    currentTaskId = -1;
    showTaskContent();  // 删除一个任务后，右栏默认为空白
}

function clickToDeleteTask(element) {
    var id = element.parentNode.getAttribute("data-taskid");
    deleteTaskById(id);
}

// 点击了任务列表中的一个任务
function clickTask(element) {
    currentTaskId = element.getAttribute("data-taskid");
    var taskList = document.getElementById("task-list");
    cancelActive(taskList);
    var cssSelector = 'li[data-taskid="' + currentTaskId + '"]';
    addClass(taskList.querySelector(cssSelector), "active");

    showTaskContent(element);
    showDate();

    if (window.innerWidth < 600) {
        expandRight();
    }
}

// 切换一个任务完成或未完成的状态
function checkTask(element) {
    toggleClass(element, "fa-check-square-o");
    toggleClass(element, "fa-square-o");

    // 获得这个任务的Id值
    var taskId = element.parentNode.getAttribute("data-taskid");
    // 更新任务的完成状态
    updateTaskState(taskId);
    showTaskList();
}

// 更新任务的完成状态
function updateTaskState(taskId) {
    var taskArray = getTask();
    for (var i = 0; i < taskArray.length; i++) {
        if (taskArray[i].id == taskId) {
            taskArray[i].finish = !taskArray[i].finish;
        }
    }
    updateTask(taskArray);
}

// 在右侧显示一个任务的具体内容
function showTaskContent(element) {
    if (currentTaskId == -1) {
        addClass(document.getElementById("content-mask"), "not-selected");
        return;
    }

    removeClass(document.getElementById("content-mask"), "not-selected");

    var taskId = element.getAttribute("data-taskid");
    var taskArray = getTask();
    var contentElement = document.getElementById("task-content").getElementsByTagName("textarea")[0];
    contentElement.setAttribute("data-taskid", taskId);

    var deleteElement = document.getElementById("delete-task");
    deleteElement.setAttribute("data-taskid", taskId);

    for (var i = 0; i < taskArray.length; i++) {
        if (taskArray[i].id == taskId) {
            if (taskArray[i].content) {
                contentElement.value = taskArray[i].content;
            } else {
                contentElement.value = "";
            }
            return;
        }
    }
}

function showTaskList() {
    document.getElementById("task-list").innerHTML = createProjectTaskList(currentProjectId);
}

// 创建一个目录下的列表用于显示
function createProjectTaskList(projectId) {
    var unfinishedListHTML = "<ul>";
    var finishedListHTML = '<div id="finished-task"><h5>已完成</h5>';

    var tasksArray = getTask();
    tasksArray = tasksArray.reverse();

    var liStr;
    for (var i = 0; i < tasksArray.length; i++) {
        if (tasksArray[i].parent == projectId) {
            if (!tasksArray[i].finish) {

                liStr = '<li' + ' data-taskid="' + tasksArray[i].id + '" '
                    + 'class="title-list"'
                    + ' onclick="clickTask(this);">'
                    + '<i class="fa fa-fw fa-square-o" onclick="checkTask(this);"></i>'
                    + '<span class="task-title">'
                    + tasksArray[i].title
                    + '</span>'
                    + '<i class="fa fa-edit" onclick="editTaskTitle(this);"></i></li>';
                unfinishedListHTML += liStr;
            } else {

                liStr = '<li' + ' data-taskid="' + tasksArray[i].id + '" '
                    + 'class="title-list finished"'
                    + ' onclick="clickTask(this);">'
                    + '<i class="fa fa-fw fa-check-square-o" onclick="checkTask(this);"></i>'
                    + '<span class="task-title">'
                    + tasksArray[i].title
                    + '</span>'
                    + '<i class="fa fa-edit" onclick="editTaskTitle(this);"></i></li>';
                finishedListHTML += liStr;
            }
        }
    }
    unfinishedListHTML += "</ul>";
    finishedListHTML += "</ul></div>";

    return unfinishedListHTML + finishedListHTML;
}

// 修改任务标题
function editTaskTitle(element) {
    var parent = element.parentNode;    // 取出parent，类型为li
    var id = parent.getAttribute("data-taskid");
    var index = -1;
    var tasksArray = getTask();
    for (var i = 0; i < tasksArray.length; i++) {
        if (tasksArray[i].id == id) {
            index = i;
            break;
        }
    }
    var newTitle = prompt("请输入新的标题：", tasksArray[index].title);
    if (!newTitle) { return;}
    tasksArray[index].title = newTitle;
    updateTask(tasksArray);
    showTaskList();
}

// 编辑任务内容
function editTaskContent(element) {
    var content = element.value;

    var id = element.getAttribute("data-taskid");
    console.log(id);
    var index = -1;
    var tasksArray = getTask();
    for (var i = 0; i < tasksArray.length; i++) {
        if (tasksArray[i].id == id) {
            index = i;
            break;
        }
    }

    tasksArray[index].content = content;
    updateTask(tasksArray);
}

// 将提示信息改为设定日期
function showDate() {
    var date;
    var allTasks = getTask();
    var index = getTaskIndexById(currentTaskId);
    if (index >= 0) {
        date = allTasks[index]["due-date"];
        if (date) {
            document.getElementById("date-setting-span").innerHTML=date.slice(0,10);
        } else {
            document.getElementById("date-setting-span").innerHTML= "";
        }
    }
}

// 设定任务的到期日期
function setDate(event, element) {
    var dateValue = element.parentNode.querySelector("input[type=text]").value;
    if (Date.parse(dateValue)) {
        var newDate = new Date(dateValue);
        console.log(newDate.toISOString());

        var allTasks = getTask();
        var index = getTaskIndexById(currentTaskId);
        allTasks[index]["due-date"] = newDate.toISOString();
        updateTask(allTasks);
        showDate();
    }

    hideDatePicker();
    event.stopPropagation();
}

// 清除任务的日期
function clearDate(event, element) {
    var allTasks = getTask();
    var index = getTaskIndexById(currentTaskId);
    allTasks[index]["due-date"] = null;
    updateTask(allTasks);
    showDate();

    hideDatePicker();
    event.stopPropagation();
}

function hideDatePicker() {
    document.getElementById("date-picker").style.display = "none";
}

function showDatePicker(event) {
    console.log(event.target);
    var dateStyle = document.getElementById("date-picker").style;

    if (event.target == document.getElementsByClassName("fa-calendar")[0]) {
        if (dateStyle.display == "block") {
            dateStyle.display = "none";
        } else {
            dateStyle.display = "block";
        }
    }
}

// ----------------------------------------------------------------------------
// 目录操作
// ----------------------------------------------------------------------------

// 增加一个新的目录
function addProject() {
    var name = prompt("请输入名称：");
    if (!name) return;
    var projectObject = {};
    var projectArray = getProject();
    if (projectArray.length == 0) {
        projectObject.id = 0;
    } else {
        projectObject.id = projectArray[projectArray.length - 1].id + 1;
    }
    projectObject.name = name;
    projectObject.child = [];
    projectArray.push(projectObject);

    updateProject(projectArray);
    showProject();

    // 将焦点定位至新建目录
    var newProject = document.getElementById("project-" + projectObject.id);
    clickProject(newProject);
}

// 删除一个目录
function deleteProject() {
    var menuElement = document.getElementById("project-dropdown-menu");

    if (!confirm("确定要删除该项目？\n项目内的任务也会被删除\n该操作不可恢复！")) {
        menuElement.style.display = "none";
        return;
    }
    var childArray = [];
    var projectArray = getProject();
    for (var i = 0; i < projectArray.length; i++) {
        if (projectArray[i].id == currentProjectId) {
            childArray = projectArray[i].child;
            projectArray.splice(i, 1);
            break;
        }
    }

    console.log(childArray);
    for (i = 0; i < childArray.length; i++) {
        deleteTaskById(childArray[i]);
    }

    updateProject(projectArray);
    showProject();


    // 将焦点定位至第一个目录
    if (projectArray.length > 0) {
        currentProjectId = projectArray[0].id;
        var newProject = document.getElementById("project-" + currentProjectId);
        console.log(currentProjectId, newProject);
        clickProject(newProject);
    } else {    // 所有的分类都被删除了，修改任务列表的提示信息
        currentProjectId = -1;
        document.getElementById("project-name").getElementsByTagName("h3")[0].innerHTML = "请新建一个清单";
        document.getElementById("add-task-input").setAttribute("placeholder", "请在左侧新建清单后再添加任务");
    }

    menuElement.style.display = "none";
}

// 显示所有的目录
function showProject() {
    var projectArray = getProject();
    var projectHTML = "<ul>";
    var liStr;
    for (var i = 0; i < projectArray.length; i++) {
        var id = projectArray[i].id;
        liStr = '<li id="project-'
            + id + '" data-projectid=' + id + ' onclick="clickProject(this)">'
            + '<i class="fa fa-bars"></i>'
            + '<span>'
            + projectArray[i].name
            + '</span><i class="fa fa-ellipsis-h" onclick="showDropdownMenu(this);"></i></li>';
        projectHTML += liStr;
    }
    projectHTML += '<li onclick="addProject()"><i class="fa fa-plus-circle"></i><span>创建清单</span></li></ul>';
    document.getElementById("project-list").innerHTML = projectHTML;
}

// 编辑目录的名称
function editProjectName() {
    hideDropdownMenu();
    var index = -1;

    var projectArray = getProject();
    for (var i = 0; i < projectArray.length; i++) {
        if (projectArray[i].id == currentProjectId) {
            index = i;
            break;
        }
    }

    var name = prompt("请输入新的名称：", projectArray[index].name);
    if (!name) return;

    projectArray[index].name = name;

    updateProject(projectArray);
    showProject();
    // 将焦点定位至改名后的目录
    var newProject = document.getElementById("project-" + currentProjectId);
    clickProject(newProject);
}

// 添加或删除一个任务时，更新project的child属性
// option == "delete"时，在child中删除任务
function updateProjectChild(projectId, taskId, option) {
    var projectArray = getProject();
    for (var i = 0; i < projectArray.length; i++) {
        if (projectArray[i].id == projectId) {
            if (option == "delete") {
                var index = projectArray[i].child.indexOf(parseInt(taskId));
                console.log(index, projectArray[i].child, taskId);
                projectArray[i].child.splice(index, 1);
            } else {
                projectArray[i].child.push(taskId);
            }
        }
    }
    updateProject(projectArray);
}

function showDropdownMenu(element) {
    var menuElement = document.getElementById("project-dropdown-menu");
    var menuStyle = menuElement.style;

    if (menuStyle.display == "block") {
        var distance = parseInt(menuStyle.top) - parseInt(element.offsetTop);
        if (distance - 30 == 0) {
            menuStyle.display = "none";
            return;
        }
    }

    // 将下拉菜单定位
    var top = element.offsetTop;
    var left = element.offsetLeft;
    menuStyle.position = "absolute";

    menuStyle.display = "block";
    menuStyle.top = top + 30 + "px";
    menuStyle.left = left - 30 + "px";
}

function hideDropdownMenu() {
    var menuElement = document.getElementById("project-dropdown-menu");
    var menuStyle = menuElement.style;
    menuStyle.display = "none";
}

// 点击一个任务目录
function clickProject(element) {

    cancelActive(document.getElementById("project-list"));
    addClass(element, "active");

    var newProjectId = element.getAttribute("data-projectid");

    // 如果选中的是不同的目录
    if (currentProjectId !== newProjectId) {
        currentTaskId = -1;
        currentProjectId = newProjectId;
    }

    addClass(document.getElementById("content-mask"), "not-selected");

    var projectName = "";
    var projectArray = getProject();
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
    showTaskList();
}

// ----------------------------------------------------------------------------
// 取消列表上的active类
function cancelActive(element) {
    var lists = element.getElementsByTagName("li");
    for (var i = 0; i < lists.length; i++) {
        removeClass(lists[i], "active");
    }
}

// 展开隐藏的左栏
function expandLeft() {
    var leftColumn = document.getElementById("left-view");
    leftColumn.style.position = "absolute";
    leftColumn.style.display = "block";
    leftColumn.focus();
}

// 点击左栏之外的地方，会收起左栏
function blurLeft() {
    if (window.innerWidth > 960) {return;}
    var leftColumn = document.getElementById("left-view");
    leftColumn.style.display = "none";
}

// 展开隐藏的右栏
function expandRight() {
    var rightColumn = document.getElementById("right-view");
    //rightColumn.style.position = "relative";
    rightColumn.style.display = "block";
    //rightColumn.style.marginRight = 0;
    rightColumn.focus();
}

// 收起右栏
function hideRight(event) {
    if (window.innerWidth > 600) {return;}
    var rightColumn = document.getElementById("right-view");
    rightColumn.style.display = "none";
}


window.onresize = function() {
    var leftColumn = document.getElementById("left-view");
    var wrapperElement = document.getElementById("wrapper");
    var expandElement = document.getElementById("expand-left");
    var rightColumn = document.getElementById("right-view");

    if (window.innerWidth > 960) {
        leftColumn.style.display = "block";

        wrapperElement.style.marginLeft = "260px";
        wrapperElement.style.width = "calc(100% - 260px)";
        wrapperElement.style.height = "calc(100% - 50px)";

        expandElement.style.display = "none";
    } else {
        leftColumn.style.display = "none";
        wrapperElement.style.marginLeft = "10px";
        wrapperElement.style.width = "100%";

        expandElement.style.display = "inline-block";
    }

    if (window.innerWidth > 600) {
        rightColumn.style.display = "block";
    } else {
        rightColumn.style.display = "none";
    }
};
