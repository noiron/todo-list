function hasClass(element, className) {
    if (element.classList) {
        return element.classList.contains(className);
    }
    var re = new RegExp('(\\s|^)' + className + '(\\s|$)');
    return !!element.match(re);
}

// 为element增加一个样式名为newClassName的新样式
function addClass(element, newClassName) {
    if (element.classList) {
        element.classList.add(newClassName);
    } else if (!hasClass(element, newClassName)) {
        element.className += " " + newClassName;
    }
}

// 移除element中的样式oldClassName
function removeClass(element, oldClassName) {
    if (element.classList) {
        element.classList.remove(oldClassName);
    } else if (hasClass(element, oldClassName)) {
        var re = new RegExp('(\\s|^)' + oldClassName + '(\\s|$)');
        element.className = element.className.replace(re, ' ');
    }
}

function toggleClass(element, className) {
    if (hasClass(element, className)) {
        removeClass(element, className);
    } else {
        addClass(element, className);
    }
}
