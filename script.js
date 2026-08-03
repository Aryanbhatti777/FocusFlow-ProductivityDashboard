// Theme

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

//Date and Time

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

//Fething location and weather based on user location

const getLocation = () => {

    if(!navigator.geolocation){
        alert("Geolocation is not supported by your browser!")
        return
    }

    console.log("Requesting for location...")

    navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords
        console.log(`Location Found: lat- ${latitude} long-${longitude}`)

        getWeatherByLocation(latitude, longitude)
    })
}

getLocation()

const getWeatherByLocation = async (lat, long) => {
    if(!lat || !long){
        alert("Unable to get coordinates")
    }

    try {
        
        const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=fbe8226654b37662db331caad38f0810&units=metric`;

        const response = await fetch(URL)

         if (!response.ok) throw new Error('Weather data not found');

         const data = await response.json();
         console.log(data)
         displayWeatherData(data)

    } catch (error) {
        alert("Some error occured fetching location !")
        console.log(error.message)
    }
}

const displayWeatherData = (data) => {

    document.querySelector(".locationName").innerHTML =data.name

    document.querySelector(".temprature").innerHTML = `${data.main.temp}°C`

    document.querySelector(".description").innerHTML = data.weather[0].description

    document.querySelector(".humidity").innerHTML = `${data.main.humidity}%`

    document.querySelector(".wind").innerHTML = `${(data.wind.speed*3.6).toFixed(2)
    } km/h`

    document.querySelector(".feelsLike").innerHTML = `${data.main.feels_like}°C`

    document.querySelector(".percipitation").innerHTML = `${data.rain ? data.rain['1h'] : 0} mm`

    document.querySelector(".visibility").innerHTML = `${data.visibility / 1000} kms`
}

