function toggle_nav() {
    var user_data = document.getElementById('mobile-menu')
    if (user_data.style.display == 'none') {
        user_data.style.display = 'block'
        return;
    }
    if (user_data.style.display == 'block') {
        user_data.style.display = 'none'
        return;
    }

}

function toggle_user() {
    var user_data = document.getElementById('user-bar')
    if (user_data.style.display == 'none') {
        user_data.style.display = 'block'
        return;
    }
    if (user_data.style.display == 'block') {
        user_data.style.display = 'none'
        return;
    }

}
function chk_c() {
    const course = document.getElementById('subject').value
    const chapter = document.getElementById('chapter').value
    const level = document.getElementById('level').value
    const question = document.getElementById('question').value
    const name = document.getElementById('name').value

    document.getElementById('subject_l').innerText = course
    document.getElementById('level_l').innerText = level
    document.getElementById('question_l').innerText = question
    document.getElementById('name_l').innerText = name


}
chk_c()




const toggleBackCard = () => {
    cardEl = document.getElementById("creditCard");
    if (cardEl.classList.contains("seeBack")) {
        cardEl.classList.remove("seeBack");
    } else {
        cardEl.classList.add("seeBack");
    }
};
const showBackCard = () => {
    cardEl = document.getElementById("creditCard");
    if (!cardEl.classList.contains("seeBack")) {
        cardEl.classList.add("seeBack");
    }
};
const hideBackCard = () => {
    cardEl = document.getElementById("creditCard");
    if (cardEl.classList.contains("seeBack")) {
        cardEl.classList.remove("seeBack");
    }
};

async function timeout(id, sec) {
    function myFunction1() {
        document.getElementById(`rq${id}-1`).style.display = 'none'
        document.getElementById(`rq${id}-2`).style.display = 'flex'
        try {

            document.getElementById(`rq${id + 1}`).style.display = 'flex'
        } catch (error) {

        }

    }
    await setTimeout(myFunction1, sec)
}

let isCreatingQuiz = false

async function create() {
    if (isCreatingQuiz) {
        return;
    }

    const course = document.getElementById('subject').value
    const chapter = document.getElementById('chapter').value
    const level = document.getElementById('level').value
    const question = document.getElementById('question').value
    const trueFalseControl = document.getElementById('trueFalse')
    const trueFalse = trueFalseControl ? trueFalseControl.checked : false
    const errorMessage = document.getElementById('generation-error')
    const submitButton = document.getElementById('generate-quiz')

    const queryParams = {
        level: level,
        chapter: chapter,
        subject: course,
        question: question,
        trueFalse: trueFalse
    };

    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

    const fullUrl = `/make?${queryString}`;

    isCreatingQuiz = true
    if (submitButton) submitButton.disabled = true
    if (errorMessage) errorMessage.hidden = true
    showBackCard()

    try {
        const response = await fetch(fullUrl)
        const payload = await response.json().catch(() => ({}))

        if (!response.ok) {
            throw new Error(payload.error || 'Unable to create a quiz. Please try again.')
        }

        if (!payload.url) {
            throw new Error('The quiz service returned an incomplete quiz. Please try again.')
        }

        localStorage.setItem(payload.url, JSON.stringify(payload))
        window.location.assign(`/q/${payload.url}`)
    } catch (error) {
        hideBackCard()
        if (errorMessage) {
            errorMessage.textContent = error.message
            errorMessage.hidden = false
        } else {
            alert(error.message)
        }
        console.warn('Quiz generation failed:', error.message)
    } finally {
        isCreatingQuiz = false
        if (submitButton) submitButton.disabled = false
    }
}
function uploadFile() {
    var fileInput = document.getElementById('jsonFile');
    var file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            try {
                var jsonData = JSON.parse(e.target.result);
                if (jsonData['url'] == undefined) {
                    alert('Invalid AI Quiz JSON file. Please upload a valid AI Quiz JSON file.');
                    return;
                }
                jsonData['url'] = jsonData['url'] + '-local'
                localStorage.setItem(jsonData['url'], JSON.stringify(jsonData))

                window.location = `/q/${jsonData['url']}`
            } catch (error) {
                alert(`Invalid AI Quiz JSON file. Please upload a valid AI Quiz JSON file. ${error}`);
            }
        };

        reader.readAsText(file);
    } else {
        alert('Please choose a JSON file to upload.');
    }
}
