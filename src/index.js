require('./styles/style.scss');
require('./styles/reset.css');
import {v4 as uuidv4} from 'uuid';

let commentForm = document.getElementById("comment-form");

let comments = [
    {
        user: "Alina",
        text: "Мой первый комментарий",
        date: new Date(),
        liked: false,
        id: uuidv4()
    }
]

function formatDate(date) {
    let today = new Date();
    const day = ('0' + (date.getDay() + 1)).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const fullYear = date.getFullYear();
    const hours = ('0' + (date.getHours())).slice(-2);
    const minutes = ('0' + (date.getMinutes())).slice(-2);
    const diffDays = today.getDate() - date.getDate();
    const diffMonths = today.getMonth() - date.getMonth();
    const diffYears = today.getFullYear() - fullYear;

    if (diffDays === 0 && diffMonths === 0 && diffYears === 0) {
        return `сегодня, ${hours}:${minutes}`;
    }

    if (diffDays === 1 && diffMonths === 0 && diffYears === 0) {
        return `вчера, ${hours}:${minutes}`;
    }

    return `${day}.${month}.${fullYear}, ${hours}:${minutes}`;
}

const removeComment = (id) => {
    comments = comments.filter(item => item.id !== id);
    renderComments();
}

const likeComment = (id) => {
    // найти комментарий и проставить ему like = !like
    const comment = comments.find(item => item.id === id);
    console.log("comment found: ", comment);
    if (comment !== undefined) {
        comment.liked = !comment.liked;
        console.log(comment.liked);
        renderComments()
    }
}

function submitOnEnter(e) {
    if (e.which === 13) {
        if (!e.repeat) {
            const newEvent = new Event("submit", {cancelable: true});
            e.target.form.dispatchEvent(newEvent);
        }

        e.preventDefault();
    }
}

document.getElementById("commentText").addEventListener("keydown", submitOnEnter);

document.addEventListener("click", (e) => {
    console.log("click on", e, e.target.parent)
    const target = e.target
    // если кликнули на кнопку удаления
    if (target.dataset.id !== "" && target.dataset.action === "remove") {
        console.log("click to remove")
        removeComment(target.dataset.id)
    }
    // если кликнули на кнопку лайка
    if ((target.dataset.id !== "" && target.dataset.action === "like") || (target.parentElement.dataset.id !== "" && target.parentElement.dataset.action === "like")) {
        console.log("click to like")
        likeComment(target.dataset.id ? target.dataset.id : target.parentElement.dataset.id)
    }
})

// навешиваем обработчик на событие готовности страницы, чтобы отрисовать список комментариев по-умолчанию
document.addEventListener('DOMContentLoaded', () => {
    renderComments()
})

// функция перерисовывает заново список существющих комментариев
function renderComments() {
    const commentsContainer = document.getElementById("comments")
    commentsContainer.innerHTML = '';
    for (let comment of comments) {
        // 2. добавить каждый комментарий из массива заново на экран
        let commentsItem = renderComment(comment);
        commentsContainer.append(commentsItem);
    }
}

// функция создает текстовое представление комментария
function renderComment(comment) {
    let commentsItem = document.createElement("div");
    commentsItem.classList.add('comments__item');
    commentsItem.innerHTML = `<div class="comment">
                <div class="comment__top">
                    <p class="comment__name">${comment.user}</p>
                    <p class="comment__date">${formatDate(comment.date)}</p>
                    <a href="#" class="comment__delete" data-id="${comment.id}" data-action="remove">X</a>
                </div>
                <div class="comment__bottom">
                    <p class="comment__text">${comment.text}</p>
                </div>
                <svg class="comment__like like ${comment.liked ? "like--active" : ""}" data-id="${comment.id}" data-action="like" width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.7663 2.32611C15.3753 1.90569 14.9111 1.57219 14.4002 1.34465C13.8893 1.11711 13.3417 1 12.7887 1C12.2357 1 11.6881 1.11711 11.1772 1.34465C10.6663 1.57219 10.2021 1.90569 9.81116 2.32611L8.9998 3.19821L8.18843 2.32611C7.39874 1.4773 6.32768 1.00044 5.21089 1.00044C4.09409 1.00044 3.02303 1.4773 2.23334 2.32611C1.44365 3.17492 1 4.32616 1 5.52656C1 6.72696 1.44365 7.87819 2.23334 8.727L3.0447 9.5991L8.9998 16L14.9549 9.5991L15.7663 8.727C16.1574 8.30679 16.4677 7.80785 16.6794 7.25871C16.891 6.70957 17 6.12097 17 5.52656C17 4.93214 16.891 4.34355 16.6794 3.7944C16.4677 3.24526 16.1574 2.74633 15.7663 2.32611V2.32611Z" stroke="#2A2A2B" stroke-width="1.46667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


            </div>`;
    return commentsItem;
}


commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = e.target.querySelector("[name=name]");
    const text = e.target.querySelector("[name=text]");
    const date = e.target.querySelector("[name=date]");
    console.log(user.value, text.value, date.value);
    if (user.value !== '' && text.value !== '') {
        let parsedDate = new Date()
        if (date.value !== "") {
            parsedDate = new Date(Date.parse(`${date.value} ${parsedDate.getHours()}:${parsedDate.getMinutes()}`))
        }
        const comment = {
            user: user.value,
            text: text.value,
            date: parsedDate,
            liked: false,
            id: uuidv4()
        };
        comments.push(comment)
        user.value = ''
        text.value = ''
        date.value = ''
        renderComments()
    }
});

