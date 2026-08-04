const getTasks = () => {
  const planners = JSON.parse(localStorage.getItem("todoTasks")) || [];

  return planners;
};

const getPlanners = () => {
  const planners = JSON.parse(localStorage.getItem("planner")) || [];

  return planners;
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

document.querySelector(".cancel").addEventListener("click", () => {
  taskForm.reset();
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = taskForm.task.value.trim();
  const description = taskForm.description.value.trim();
  const category = taskForm.category.value.trim();
  const planners = getTasks();

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

  planners.push(newTask);

  localStorage.setItem("todoTasks", JSON.stringify(planners));

  displayTasks();

  taskForm.reset();
});

const displayTasks = (planners = getTasks()) => {
  const tasksDiv = document.querySelector(".tasks");
  tasksDiv.innerHTML = "";

  if (planners.length === 0) {
    tasksDiv.innerHTML = "<p>No Tasks added yet.</p>";
  }
  const taskCount = document.querySelector(".task-count span");
  taskCount.innerHTML = planners.length;
  planners.forEach((task) => {
    let div = document.createElement("div");
    div.classList.add("task");
    if (task.completed) {
      div.classList.add("completed");
    }

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
                <i class="${
                  task.completed
                    ? "ri-checkbox-circle-fill"
                    : "ri-checkbox-circle-line"
                }"></i>

                ${task.completed ? "Undo" : "Complete"}

            </button>

        </div>
    `;

    div.querySelector(".delete-task").addEventListener("click", () => {
      deleteTask(task.id);
    });

    div.querySelector(".complete-task").addEventListener("click", () => {
      completeTask(task.id);
    });

    tasksDiv.append(div);
  });
};

// Filter Tasks

document.querySelector(".search-btn").addEventListener("click", () => {
  filterTasks();
});

const filterTasks = () => {
  const planners = getTasks();
  const searchInput = document.querySelector(".search").value.toLowerCase();

  const filtered = planners.filter(
    (t) =>
      t.task.toLowerCase().includes(searchInput) ||
      t.description.toLowerCase().includes(searchInput) ||
      t.category.toLowerCase().includes(searchInput),
  );

  displayTasks(filtered);
};

document.querySelector(".all").addEventListener("click", () => {
  displayTasks(getTasks());
});

// delete Tasks

const deleteTask = (taskId) => {
  let planners = getTasks();
  const remainingTasks = planners.filter((t) => t.id !== taskId);
  localStorage.setItem("todoTasks", JSON.stringify(remainingTasks));

  displayTasks();
};

// complete Tasks

const completeTask = (taskId) => {
  let planners = getTasks();

  planners = planners.map((task) =>
    task.id == taskId ? { ...task, completed: !task.completed } : task,
  );

  localStorage.setItem("todoTasks", JSON.stringify(planners));

  displayTasks();
};

// daily planner closing opening

const plannerPage = document.querySelector(".daily-planner");
const plannerIcon = document.querySelector(".planner-icon");
const closePlanner = document.querySelector(".close-planner");

plannerIcon.addEventListener("click", () => {
  plannerPage.classList.add("active");
  document.body.style.overflow = "hidden";
});

closePlanner.addEventListener("click", () => {
  plannerPage.classList.remove("active");
  document.body.style.overflow = "";
});

// daily planner working

const plannerForm = document.querySelector("#plannerForm");

// add plans

plannerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const planners = getPlanners();
  const time = plannerForm.time.value.trim();
  const plan = plannerForm.plan.value.trim();
  const category = plannerForm.category.value.trim();

  if (!time || !plan || !category) {
    alert("All fields are mandatory.");
  }

  const newPlanner = {
    id: Date.now(),
    time,
    plan,
    category,
    completed: false,
  };

  planners.push(newPlanner);

  localStorage.setItem("planner", JSON.stringify(planners));

  displayPlanners();

  plannerForm.reset();
});

// display planners

const displayPlanners = () => {
  const plannersDiv = document.querySelector(".planner-timeline");
  plannersDiv.innerHTML = "";

  const planners = getPlanners();
  const plannerCount = document.querySelector(".total-hours");
  plannerCount.innerHTML = planners.length;

  planners.forEach((plan) => {
    const div = document.createElement("div");
    div.classList.add("planner-item");
    if (plan.completed) {
      div.classList.add("completed");
    }
    div.innerHTML = `
    
        <div class="planner-time">
            ${plan.time}
        </div>
        <div class="planner-line">
            <span class="planner-dot"></span>
        </div>
        <div class="planner-task">
            <div class="planner-task-top">
                <span class="planner-category">
                    <i class="ri-folder-line"></i>
                    ${plan.category}
                </span>
                <button
                    type="button"
                    class="delete-plan"
                    aria-label="Delete plan">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
            <h3>
                ${plan.plan}
            </h3>
            <button
                type="button"
                class="complete-plan">
                <i class="${
                  plan.completed
                    ? "ri-checkbox-circle-fill"
                    : "ri-checkbox-circle-line"
                }"></i>
                ${plan.completed ? "Completed" : "Mark as Complete"}
            </button>
        </div>
`;

    div.querySelector(".delete-plan").addEventListener("click", () => {
      deletePlan(plan.id);
    });

    div.querySelector(".complete-plan").addEventListener("click", () => {
      completePlan(plan.id);
    });

    plannersDiv.append(div);
  });
};

// delete plan

const deletePlan = (planId) => {
  let planners = getPlanners();
  const remainingPlanners = planners.filter((p) => p.id !== planId);
  localStorage.setItem("planner", JSON.stringify(remainingPlanners));

  displayPlanners();
};

const completePlan = (planId) => {
  let planners = getPlanners();

  planners = planners.map((plan) =>
    plan.id == planId ? { ...plan, completed: !plan.completed } : plan,
  );

  localStorage.setItem("planner", JSON.stringify(planners));

  displayPlanners();
};



// initial Renders
displayTasks();
displayPlanners();
