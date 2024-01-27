var sub_input = document.getElementById("sub_inp");
var text_inp = document.getElementById("text_inp");
var button1 = document.getElementById("btn1");
q_list = document.getElementById("questionlist");
var containerInteration = document.getElementById("containerInteration");
var res_container = document.getElementById("res_container");
var add_response_here;
var n_butt = document.getElementById("n_button");
var ques_id = document.getElementById("ques_id");

// (localStorage.getItem("questions"))?"":(localStorage.setItem("questions","[]"))
// (localStorage.getItem("responses"))?"":(localStorage.setItem("responses","[]"))

var arr = JSON.parse(localStorage.getItem("questions")) || [];
let index = 0;
let responsesArray = JSON.parse(localStorage.getItem("responses")) || [];

document.addEventListener("DOMContentLoaded",()=>{
    arr.forEach((e)=>{
        create_question_item(e)
    })
})

button1.addEventListener("click", function () {
    if (sub_input.value == "") {
        alert("Please enter the subject");
    }
    else {
        //create a object
        const obj = {
            sub: sub_input.value,//for subject
            question: text_inp.value,//forquestion
            isfav: false,//for value,
            id: Date.now()
        }
        arr.push(obj);
        localStorage.questions = JSON.stringify(arr)
        create_question_item(obj);//call the fucntion
        //  localStorage.ques = JSON.stringify(arr);//ques key use ki ,load the sata into the local storage ;set item

    }
})


function create_question_item(item) //fucntion defiinition
{
    const div1 = document.createElement("div");//dynamically create a div
    div1.className = "questionitem";//give a classname to every div
    div1.id = "q" + item.id;//give uniue value to every div

    div1.innerHTML =
        `<h1 class="sub"> ${item.sub} </h1>
                   <h4 class="ques">${item.question}</h4>
                   <div  id="${item.id}" class="star" onclick="starclick(event,${item.id})"><i id="staricon-${item.id}" class="fa fa-star-o" aria-hidden="true"></i></div>`
    // div1.style.borderBottomColor="black";     
    q_list.appendChild(div1);  //append in q_list
    sub_input.value = "";//blank the feild 
    text_inp.value = "";


    div1.addEventListener("click", function (e) {
        const div = document.createElement("div");
        div.innerHTML = `<div class="question" id="ques_id">
                            <div id="q_heading">Question</div>
                            <div class="q1_data" id="q1data">  <p> ${item.sub} </p> <p> ${item.question}</p></div>
                            <div class="resolve_button"><button id="resolvebutton" onclick="resolveQues('${item.id}')" >Resolve</button></div>
                        </div>
                        <div class="response">
                            <div id="response">Response</div>
                            <div id="add_response_here"> </div>
                        </div>   

                        <div class="addresponse">
                            <div id="add_respond">AddResponse</div>
                            <div ><input type="text" placeholder="Enter Name" id="respondinput"> </div>
                            <div><textarea rows="5" cols="100" placeholder="Enter Comments" id="respondtextarea"> </textarea></div>    
                            <div><input type="button" id="respondbutton" value="Respond" ></div>     
                        </div>`
        res_container.innerHTML = "";
        res_container.appendChild(div);
        containerInteration.style.display = "none";
        res_container.style.display = "block";
        add_response_here = document.getElementById("add_response_here");

        r(item.id);
        renderResponses(item.id)
    })
}

function renderResponses(id) {
    add_response_here.innerHTML = ""
    const response = responsesArray.filter(function (element) {
        if (element.id == id)
            return element;
    });
    if (response.length > 0) {
        response.forEach(function (element) {
            createresponseitem(element);
        })
    }
}

function resolveQues(id) {
    const item = document.getElementById("q" + id).remove()
    add_response_here.innerHTML = "";
    containerInteration.style.display = "block";
    res_container.style.display = "none";
}

//toggle ==on to off and off to on
function starclick(e, id) {
    const staricon = document.getElementById("staricon-" + id);
    e.stopPropagation();//parent listener  donot effeect on the child
    const index = arr.findIndex(function (element) {
        if (element.id == id)
            return element;
    })
    arr[index].isfav = !arr[index].isfav//toggling false to true or true to false
    const item = document.getElementById("q" + id)//div item get and copies to the item
    if (arr[index].isfav) {
        console.log("marked");
        staricon.classList.remove("fa-star-o")
        staricon.classList.add("fa-star")//
        item.remove()//if item is marked start then remove it from its original position
        q_list.prepend(item)// prepend it on the top 
    } else {
        console.log("ummarked");
        staricon.classList.remove("fa-star")
        staricon.classList.add("fa-star-o")
        item.remove() //if item is not marked star then remove it from its original position
        q_list.appendChild(item)// place it at the bottom
    }
}




function r(id) {
    document.getElementById("respondbutton").addEventListener('click', function (e) {
        //e=event milta hai humein//event kai through hummaninulation krte hai

        //console.log(add_response_here);
        const respondinput = document.getElementById("respondinput");
        const respondtextarea = document.getElementById("respondtextarea");
        const obj = {
            name: respondinput.value,
            comment: respondtextarea.value,
            likes: 0,
            dislikes: 0,
            rid: Date.now(),
            id: id
        }
        responsesArray.push(obj);
        localStorage.responses = JSON.stringify(responsesArray)//save
        createresponseitem(obj);
    })
}


function dislikeRes(rid, id) {
    const index = responsesArray.findIndex(function (element) {
        if (element.rid == rid)
            return element;
    })
    responsesArray[index].dislikes += 1
    console.log(responsesArray[index]);
    localStorage.responses = JSON.stringify(responsesArray)
    renderResponses(id)
}

function likeRes(rid, id) {
    const index = responsesArray.findIndex(function (element) {
        if (element.rid == rid)
            return element;
    })
    responsesArray[index].likes += 1
    localStorage.responses = JSON.stringify(responsesArray)
    console.log(responsesArray[index]);
    renderResponses(id)
}

function createresponseitem(item) {
    const div = document.createElement("div");
    div.innerHTML = `<p class="respondcomment"> ${item.comment}<p>
                    <p class= "respondname"> ${item.name}</p>
                    <span><i onclick= "dislikeRes( ${item.rid}, ${item.id} )" class="fa fa-thumbs-down" aria-hidden="true"></i> <span id="dis-${item.id}">  ${item.dislikes}</span> </span>
                    <span><i onclick="likeRes( ${item.rid},${item.id} )" class="fa fa-thumbs-up" aria-hidden="true"></i> <span id="lik-${item.id}">  ${item.likes}</span> </span>`
    add_response_here.append(div);//append
    respondinput.value = "";
    respondtextarea.value = "";
}


//click on the new qiestion form
n_butt.addEventListener("click", function () {
    containerInteration.style.display = "block";
    res_container.style.display = "none";

})











