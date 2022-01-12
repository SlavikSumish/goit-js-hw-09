
import Notiflix from 'notiflix';

const refs = {
  formEl: document.querySelector('form'),
  formButtonSubmit: document.querySelector('button')
}

refs.formEl.addEventListener('submit', onFormSubmit);

let position = 0;

function onFormSubmit(e) {
  e.preventDefault();
  let delay = e.currentTarget.elements.delay.value;
  let step = e.currentTarget.elements.step.value;
  const amount = e.currentTarget.elements.amount.value;
  if (amount <= 0) {
    return;
  }
  let delayTimeout = Number(delay); 
  for (let i = 0; i < amount; i++){
  const idTimeout =  setTimeout(() => {
    position += 1;
       createPromise(position, delay)
      .then(({ position, delay }) => {
        Notiflix.Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
        // console.log('promise ok');
      })
      .catch(({ position, delay }) => {
        Notiflix.Notify.warning(`❌ Rejected promise ${position} in ${delay}ms`);
        // console.log('promise wrong');
      });
      delay = Number(delay) + Number(step);
      clearTimeout(idTimeout);
    }, delayTimeout)
    delayTimeout = Number(delayTimeout) + Number(step);
    
  }
  position = 0;
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    if (shouldResolve) {
      resolve({ position, delay });
    } else {
      reject({ position, delay });
    }
  });
}
