// shuffle questions
var questions_order = shuffle_index(questions);

// ask all questions if 
// questions_nb is not defined
if (!questions_nb){
    questions_nb=questions.length;
}


var sec;
// maximum score is the sum of all time
var score_max = 0;

var tempo;
var score = 0;


$(document).ready(function(){
    quiz_play();
})


function shuffle_index(a){
    var temp_array = new Array();
    var len = a.length;
    // fill table
    for (idx=0; idx<len; idx++) {
        temp_array.push(idx);
    }
    // shuffle table
    for (x=0; x<len; x++) {
        var i = Math.floor(len * Math.random());
        var j = Math.floor(len * Math.random());
        var t = temp_array[i];
        temp_array[i] = temp_array[j];
        temp_array[j] = t;
    }
    return temp_array;
}

function quiz_start(){
    document.getElementById("welcome_questions_nb").innerHTML = questions_nb;
}
 
function quiz_play(){
    $("#score_value").html(score);
	question_idx = questions_order.pop();
    questions_count = 1;
    ask_question(question_idx);
    
}

function quiz_finish(){
    // hide question header (q number + timer) 
    // and question body (question + answers)
    $("#question_header").css("display", "none");
    $("#question_body").css("display", "none");
	$("#comment_1").html("<p>La partie est terminée !</p>");

    var content = "<input type='button' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect' value='Rejouer' onclick='window.location.reload();' />";
    content += "&nbsp;&nbsp;";
    //content += "<br><br> <a href='index.html' class='btn btn-primary'>Quitter</a>"
    $("#question_next_replay").html(content);
    
    perf = score / score_max * 100;
    if (perf>=0 && perf<50){
        msg = "Essayez de rejouer. Vous allez certainement vous améliorer";
    }
    if (perf>=50 && perf<75){
        msg = "Vous avez fait un bon score mais vous pouvez sans doute faire mieux. Réessayez.";
    }
    if (perf>=75 ){
        msg = "Bravo. Vous avez une bonne connaissance sur le haricot";
    }	
    $("#comment_2").html(msg);
}


function ask_question(){
    // clean previous comment (if any)
    $("#comment_1").html("");
    $("#comment_2").html("");
    // remove next button
    $("#question_next_replay").html("");
    
	// no more question
    if(questions_count > questions_nb){
        quiz_finish();
        return false;
    }
    // get all data related to a question
    q_data = questions[ question_idx ]
    // update question number
    $("#question_nb_value").html(questions_count);
    $(".progress-bar").css({"width": questions_count+"0%","background-color":"#003718"});

    // update question text
    $("#question_text").html(q_data.text);
    // shuffle answers
    answers_shuffled = shuffle_index(q_data.answers)
    // write answers
	var answers_content="";
	answers_content+="<form action='#'>";
	for(var i=0; i<q_data.answers.length; i++){
        var answer_idx = answers_shuffled.pop();

        answers_content += "<div class='question_answer'><input type='button' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect answer-button btn-answer'";
        answers_content += " value='" + q_data.answers[answer_idx].text +"'"; 
        answers_content += " onclick='correct_answer("+question_idx+","+answer_idx+");' /></div><br>";

    }
	answers_content+="<\/form>";
	$("#answers").html(answers_content);
    
    // update maximum score
    score_max += q_data.time;
    // update question index
    question_idx = questions_order.pop();
    // update question count
    questions_count ++;

    
    // update countdown
    sec=parseInt(q_data.time)+1;
    countdown();
    // update score
    $("#question_score_value").html(score);
}

function countdown(){
	sec--;
	if(sec<10){sec="0"+sec;}//mettre un zéro avant l'unité
	document.getElementById("question_timer_value").innerHTML = sec;
	if(sec>0){
        tempo=setTimeout('countdown()',1000);
    }
	if(sec==0){
        // desactivate answers buttons
        $(".btn-answer").attr("onclick", "#");
        // add comment
        $("#comment_1").html("<div class='answer_wrong'>Le temps est écoulé !<\/div>");
        // add next button
        add_button_next(question_idx+1);
        // update score
        $("#question_score_value").html(score);
        return false;
    }
}

function correct_answer(q_idx, a_idx){
    var answer = questions[q_idx].answers[a_idx];
    // stop countdown
    clearTimeout(tempo);

    // desactivate answers buttons
    $(".btn-answer").attr("onclick", "#");
 
    // update score
	if(answer.correct==true){
        score = score + parseInt(sec);

	}
    $("#question_score_value").html(score);
    
    // display comment
    add_comment(answer.correct, answer.comment);
    add_button_next(question_idx);
}


function add_button_next(idx){
    var content = "<input type='button' class='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect' value='Continuer' onclick='ask_question("+(idx)+");' /><br>";
    $("#question_next_replay").html(content);
}

function add_comment(correct, comment){
    var com_text = "";
    if (correct == true) {
        com_text = "<div class='answer_correct'>Bravo. Bonne réponse !<\/div>";
    } else {
        com_text = "<div class='answer_wrong'>Mauvaise réponse.<\/div>";
    }
    $("#comment_1").html(com_text);
    $("#comment_2").html(comment);
}
