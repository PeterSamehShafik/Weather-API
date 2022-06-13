"use strict"; //strict mode

//declaring constants
const today =0,
      tomorrow =1,
      afterTomorrow =2,
      week=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      month= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

//declaring variables
let locationName,
    tempC ,
    maxTempC=[],
    minTempC=[],
    condition=[],
    conditionIcon=[],
    todayDate= new Date(),
    itemCard = document.querySelectorAll(".itemCard"); //the 3 cards

async function getData(location="cairo") {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=419e78a360984eae8ae163942220606&q=${location}&days=7`)
    let data = await response.json();
    locationName =  await data.location.name;
    tempC= await data.current.temp_c;
    condition[today]= await data.current.condition.text;
    conditionIcon[today]= await data.current.condition.icon;
    for(let i=tomorrow; i<=afterTomorrow; i++){
        maxTempC[i]= await data.forecast.forecastday[i].day.maxtemp_c
        minTempC[i]= await data.forecast.forecastday[i].day.mintemp_c
        condition[i]= await data.forecast.forecastday[i].day.condition.text
        conditionIcon[i]= await data.forecast.forecastday[i].day.condition.icon;
    }
}

async function displayData(){
    if(locationName != undefined){
        itemCard[today].innerHTML= `
        <div class="card text-white bg-card-light mb-3 rounded-3">
            <div class="card-header d-flex justify-content-between align-items-center px-2 bg-main-light rounded-top-3">
            <p class="m-0" >${week[todayDate.getDay()]}</p>
            <p class="m-0"${todayDate.getDate()} ${month[todayDate.getMonth()]}</p>
            </div>
            <div class="card-body py-4">
            <p class="card-text lead text-white-50">${locationName}</p>
            <div class="card-title d-flex justify-content-between mb-4">
                <h5 class="display-1 fw-bold" >${tempC}<sup>o</sup>C</h5>
                <img src="https:${conditionIcon[today]}" alt="condition" class="w-25">
            </div>
            <span class="text-main">${condition[today]}</span>
            <div class="card-bottom d-flex mt-5">
                <div class="rain me-2">
                <i class="fa-solid fa-umbrella"></i>
                <span>20%</span>
                </div>
                <div class="wind mx-2">
                <i class="fa-solid fa-wind"></i>
                <span>18 km/h</span>
                </div>
                <div class="compass mx-2">
                <i class="fa-regular fa-compass"></i>
                <span>east</span>
                </div>
            </div>
            </div>
         </div>
        `;
    
    itemCard[tomorrow].innerHTML=`
        <div class="card text-white bg-card-dark mb-3 rounded-3">
            <div class="card-header px-2 bg-main-dark rounded-top-3 text-center">
                <p class="m-0">${week[todayDate.getDay()+tomorrow]}</p>
            </div>
            <div class="card-body py-4 text-center">
                <img src="https:${conditionIcon[tomorrow]}" alt="conddition" class="img-fluid my-4">
                <div class="card-title mb-5">
                <h5 class="fa-2x fw-bold">${maxTempC[tomorrow]}<sup>o</sup>C</h5>
                <p>${minTempC[tomorrow]}<sup>o</sup>C</p>
                </div>
                <span class="text-main">${condition[tomorrow]}</span>
            </div>
        </div>
    `;

    itemCard[afterTomorrow].innerHTML=`
    <div class="card text-white bg-card-light mb-3 rounded-3">
        <div class="card-header px-2 bg-main-light rounded-top-3 text-center">
            <p class="m-0">${week[todayDate.getDay()+afterTomorrow]}</p>
        </div>
        <div class="card-body py-4 text-center">
            <img src="https:${conditionIcon[afterTomorrow]}" alt="conddition" class="img-fluid my-4">
            <div class="card-title mb-5">
            <h5 class="fa-2x fw-bold">${maxTempC[afterTomorrow]}<sup>o</sup>C</h5>
            <p>${minTempC[afterTomorrow]}<sup>o</sup>C</p>
            </div>
            <span class="text-main mt-3">${condition[afterTomorrow]}</span>
        </div>
    </div>
    `;
    }
}

async function searchLocation(searchItem){
    if(searchItem.length>1){
        let searchResponse = await fetch(`https://api.weatherapi.com/v1/search.json?key=419e78a360984eae8ae163942220606&q=${searchItem}`)
        let searchArray = await searchResponse.json();
        for(let i=0; i<searchArray.length;i++){
            if(searchArray[i].name.toLowerCase().includes(searchItem.toLowerCase())){
                await getData(searchArray[i].name);
                displayData();
                break;  
            }else{
                await getData(searchArray[0].country);
                displayData();
            }
        }
    }
    else{
        await getData();
        displayData();
    }
}

//intiate date
(async function(){
    await getData();
    displayData();
})();