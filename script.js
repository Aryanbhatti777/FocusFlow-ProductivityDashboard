const theme = document.querySelector(".theme")

theme.addEventListener("click", () => {
    
    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark")

    if(dark){
        theme.innerHTML = `<i class="ri-sun-line themeIcon"></i>`
    }else{
        theme.innerHTML = `<i class="ri-moon-line themeIcon"></i>`
    }
})

const dateFormatter = new Intl.DateTimeFormat("en-US",{
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
})

const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
})

const dateElement = document.querySelector(".date");
const timeElement = document.querySelector(".time h1");

const updateTime = () => {
    const now = new Date();

    dateElement.textContent = dateFormatter.format(now);
    timeElement.textContent = timeFormatter.format(now);
};
updateTime();
setInterval(updateTime, 1000)

