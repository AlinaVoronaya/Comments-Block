require('./styles/style.scss');
require('./styles/reset.css');

let commentForm = document.getElementById("comment-form");

function formatDate(date) {
    console.log(date)
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

function removeComment() {

}

const comments = [
    {
        user: "Alina",
        text: "Мой первый комментарий",
        date: new Date(),
        liked: false,
    }
]

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
                    <a href="#" class="comment__delete">X</a>
                </div>
                <div class="comment__bottom">
                    <p class="comment__text">${comment.text}</p>
                </div>
                <p class="comment__like">Like</p>
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
        };
        comments.push(comment)
        user.value = ''
        text.value = ''
        date.value = ''
        renderComments()
    }
});

