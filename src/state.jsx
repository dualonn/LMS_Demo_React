export class Block{
    constructor(title, content){
        this.title = title
        this.content = content
    }
}

export class Page{
    constructor(title, blocks){
        this.title = title
        this.blocks = blocks
    }
}

export class Course{
    constructor(title, pages){
        this.title = title
        this.pages = pages
    }
}

export class Quiz{
    constructor(name, questions){
        this.name = name
        this.questions = questions
    }
}

export class Question{
    constructor(type, content, answers, correct_answer){
        this.type = type
        this.content = content
        this.answers = answers
        this.correct_answer = correct_answer
    }
}

const js_basics_questions = [
    new Question("multiple_choice", "What is JavaScript?", ["A programming language", "Old 16th century play script", "A movie"], 0),
    new Question("multiple_choice", "What is JavaScript usually used for?", ["Client-side web development", "Game development", "Application development"], 0),
    new Question("true_false", "JavaScript is a case-sensitive language.", "", true),
    new Question("fill_blank", "Javascript is an ______ Oriented Language.", "","object")
]

const javascript_basics = new Quiz(
    "JavaScript Basics",
    js_basics_questions
)

const js_basics_block = new Block(
    "JavaScript Basics Quiz Block",
    [javascript_basics]
)

const js_basics_page = new Page(
    "JavaScript Basics",
    [js_basics_block]
)

const js_basics_course = new Course(
    "Basic Web Development",
    [js_basics_page]
)

export var default_state = {
    courses: [js_basics_course],
    quizzes: [],
    users: [],
    course: 0,
    page: 0,
    user: 0,
    data: null,
    show_login_form: false
}