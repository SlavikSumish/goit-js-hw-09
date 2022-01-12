import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  btnStartTimer: document.querySelector('button[data-start]'),  
  timerContent: document.querySelector('.timer'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]')
}

refs.btnStartTimer.setAttribute("disabled", "disabled");

refs.btnStartTimer.addEventListener('click', onBtnStartTimer);

let timeCalendar = 0;
let intervalId = null;
let isActive = false;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    timeCalendar = selectedDates[0];
      if (selectedDates[0] < Date.now()) {
      Notiflix.Notify.failure('Please choose a date in the future');
      refs.btnStartTimer.setAttribute("disabled", "disabled");
      return;
    }
    refs.btnStartTimer.removeAttribute("disabled", "disabled");    
  },
};

flatpickr("#datetime-picker", options);

function onBtnStartTimer() {
  if (isActive) {
    return;    
  }
  isActive = true;
  intervalId = setInterval(() => {
    const timeSelect = timeCalendar;
    const currentDataTime = Date.now();
    const deltaTime = timeSelect - currentDataTime;
    const convertTime = convertMs(deltaTime);
    updateClock(convertTime);
    if (Math.round(deltaTime/1000) === 0) {
      clearInterval(intervalId);
      Notiflix.Report.info('', 'Time is Over', 'Ok');
      return;
     }     
   }, 1000)
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2,'0');
}

function updateClock({ days, hours, minutes, seconds }) {
  refs.days.textContent = days;
  refs.hours.textContent = hours;
  refs.minutes.textContent = minutes;
  refs.seconds.textContent = seconds;
}

