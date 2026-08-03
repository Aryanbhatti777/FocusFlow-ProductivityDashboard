const getTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

    return tasks;
};
// Theme

const theme = document.querySelector(".theme");

theme.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");

    if (dark) {
        theme.innerHTML = `<i class="ri-sun-line themeIcon"></i>`;
    } else {
        theme.innerHTML = `<i class="ri-moon-line themeIcon"></i>`;
    }
});

//Date and Time

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
});

const dateElement = document.querySelector(".date");
const timeElement = document.querySelector(".time h1");

const updateTime = () => {
    const now = new Date();

    dateElement.textContent = dateFormatter.format(now);
    timeElement.textContent = timeFormatter.format(now);
};
updateTime();
setInterval(updateTime, 1000);

//Fething location and weather based on user location

const getLocation = () => {
    try {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser!");
            return;
        }

        console.log("Requesting for location...");

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            getWeatherByLocation(latitude, longitude);
        });
    } catch (error) {
        alert("Internal error");
        console.log(error);
    }
};

getLocation();

const getWeatherByLocation = async (lat, long) => {
    if (!lat || !long) {
        alert("Unable to get coordinates");
    }

    try {
        const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=fbe8226654b37662db331caad38f0810&units=metric`;

        const response = await fetch(URL);

        if (!response.ok) throw new Error("Weather data not found");

        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        alert("Some error occured fetching data !");
        console.log(error.message);
    }
};

const displayWeatherData = (data) => {
    document.querySelector(".locationName").innerHTML = data.name;

    document.querySelector(".temprature").innerHTML = `${data.main.temp}°C`;

    document.querySelector(".description").innerHTML =
        data.weather[0].description;

    document.querySelector(".humidity").innerHTML = `${data.main.humidity}%`;

    document.querySelector(".wind").innerHTML = `${(
        data.wind.speed * 3.6
    ).toFixed(2)} km/h`;

    document.querySelector(".feelsLike").innerHTML = `${data.main.feels_like}°C`;

    document.querySelector(".percipitation").innerHTML =
        `${data.rain ? data.rain["1h"] : 0} mm`;

    document.querySelector(".visibility").innerHTML =
        `${data.visibility / 1000} kms`;
};

// Todo app closing opening
const todoPage = document.querySelector(".todo");
const closeTodo = document.querySelector(".close-todo");
const todoIcon = document.querySelector(".todo-icon");

todoIcon.addEventListener("click", () => {
    todoPage.classList.add("active");
    document.body.style.overflow = "hidden";
});

closeTodo.addEventListener("click", () => {
    todoPage.classList.remove("active");
    document.body.style.overflow = "";
});

// Todo working

const taskForm = document.querySelector("#taskForm");

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = taskForm.task.value.trim();
    const description = taskForm.description.value.trim();
    const category = taskForm.category.value.trim();
    const tasks = getTasks();

    if (!task || !description || !category) {
        alert("All fields are mandatory.");
    }

    const newTask = {
        id: Date.now(),
        task,
        description,
        category,
        completed: false,
    };

    tasks.push(newTask);

    localStorage.setItem("todoTasks", JSON.stringify(tasks));

    displayTasks();

    taskForm.reset();
});

const displayTasks = () => {
    const tasks = getTasks();
    const tasksDiv = document.querySelector(".tasks");
    tasksDiv.innerHTML = "";
    const taskCount = document.querySelector(".task-count span");
    taskCount.innerHTML = tasks.length;
    tasks.forEach((task) => {
        let div = document.createElement("div");
        div.classList.add("task");

        div.innerHTML = `
        <div class="task-top">
            <span class="task-category">
                <i class="ri-folder-line"></i>
                ${task.category}
            </span>
            <button
                type="button"
                class="delete-task"
                aria-label="Delete task">
                <i class="ri-delete-bin-line"></i>
            </button>
        </div>
        <div class="task-details">
            <h2>${task.task}</h2>
            <p>${task.description}</p>
        </div>
        <div class="task-footer">
            <button
                type="button"
                class="complete-task" >
                <i class="${task.completed
                ? "ri-checkbox-circle-fill"
                : "ri-checkbox-circle-line"
            }"></i>

                ${task.completed ? "Completed" : "Complete"}

            </button>

        </div>
    `;

        div.querySelector(".delete-task").addEventListener("click", () => {
            deleteTask(task.id);
        });

        tasksDiv.append(div);
    });
};

const deleteTask = (taskId) => {
    let tasks = getTasks();
    const remainingTasks = tasks.filter((t) => t.id !== taskId);
    localStorage.setItem("todoTasks", JSON.stringify(remainingTasks));

    displayTasks();
};

displayTasks();
