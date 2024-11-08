
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");

    // Initialize the game
    // checkUsername(); Uncomment once completed
    fetchQuestions();
    displayScores();

    /**
     * Fetches trivia questions from the API and displays them.
     */
    function fetchQuestions() {
        showLoading(true); // Show loading state

        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                displayQuestions(data.results);
                showLoading(false); // Hide loading state
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                showLoading(false); // Hide loading state on error
            });
    }

    /**
     * Toggles the display of the loading state and question container.
     *
     * @param {boolean} isLoading - Indicates whether the loading state should be shown.
     */
    function showLoading(isLoading) {
        document.getElementById("loading-container").classList = isLoading
            ? ""
            : "hidden";
        document.getElementById("question-container").classList = isLoading
            ? "hidden"
            : "";
    }

    /**
     * Displays fetched trivia questions.
     * @param {Object[]} questions - Array of trivia questions.
     */
    function displayQuestions(questions) {
        questionContainer.innerHTML = ""; // Clear existing questions
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(
                    question.correct_answer,
                    question.incorrect_answers,
                    index
                )}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }

    /**
     * Creates HTML for answer options.
     * @param {string} correctAnswer - The correct answer for the question.
     * @param {string[]} incorrectAnswers - Array of incorrect answers.
     * @param {number} questionIndex - The index of the current question.
     * @returns {string} HTML string of answer options.
     */
    function createAnswerOptions(
        correctAnswer,
        incorrectAnswers,
        questionIndex
    ) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
            () => Math.random() - 0.5
        );
        return allAnswers
            .map(
                (answer) => `
            <label>
                <input type="radio" name="answer${questionIndex}" value="${answer}" ${
                    answer === correctAnswer ? 'data-correct="true"' : ""
                }>
                ${answer}
            </label>
        `
            )
            .join("");
    }

    // Event listeners for form submission and new player button
    form.addEventListener("submit", handleFormSubmit);
    newPlayerButton.addEventListener("click", newPlayer);

    /**
     * Handles the trivia form submission.
     * @param {Event} event - The submit event.
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        const usernameInput = document.getElementById("username");
        const username = usernameInput.value || getCookie("username");
        
        if (!username) {
            alert("Please enter your name.");
            return;
        }
        
        setCookie("username", username, 7); // Save username for 7 days.
        // const score = calculateScore();
        const currentScore = calculateScore();
        saveScore(username, currentScore);
        displayScores();
        checkUsername();
        fetchQuestions(); // Restart the game with new questions
    }
    
    function newPlayer() {
        const username = getCookie("username");
        if (username) {
            document.getElementById("username").style.display = "none";
            document.getElementById("new-player").style.display = "block";
        }
    }
    
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = `${name}=${value};${expires};path=/`;
    }
    function getCookie(name) {
        const nameEq = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(nameEq) === 0) return c.substring(nameEq.length, c.length);
        }
        return "";
    }

    function saveScore(username, score) {
        //... code for saving the score to localStorage
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        scores.push({ player: username, score });
        localStorage.setItem("scores", JSON.stringify(scores));
    }
    function newPlayer() {
        //... code for clearing the username cookie and updating the UI
    }
    function calculateScore() {
        const questionInputs = document.querySelectorAll("input[type='radio']:checked");
        let score = 0;
        questionInputs.forEach((input) => {
            if (input.dataset.correct === "true") {
                score++;
            }
        });
        return score;
    }
    
    function displayScores() {
        //... code for displaying scores from localStorage
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        const scoreTableBody = document.getElementById("score-table").querySelector("tbody");
        scoreTableBody.innerHTML = ""; // Clear previous scores
        scores.forEach(({ player, score }) => {
            const row = scoreTableBody.insertRow();
            row.innerHTML = `<td>${player}</td><td>${score}</td>`;
        });
    }
});