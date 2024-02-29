//================== Get Prayer Today ==================

let select_country = document.querySelector("#country");
let date_today = document.querySelector("#date-today");
let fajr_time = document.querySelector("#fajr");
let sunrise_time = document.querySelector("#sunrise");
let dhuhr_time = document.querySelector("#dhuhr");
let asr_time = document.querySelector("#asr");
let maghrib_time = document.querySelector("#maghrib");
let isha_time = document.querySelector("#isha");

// Date today
let date = new Date();
let year = date.getFullYear();
let mounth = date.getMonth() + 1;
let day = date.getDate();

// Post date today in page(#date-today)
window.onload = function () {
  date_today.innerHTML = `${day}/${mounth}/${year}`;
};

// Get prayer times today
function getPrayerTimesToday(country, year, mounth) {
  let url = `https://api.aladhan.com/v1/calendarByAddress/${year}/${mounth}?address=${country}&method=2`;
  axios
    .get(url)
    .then((response) => {
      // Variables timings
      Fajr = response.data.data[day - 1].timings.Fajr;
      Sunrise = response.data.data[day - 1].timings.Sunrise;
      Dhuhr = response.data.data[day - 1].timings.Dhuhr;
      Asr = response.data.data[day - 1].timings.Asr;
      Maghrib = response.data.data[day - 1].timings.Maghrib;
      Isha = response.data.data[day - 1].timings.Isha;

      // Put timings in page
      fajr_time.innerHTML = Fajr.substr(0, 5);
      sunrise_time.innerHTML = Sunrise.substr(0, 5);
      dhuhr_time.innerHTML = Dhuhr.substr(0, 5);
      asr_time.innerHTML = Asr.substr(0, 5);
      maghrib_time.innerHTML = Maghrib.substr(0, 5);
      isha_time.innerHTML = Isha.substr(0, 5);
    })
    .catch((error) => {
      console.log(error);
    });
}

// If Click select input save country in localStorage
function selectCountryOnChange() {
  // Get Prayer Times Today
  getPrayerTimesToday(select_country.value, year, mounth);

  // Get Prayer Times For Month
  getPrayerTimesMonth(select_country.value, year, mounth);

  // Save country in localStorage
  localStorage.setItem("country", select_country.value);
}

// Get Prayer times's user country
GetPrayerTimesOfUserCountry();
function GetPrayerTimesOfUserCountry() {
  let saveCountry = localStorage.getItem("country");
  if (saveCountry != null) {
    getPrayerTimesToday(saveCountry, year, mounth);
    select_country.value = saveCountry;
  } else {
    getPrayerTimesToday("المغرب", year, mounth);
    select_country.value = "المغرب";
  }
}

//======================================================

//================== Get Prayer Month ==================

let input_date = document.querySelector("#input-date");

// If click input_date save year and month in localStorage
function OnChangeDateInput() {
  // Get year and month
  let year = input_date.value.split("-")[0];
  let month = input_date.value.split("-")[1];

  // Save year and month in localStorage
  localStorage.setItem("year", year);
  localStorage.setItem("month", month);

  getPrayerTimesMonth(select_country.value, year, month);
}

// Get year and month in localStorage
GetYearAndMonth();
function GetYearAndMonth() {
  // Get year and month in localStorage
  let saveYear = localStorage.getItem("year");
  let saveMonth = localStorage.getItem("month");

  // If year and month is exist in localStorage
  if (saveYear != null && saveMonth != null) {
    // Get year and month and saved in varaibles
    let year = localStorage.getItem("year");
    let monthLocal = localStorage.getItem("month");
    let month = ("0" + monthLocal).slice(-2);

    // Put year and month in input date
    input_date.value = `${year}-${month}`;

    getPrayerTimesMonth(select_country.value, year, month);
  }
  // If year and month is not exist in localStorage
  else {
    // Get month today
    const month2 = ("0" + (date.getMonth() + 1)).slice(-2);

    // Put year today and month today in input date
    input_date.value = `${year}-${month2}`;

    // Save year today and month today in localStorage
    localStorage.setItem("year", year);
    localStorage.setItem("month", month2);

    getPrayerTimesMonth(select_country.value, year, month2);

    console.log("Not Exist Year And Month");
  }
}

// Get Prayer times for month
function getPrayerTimesMonth(country, year, month) {
  // Get tbody in table
  let tbody = document.querySelector(".table tbody");
  // Make it empty
  tbody.innerHTML = "";

  let url = `https://api.aladhan.com/v1/calendarByAddress/${year}/${month}?address=${country}&method=2`;
  axios
    .get(url)
    .then((response) => {
      // Get data in response
      responseArray = response.data.data;

      // Put title month in thead
      let title_month = document.querySelector("#title-month");
      title_month.innerHTML = responseArray[0].date.gregorian.month.en;

      for (responseNow of responseArray) {
        // Craete element tr
        let tr = document.createElement("tr");

        // Content row
        let content = `
          <tr>
            <th scope="row">${responseNow.date.hijri.weekday.ar}</th>
            <td>${responseNow.date.gregorian.day}</td>
            <td>${responseNow.timings.Fajr.substr(0, 5)}<span>AM</span></td>
            <td>${responseNow.timings.Sunrise.substr(0, 5)}<span>AM</span></td>
            <td>${responseNow.timings.Dhuhr.substr(0, 5)}<span>PM</span></td>
            <td>${responseNow.timings.Asr.substr(0, 5)}<span>PM</span></td>
            <td>${responseNow.timings.Maghrib.substr(0, 5)}<span>PM</span></td>
            <td>${responseNow.timings.Isha.substr(0, 5)}<span>PM</span></td>
          </tr>
        `;
        tr.innerHTML = content;

        // Append tr in tbody
        tbody.append(tr);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//======================================================
