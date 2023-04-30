import {data} from "./data.js"
const root = document.getElementById("root")

//eventlistener boilerplate
document.addEventListener("click", (e) => {
    
    function eventListener(comments){
        comments.forEach((comment) => {
            handleClick(e, comment)
            if(comment.postComments.length > 0){
                eventListener(comment.postComments)
            }
        })
    }
    eventListener(data)
})

function handleClick(e, comment){
    if(e.target.dataset.counterPlus == comment.id && comment.likedStatus != 1){
        handlePlus(e, comment)
    }
    if(e.target.dataset.counterMinus == comment.id && comment.likedStatus != -1){
        handleMinus(e, comment)
    }
    if(e.target.dataset.replyBtnForTab == comment.id){
        openReplyTextarea(comment)
    }
    if(e.target.dataset.replyBtn == comment.id){
        postReply(comment)   
    }
    if(e.target.dataset.editBtnForTab == comment.id){
        openEditTextarea(comment)   
    }
    if(e.target.dataset.editBtn == comment.id){
        editReply(comment)   
    }
    if(e.target.dataset.deleteBtnForTab == comment.id){
        toggleDeleteModal(comment)   
    }
    if(e.target.dataset.cancelBtn == comment.id){
        toggleDeleteModal(comment)
    }
    if(e.target.dataset.deleteBtn == comment.id){
        deletePost(data, comment)
        document.getElementById("modal").classList.toggle("hidden")
        render()
    }
}

//buttons functions
    //modal
function toggleDeleteModal(comment){
    document.getElementById("modal").classList.toggle("hidden")
    document.getElementById("modal").innerHTML = `
    <div class="modal">
        <h2>Delete comment</h2>
            <p>Are you sure you want to delete this comment? This change cannot be undone.</p>
            <div class="modal-btn-div">
                <button data-cancel-btn="${comment.id}">NO, CANCEL</button>
                <button data-delete-btn="${comment.id}">YES, DELETE</button>
            </div>
    </div> `
}
    //delete
function deletePost(subcomment, comment){
    for(let i = 0; i < subcomment.length; i++) {
        if(subcomment[i].id == comment.id){subcomment.splice(i, 1)}
        else deletePost(subcomment[i].postComments, comment)
    }
}
    //edit feature
function openEditTextarea(comment){

    document.getElementById(`${"postText" + comment.id}`).innerHTML = `
    <textarea id="${"textarea" + comment.id}" placeholder="Add a comment..." value="">${`${comment.at} ${comment.postText}`}</textarea>
    <button data-edit-btn="${comment.id}">UPDATE</button>
    </div>`
}

        //set format for text
        function setTextFormat(comment){
            if(document.getElementById(`${"textarea" + comment.id}`).value.startsWith("@"))
            {return document.getElementById(`${"textarea" + comment.id}`).value.split(" ").slice(1).join(" ")}
            else {return document.getElementById(`${"textarea" + comment.id}`).value}
        }


function editReply(comment){

    comment.postText = setTextFormat(comment)
    render()
}

    //reply feature
function openReplyTextarea(comment){

    if(!comment.textareaOpen){
        document.getElementById(`${"reply-textarea" + comment.id}`).innerHTML = `
        ${comment.at ? '<hr width="1" size="auto"/>' : ""}
        <div class="replytextarea">
        <img src="./assets/avatars/image-juliusomo.png">
        <textarea id="${"textarea" + comment.id}" placeholder="Add a comment..." value="">${"@" + comment.name + " "}</textarea>
        <button data-reply-btn="${comment.id}">REPLY</button>
        </div>`}
    else {document.getElementById(`${"reply-textarea" + comment.id}`).innerHTML = ""}
    comment.textareaOpen = !comment.textareaOpen 
}

function postReply(comment){

    const newComment = {id: crypto.randomUUID(),
        name: "juliusomo",
        imagesrc: "./assets/avatars/image-juliusomo.png",
        you: true,
        postDate: "now",
        at: "@" + comment.name,
        postText: setTextFormat(comment),
        postComments: [],
        postLikes: 0,
        likedStatus: 0,
        textareaOpen: false}

    comment.postComments.push(newComment)
    comment.textareaOpen = !comment.textareaOpen 
    render()
}

    //send comment
document.getElementById("send-btn").addEventListener("click", () => {

    console.log("hi")
    const newComment = {id: crypto.randomUUID(),
        name: "juliusomo",
        imagesrc: "./assets/avatars/image-juliusomo.png",
        you: true,
        postDate: "now",
        postText: document.getElementById("send-text-area").value,
        postComments: [],
        postLikes: 0,
        likedStatus: 0,
        textareaOpen: false}

        data.push(newComment)
        document.getElementById("send-text-area").value = ""
        render()
})

    //counter handler
function handlePlus(e, comment){
    
    comment.likedStatus = Math.min(comment.likedStatus + 1, 1)
    comment.postLikes += 1
    e.target.parentElement.children[1].innerHTML = comment.postLikes
        
    if(comment.likedStatus == 1){e.target.parentElement.children[0].style.filter = "invert(100%) sepia(84%) saturate(684%) hue-rotate(206deg) brightness(95%) contrast(87%)"
    e.target.parentElement.children[2].style.filter = ""}
    else {e.target.parentElement.children[0].style.filter = ""
    e.target.parentElement.children[2].style.filter = ""}
}

function handleMinus(e, comment){   

    comment.likedStatus = Math.max(comment.likedStatus - 1, -1)
    comment.postLikes -= 1
    e.target.parentElement.children[1].innerHTML = comment.postLikes

    if(comment.likedStatus == -1){e.target.parentElement.children[2].style.filter = "invert(100%) sepia(84%) saturate(684%) hue-rotate(206deg) brightness(95%) contrast(87%)"
    e.target.parentElement.children[0].style.filter = ""}
    else {e.target.parentElement.children[2].style.filter = ""
    e.target.parentElement.children[0].style.filter = ""}
}

// html boilerplate
let commentHtml= ""
function generateCommentHtml(comment){  
    commentHtml += `
    <section id="${"comment" + comment.id}">
        ${comment.at ? '<hr width="1" size="auto"/>' : ""}
        <div class="container">
            <div class="name-time-info">
                <img src="${comment.imagesrc}">
                <h3>${comment.name}</h3>
                ${comment.you ? `<h4>you</h4>` : ""}
                <p>${comment.postDate}</p>
            </div>
            <div id="${"postText" + comment.id}" class="text">
                <p>${comment.at ? `<span>${comment.at} </span>` : ""} ${comment.postText}</p>
            </div>
            <div class="counter-el">
                <img data-counter-plus="${comment.id}" tabindex="1" src="assets/icon-plus.svg">
                <p>${comment.postLikes}</p>
                <img data-counter-minus="${comment.id}" tabindex="1" src="assets/icon-minus.svg">
            </div>
            ${!comment.you ? `<div data-reply-btn-for-tab="${comment.id}" tabindex="1" class="reply-btn action">
                <img data-reply-btn-for-tab="${comment.id}" src="assets/icon-reply.svg">
                <p data-reply-btn-for-tab="${comment.id}">Reply</p>
            </div>` :
            `<div class="delete-edit-btn action">
                <div data-delete-btn-for-tab="${comment.id}" tabindex="1" class="delete">
                    <img data-delete-btn-for-tab="${comment.id}" src="assets/icon-delete.svg">
                    <p data-delete-btn-for-tab="${comment.id}">Delete</p>
                </div>
                <div data-edit-btn-for-tab="${comment.id}" tabindex="1" class="edit">
                    <img data-edit-btn-for-tab="${comment.id}" src="assets/icon-edit.svg">
                    <p data-edit-btn-for-tab="${comment.id}">Edit</p>
                </div>
            </div>`
        }
        </div>
    </section>
    <section id="${"reply-textarea" + comment.id}" data-reply-textarea="${comment.id}"></section>`
    return commentHtml
}

//render
function render() {
    commentHtml= ""
    function renderLoop(comments){
        comments.forEach(comment => {
            generateCommentHtml(comment)
            if(comment.postComments.length > 0){renderLoop(comment.postComments)}      
        })
    }
    renderLoop(data)
    root.innerHTML = commentHtml
}

render()




