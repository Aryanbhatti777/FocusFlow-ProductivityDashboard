const getTasks = () => {
  const planners = JSON.parse(localStorage.getItem("todoTasks")) || [];

  return planners;
};

const getPlanners = () => {
  const planners = JSON.parse(localStorage.getItem("planner")) || [];

  return planners;
};

const getGoals = () => {
  const goals = JSON.parse(localStorage.getItem("goals")) || [];
  return goals;
};
// Theme and background
const body = document.querySelector("body")
let hour = new Date().getHours();
console.log(hour)

if(hour >=4 && hour < 10){
  body.style.backgroundColor = `url("./assets/morning.jpg")`
}else if(hour >= 10 && hour <16){
  body.style.backgroundImage = `url("./assets/noon.jpg")`
}else if(hour >= 16 && hour <= 20){
  body.style.backgroundImage = `url("./assets/night.jpg")`
}else{
  body.style.backgroundImage = `url("./assets/morning.jpg")`
}


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
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  console.log("Requesting location...");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      getWeatherByLocation(latitude, longitude);
    },

    (error) => {
      console.error("Location error:", error);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("Location permission was denied. Please allow location access.");
          break;

        case error.POSITION_UNAVAILABLE:
          alert("Your location is currently unavailable.");
          break;

        case error.TIMEOUT:
          alert("Location request timed out. Please try again.");
          break;

        default:
          alert("An unknown location error occurred.");
      }
    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    }
  );
};


const getWeatherByLocation = async (lat, lon) => {
  if (lat == null || lon == null) {
    alert("Unable to get coordinates.");
    return;
  }

  try {
    const URL =
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=61fa14bb69cb911e7c78cfd3d2a4a6d0&units=metric`;

    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(
        `Weather request failed: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Weather data:", data);

    displayWeatherData(data);

  } catch (error) {
    console.error("Weather error:", error);
    alert("Unable to fetch weather data.");
  }
};


const displayWeatherData = (data) => {
  document.querySelector(".locationName").textContent =
    data.name || "Unknown location";

  document.querySelector(".temprature").textContent =
    `${Math.round(data.main.temp)}°C`;

  document.querySelector(".description").textContent =
    data.weather?.[0]?.description || "No description";

  document.querySelector(".humidity").textContent =
    `${data.main.humidity}%`;

  document.querySelector(".wind").textContent =
    `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

  document.querySelector(".feelsLike").textContent =
    `${Math.round(data.main.feels_like)}°C`;

  document.querySelector(".percipitation").textContent =
    `${data.rain?.["1h"] ?? 0} mm`;

  document.querySelector(".visibility").textContent =
    `${((data.visibility ?? 0) / 1000).toFixed(1)} km`;
};


getLocation();

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
  const plannerEmpty = document.querySelector(".planner-empty");

  const planners = getPlanners();
  const plannerCount = document.querySelector(".total-hours");
  plannerCount.innerHTML = planners.length;
  if (planners.length === 0) {
    plannerEmpty.classList.add("show");
  } else {
    plannerEmpty.classList.remove("show");
  }

  const oldPlannerItems = plannersDiv.querySelectorAll(".planner-item");

  oldPlannerItems.forEach((item) => {
    item.remove();
  });

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

// quotes page opening closing
const quotesPage = document.querySelector(".quotes-page");
const quotesIcon = document.querySelector(".quotes-icon");
const closeQuotes = document.querySelector(".close-quotes");

quotesIcon.addEventListener("click", () => {
  quotesPage.classList.add("active");
  document.body.style.overflow = "hidden";
});

closeQuotes.addEventListener("click", () => {
  quotesPage.classList.remove("active");
  document.body.style.overflow = "";
});

// displayQuotes
const quoteText = document.querySelector(".quote-text");
const authorName = document.querySelector(".author-name");
const newQuoteBtn = document.querySelector(".new-quote-btn");

const getQuote = async () => {
  try {
    newQuoteBtn.disabled = true;
    newQuoteBtn.innerHTML = `
            <i class="ri-loader-4-line"></i> Loading... `;

    const response = await fetch("https://dummyjson.com/quotes/random");

    if (!response.ok) {
      throw new Error("Could not fetch quote");
    }

    const data = await response.json();
    quoteText.textContent = `"${data.quote}"`;
    authorName.textContent = data.author;
  } catch (error) {
    console.error(error);
    quoteText.textContent = "Unable to load a quote. Please try again.";
    authorName.textContent = "FocusFlow";
  } finally {
    newQuoteBtn.disabled = false;
    newQuoteBtn.innerHTML = `
            <i class="ri-refresh-line"></i> New Quote`;
  }
};
newQuoteBtn.addEventListener("click", getQuote);

// copy quote

const copyQuoteBtn = document.querySelector(".copy-quote-btn");

copyQuoteBtn.addEventListener("click", async () => {
  const textToCopy = `${quoteText.textContent}
— ${authorName.textContent}`;

  try {
    await navigator.clipboard.writeText(textToCopy);
    copyQuoteBtn.innerHTML = `
            <i class="ri-check-line"></i>
            <span>Copied</span>
        `;

    setTimeout(() => {
      copyQuoteBtn.innerHTML = `
                <i class="ri-file-copy-line"></i>
                <span>Copy</span>
            `;
    }, 2000);
  } catch (error) {
    console.error("Could not copy quote:", error);
  }
});

// Timer opening closing

const pomodoroPage = document.querySelector(".pomodoro-page");
const openPomodoro = document.querySelector(".open-pomodoro");
const closePomodoro = document.querySelector(".close-pomodoro");

openPomodoro.addEventListener("click", () => {
  pomodoroPage.classList.add("active");
  document.body.style.overflow = "hidden";
});

closePomodoro.addEventListener("click", () => {
  pomodoroPage.classList.remove("active");
  document.body.style.overflow = "";
});

// timer working

const timerTime = document.querySelector(".timer-time");
const timerLabel = document.querySelector(".timer-label");
const timerMessage = document.querySelector(".timer-message");
const timerProgress = document.querySelector(".timer-progress");
const startPauseBtn = document.querySelector(".start-pause-btn");
const resetTimerBtn = document.querySelector(".reset-timer-btn");
const timerModeButtons = document.querySelectorAll(".timer-mode");
const statusText = document.querySelector(".status-text");
const statusDot = document.querySelector(".status-dot");
const sessionCount = document.querySelector(".session-count");
const currentModeTitle = document.querySelector(".current-mode-card h2");
const currentModeDescription = document.querySelector(
  ".current-mode-card > span",
);
const currentModeIcon = document.querySelector(".mode-card-icon i");

const timerModes = {
  focus: {
    duration: 25 * 60,
    title: "Focus Time",
    label: "Focus Session",
    description: "Stay focused and avoid distractions.",
    icon: "ri-focus-3-line",
  },
  short: {
    duration: 5 * 60,
    title: "Short Break",
    label: "Short Break",
    description: "Take a moment to relax and recharge.",
    icon: "ri-cup-line",
  },
  long: {
    duration: 15 * 60,
    title: "Long Break",
    label: "Long Break",
    description: "Rest, refresh, and prepare for more focus.",
    icon: "ri-leaf-line",
  },
};

let currentMode = "focus";
let timeLeft = timerModes.focus.duration;
let timerInterval = null;
let timerState = "idle";
let completedSessions = 0;
const circleRadius = 112;
const circleCircumference = 2 * Math.PI * circleRadius;

timerProgress.style.strokeDasharray = circleCircumference;
timerProgress.style.strokeDashoffset = 0;

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `
        ${formattedMinutes}:
        ${formattedSeconds}
    `.replace(/\s/g, "");
};

const updateTimerDisplay = () => {
  timerTime.textContent = formatTime(timeLeft);
};

const updateTimerProgress = () => {
  const totalDuration = timerModes[currentMode].duration;
  const percentage = timeLeft / totalDuration;
  const offset = circleCircumference * (1 - percentage);
  timerProgress.style.strokeDashoffset = offset;
};

const updateMainButton = () => {
  if (timerState === "running") {
    startPauseBtn.innerHTML = `
            <i class="ri-pause-fill"></i>
            <span>Pause</span>
        `;
  } else if (timerState === "paused") {
    startPauseBtn.innerHTML = `
            <i class="ri-play-fill"></i>
            <span>Resume</span>
        `;
  } else {
    startPauseBtn.innerHTML = `
            <i class="ri-play-fill"></i>
            <span> Start</span>
        `;
  }
};

const updateStatus = () => {
  if (timerState === "running") {
    statusText.textContent = "Running";
    statusDot.style.background = "#22c55e";
  } else if (timerState === "paused") {
    statusText.textContent = "Paused";
    statusDot.style.background = "#f59e0b";
  } else if (timerState === "completed") {
    statusText.textContent = "Completed";
    statusDot.style.background = "#22c55e";
  } else {
    statusText.textContent = "Ready";
    statusDot.style.background = "var(--muted)";
  }
};

const updateTimerMessage = () => {
  if (timerState === "running") {
    timerMessage.textContent = "Stay focused. You are doing great!";
  } else if (timerState === "paused") {
    timerMessage.textContent = "Your session is paused.";
  } else if (timerState === "completed") {
    timerMessage.textContent = "Great work! Your session is complete.";
  } else {
    timerMessage.textContent = "Choose a mode and start your session.";
  }
};

const updateUI = () => {
  updateTimerDisplay();
  updateTimerProgress();
  updateMainButton();
  updateStatus();
  updateTimerMessage();
};

const startTimer = () => {
  if (timerState === "running") {
    return;
  }
  timerState = "running";
  updateUI();
  timerInterval = setInterval(runTimer, 1000);
};

const runTimer = () => {
  if (timeLeft > 0) {
    timeLeft--;
    updateTimerDisplay();
    updateTimerProgress();
  }
  if (timeLeft === 0) {
    completeTimer();
  }
};

const pauseTimer = () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timerState = "paused";
  updateUI();
};

startPauseBtn.addEventListener("click", () => {
  if (timerState === "running") {
    pauseTimer();
  } else {
    startTimer();
  }
});

const resetTimer = () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = timerModes[currentMode].duration;
  timerState = "idle";
  updateUI();
};

resetTimerBtn.addEventListener("click", resetTimer);

timerModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    currentMode = button.dataset.mode;
    timeLeft = timerModes[currentMode].duration;
    timerState = "idle";

    timerModeButtons.forEach((modeButton) => {
      modeButton.classList.remove("active");
    });

    button.classList.add("active");
    updateCurrentModeCard();
    updateUI();
  });
});

const updateCurrentModeCard = () => {
  const selectedMode = timerModes[currentMode];
  currentModeTitle.textContent = selectedMode.title;
  currentModeDescription.textContent = selectedMode.description;
  currentModeIcon.className = selectedMode.icon;
};

const completeTimer = () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timerState = "completed";

  if (currentMode === "focus") {
    completedSessions++;
    sessionCount.textContent = completedSessions;
  }
  updateUI();
};

// daily goals opening closing

const openGoalsButton = document.querySelector(".open-goals");
const closeGoalsButton = document.querySelector(".close-goals");
const dailyGoalsPage = document.querySelector(".daily-goals-page");

openGoalsButton.addEventListener("click", () => {
  dailyGoalsPage.classList.add("active");
  document.body.style.overflow = "hidden";
});

const closeGoals = () => {
  dailyGoalsPage.classList.remove("active");
  document.body.style.overflow = "";
};

closeGoalsButton.addEventListener("click", closeGoals);

// goals working

const goalForm = document.querySelector("#goalForm");

goalForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const goal = goalForm.goal.value.trim();
  const goals = getGoals();

  if (!goal) {
    alert("Field is mandatory.");
  }

  const newGoal = {
    id: Date.now(),
    goal,
    completed: false,
  };

  goals.push(newGoal);

  localStorage.setItem("goals", JSON.stringify(goals));

  displayGoals();

  goalForm.reset();
});

let currentFilter = "all";

const displayGoals = (goals = getGoals()) => {
  const goalsDiv = document.querySelector(".goals-list");
  goalsDiv.innerHTML = "";

  const goalCount = document.querySelector(".total-goals-header");
  const goalsEmpty = document.querySelector(".goals-empty");

  goalCount.innerHTML = goals.length;

  const filteredGoals = goals.filter((goal) => {
    if (currentFilter === "active") {
      return !goal.completed;
    }

    if (currentFilter === "completed") {
      return goal.completed;
    }
    return true;
  });

  if (filteredGoals.length === 0) {
    goalsEmpty.classList.add("show");
  } else {
    goalsEmpty.classList.remove("show");
  }

  filteredGoals.forEach((goal) => {
    let div = document.createElement("div");
    div.classList.add("goal-item");

    if (goal.completed) {
      div.classList.add("completed");
    }

    div.innerHTML = `
                <button type="button" class="goal-check" aria-label="Complete goal">
                    <i class=" ri-check-line"></i>
                </button>
                <p class="goal-text">
                    ${goal.goal}
                </p>
                <button
                    type="button"
                    class="goal-delete"
                    aria-label="Delete goal">
                    <i class="ri-delete-bin-line"></i>
                </button>
            `;

    div.querySelector(".goal-delete").addEventListener("click", () => {
      deleteGoal(goal.id);
    });

    div.querySelector(".goal-check").addEventListener("click", () => {
      toggleGoal(goal.id);
    });

    goalsDiv.append(div);
  });

  updateGoalProgress();
};

// filter goals
const goalFilters = document.querySelectorAll(".goal-filter");
goalFilters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    currentFilter = filterButton.dataset.filter;

    goalFilters.forEach((button) => {
      button.classList.remove("active");
    });

    filterButton.classList.add("active");

    displayGoals();
  });
});

// delete Goals

const deleteGoal = (goalId) => {
  let goals = getGoals();
  const remainingGoals = goals.filter((g) => g.id !== goalId);
  localStorage.setItem("goals", JSON.stringify(remainingGoals));

  displayGoals();
  updateGoalProgress();
};

// complete Goals

const toggleGoal = (goalId) => {
  const goals = getGoals();

  const updatedGoals = goals.map((goal) => {
    if (goal.id === goalId) {
      return {
        ...goal,

        completed: !goal.completed,
      };
    }

    return goal;
  });

  localStorage.setItem("goals", JSON.stringify(updatedGoals));

  displayGoals();
  updateGoalProgress();
};

const updateGoalProgress = () => {
  const totalGoals = getGoals();
  const completedGoals = totalGoals.filter((goals) => {
    return goals.completed;
  });

  let percentage = 0;
  percentage = Math.floor((completedGoals.length / totalGoals.length) * 100);

  const cGoals = document.querySelector(".completed-goals");
  cGoals.textContent = completedGoals.length;
  const tGoals = document.querySelector(".total-goals");
  tGoals.textContent = totalGoals.length;
  const pPercentage = document.querySelector(".progress-percentage");

  if (totalGoals.length === 0) {
    pPercentage.textContent = "0%";
  } else {
    pPercentage.textContent = `${percentage}%`;
  }

  const progress = document.querySelector(".goals-progress-fill");

  progress.style.width = `${percentage}%`;

  const progressMessage = document.querySelector(".progress-message");

  if (totalGoals.length === 0) {
    progressMessage.textContent = "Add your first goal for today!";
  } else if (completedGoals.length === totalGoals.length) {
    progressMessage.textContent = "Amazing! You completed all your goals 🎉";
  } else {
    const remaining = totalGoals.length - completedGoals.length;

    progressMessage.textContent = `${remaining} goal${
      remaining === 1 ? "" : "s"
    } remaining`;
  }
};

const updateGoalsDate = () => {
  const goalsDate = document.querySelector(".goals-date");
  const today = new Date();

  goalsDate.textContent = today.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

// initial Renders
displayTasks();
displayPlanners();
getQuote();
updateCurrentModeCard();
updateUI();
displayGoals();
updateGoalProgress();
