// select all questions on the FAQs page
var questions = document.getElementsByClassName("question");

//iterate over each and add an event listener that makes the next element (i.e. the answer) visible upon clicking and collapse if it was already displayed

for (let i = 0 ; i < questions.length; i++){
    questions[i].addEventListener("click",function(){
    var answer = this.nextElementSibling;
    if (answer.style.display === "block") {
      answer.style.display = "none";
    }
    else
      answer.style.display = "block";
    });
}
