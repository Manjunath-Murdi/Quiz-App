const progressBar = document.querySelector('.progress-bar'),
    progressText = document.querySelector('.progress-text'),
    numQuestions = document.querySelector('#num-questions'),
    category = document.querySelector('#category'),
    difficulty = document.querySelector('#difficulty'),
    timePerQuestion = document.querySelector('#time'),
    quiz = document.querySelector('.quiz'),
    startScreen = document.querySelector('.start-screen'),
    endScreen = document.querySelector('.end-screen'),
    finalScore = document.querySelector('.final-score'),
    prog = document.querySelector('.progress'),
    totalScore = document.querySelector('.total-score');


const startBtn = document.querySelector('.start'),
      submitBtn = document.querySelector('.submit'),
      nextBtn = document.querySelector('.next'),
      restartBtn = document.querySelector('.restart');

let questions = [],
    time = 30,
    score = 0,
    currentQuestion,
    timer;

    //progress bar method
const progress = (value) => {
    const percentage = (value / time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}`;
};
//Quiz start method
const startQuiz = () => {
   const num = numQuestions.value;
    cat = category.value;
    diff = difficulty.value;
    //api url
    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            questions = data.results;
            // console.log(questions);
            startScreen.classList.add('hide');
            quiz.classList.remove('hide');
            currentQuestion = 1;
            showQuestion(questions[0]);
        });
};
//display questions once start quiz button is clicked
const showQuestion = (question) => {
    const questionText = document.querySelector('.question'),
        answersWrapper = document.querySelector('.answer-wrapper'),
        questionNumber = document.querySelector('.number');
    
    questionText.innerHTML = `<span class = qt>${question.question}</span>`;
    // console.log(questionText);
   //correct and wrong answers are separate lets mix them
    const answers = [
        ...question.incorrect_answers,
        question.correct_answer.toString(),
    ];
    //correct answers will be always at last
    //shuffle the array
    answers.sort(() => Math.random() - 0.5);
    answersWrapper.innerHTML = "";
    answers.forEach((answer) => {
        answersWrapper.innerHTML += `
            <div class="answer">
                <span class="text">${answer}</span>
                <span class="checkbox">
                    <span class="icon">&#10004;</span>
                </span>
            </div>
        `;
    });

    questionNumber.innerHTML = 
            `Question <span class="current">${questions.indexOf(question)+1}</span>
            <span class="total">/${questions.length}</span>`;

    //Event listener on answers
    const answersDiv = document.querySelectorAll('.answer');
    answersDiv.forEach((answer) => {
        answer.addEventListener('click', () => {
            //if answer not submitted
            if (!answer.classList.contains("checked")) {
                //remove selected from other answer
                answersDiv.forEach((answer) => {
                    answer.classList.remove("selected");
                });
                //add selected on currently clicked
                answer.classList.add("selected");
                //after any answer is selected enable submit button
                submitBtn.disabled = false;
            }
        });
    });
    

    //after updating question start timer
    time = timePerQuestion.value;
    startTimer(time);
};

//timer method
const startTimer = (time) => {
    timer = setInterval(() => {
        if (time >= 0) {
            //if timer is more than 0 means time remaining
            //move progress
            progress(time);
            time--;
        } else {
            //if time finishes means less than 0
            checkAnswer();
        }
    }, 1000);
};

//checks answer after clicking submit or after the time up.
const checkAnswer = () => {
    //firstclear interval when check answer triggerd
    clearInterval(timer);
    const selectedAnswer = document.querySelector('.selected');
    //any answer is selected
    if (selectedAnswer) {
        const answer = selectedAnswer.querySelector(".text")
        if (answer.innerHTML=== questions[currentQuestion - 1].correct_answer) {
            //if answer matched with current question correct answer
            //increase score
             score++;
            //add correct class on selected    
            selectedAnswer.classList.add("correct");
        } else {
            //if wrong answer selected
            //add wrong class on selected but then also add correct on correct answer
            //correct added lets add wrong on selected.
            selectedAnswer.classList.add("wrong");
            const correctAnswer = document.querySelectorAll('.answer')
                .forEach((answer) => {
                    if (answer.querySelector('.text').innerHTML === questions[currentQuestion - 1].correct_answer) {
                        //only add correct class to correct answer
                        answer.classList.add('correct');
                    }
                });
        }
    }
    //answer check will also be triggerd when time reaches 0
    //what if nothing is selected and time finishes?
    //lets just add correct class on correct answer
    else {
        const correctAnswer = document.querySelectorAll('.answer')
            .forEach((answer) => {
                if (answer.querySelector('.text').innerHTML === questions[currentQuestion - 1].correct_answer) {
                    answer.classList.add('correct');
                }
            })
    }

    //Block users to select further answers
    const answerDiv = document.querySelectorAll('.answer');
    answerDiv.forEach((answer) => {
        answer.classList.add("checked");
        //add checked class on all answer as we check for it 
        //when on click answer if its present do nothing
        //also when checked don't add hover effect on checkbox
    });
    //after submit show next btn to goto next question.
    submitBtn.style.display = "none";
    nextBtn.style.display = "block";
};

//function on click next for other questions
const nextQuestion = () => {
    //if there is remaining question
    if (currentQuestion < questions.length) {
        currentQuestion++;
        //show question
        showQuestion(questions[currentQuestion - 1]);
    } else {
        //if no question remaining
        showScore();
    }
};

const showScore = () => {
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    console.log(finalScore);
    totalScore.innerHTML = `/${questions.length}`;
}

startBtn.addEventListener("click", startQuiz);
submitBtn.addEventListener("click", () => { checkAnswer(); });
nextBtn.addEventListener("click", () => {
    nextQuestion();
    nextBtn.style.display = "none";
    submitBtn.style.display = "block";
});
restartBtn.addEventListener("click", () => {
    //reload page on click
   window.location.reload(); 
});