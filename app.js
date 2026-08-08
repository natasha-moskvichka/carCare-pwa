import {loadGarage, saveGarage, setCurrentCarIndex, garage, currentCarIndex, Car, ServiceRecord} from "./state.js";
import {renderCards, renderTabs} from "./ui.js";
import './theme.js';

const currentMileageInput = document.getElementById('currentMileage');
const oilChangeCostInput = document.getElementById('oilChangeCost');
const saveBtn = document.getElementById('saveBtn');
const status = document.getElementById('status');

const addBtn = document.getElementById('addCarBtn');
const addCarModal = document.getElementById('addCarModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const closeErrorModalBtn = document.getElementById('closeErrorModalBtn');
const confirmAddCarBtn = document.getElementById('confirmAddCarBtn');
const newCarNameInput = document.getElementById('newCarName');
const newCarMileageInput = document.getElementById('newCarMileage');
const modalCarWarning = document.getElementById('modalCarWarning');
const deleteCarBtn = document.getElementById('deleteCarBtn');
const serviceModal = document.getElementById('serviceModal');
const openServiceModalBtn = document.getElementById('openServiceModalBtn');
const oilChangeDateInput = document.getElementById('oilChangeDate');
const cardCarMileageInput = document.getElementById('cardCarMileageInput');
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const trueDeleteBtn = document.getElementById('trueDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const errorMinMileageModal = document.getElementById('errorMinMileageModal');
const printReportBtn = document.getElementById('printReportBtn');
const navBtn = document.querySelectorAll('.button-nav__item');
const appPage = document.querySelectorAll('.app-page');
const inputsToValidate = [newCarMileageInput, cardCarMileageInput, currentMileageInput];

navBtn.forEach(btn => {
  btn.addEventListener('click', (evt) => {
    const target = evt.target;

    if(target.closest("button")) {
      navBtn.forEach(btn => {btn.classList.remove('button-nav__item--active')})
      btn.classList.add('button-nav__item--active');

      const pageId = btn.dataset.page;
      appPage.forEach(page => {
        page.classList.remove('app-page--active');
        if (page.id === pageId) {
          page.classList.add('app-page--active');
        }
      })
    }
  })

})

printReportBtn.addEventListener('click', () => {
  window.print();
})

inputsToValidate.forEach(input => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^0-9]/g, '').replace(/^0+/, '');
  })
})

cardCarMileageInput.addEventListener('blur', () => {
  const updatedMileage = Number(cardCarMileageInput.value);

  const currentCar = garage[currentCarIndex];
  const lastRecord = currentCar.history[currentCar.history.length - 1];

  const minMileage = lastRecord ? lastRecord.mileage : 0;

  if (updatedMileage < minMileage) {

    errorMinMileageModal.classList.add('modal--open');
    cardCarMileageInput.value = currentCar.currentMileage;
  } else {
    currentCar.currentMileage = updatedMileage;
    saveGarage();
    renderCards();
  }
});

openServiceModalBtn.addEventListener('click', () => {
  serviceModal.classList.add('modal--open');
})

confirmAddCarBtn.addEventListener('click', () => {
  const newCarNameInputValue = newCarNameInput.value;
  const newCarMileageInputValue = newCarMileageInput.value;

  if (newCarNameInputValue === '' || newCarMileageInputValue === '') {
    modalCarWarning.innerText = 'Ошибка! Заполните все поля';
    modalCarWarning.style.color = '#ff4d4d';
    return;
  }

  const newCar = new Car(newCarNameInputValue, newCarMileageInputValue);
  garage.push(newCar);
  saveGarage();
  setCurrentCarIndex(garage.length - 1);
  //currentCarIndex = garage.length - 1;

  newCarNameInput.value = '';
  newCarMileageInput.value = '';
  addCarModal.classList.remove('modal--open');
  renderCards();
  renderTabs();
})

closeModalBtn.addEventListener('click', () => {
  addCarModal.classList.remove('modal--open');
});

closeErrorModalBtn.addEventListener('click', () => {
  errorMinMileageModal.classList.remove('modal--open');
})

deleteCarBtn.addEventListener('click', () => {
  deleteConfirmModal.classList.add('modal--open');
});

cancelDeleteBtn.addEventListener('click', () => {
  deleteConfirmModal.classList.remove('modal--open');
});

trueDeleteBtn.addEventListener('click', () => {
  garage.splice(currentCarIndex, 1);
  saveGarage();

  if (garage.length === 0) {
    setCurrentCarIndex(null);
  } else {
    setCurrentCarIndex(0);
  }

  deleteConfirmModal.classList.remove('modal--open');

  renderCards();
  renderTabs();
})

addBtn.addEventListener('click', () => {
  addCarModal.classList.add('modal--open');
})

saveBtn.addEventListener('click', () => {
  const currentMileage = Number(currentMileageInput.value);
  const oilChangeCost = Number(oilChangeCostInput.value);
  const oilChangeDate = oilChangeDateInput.value;
  const serviceType = document.getElementById('serviceTypeInput');

  if (currentMileage === 0 || oilChangeCost === 0 || oilChangeDate === '') {
    status.innerText = 'Ошибка! Заполните все поля';
    status.style.color = '#ff4d4d';
    return;
  }

  const newRecord = new ServiceRecord(serviceType.value, oilChangeCost, 'shell', currentMileage, oilChangeDate);
  garage[currentCarIndex].addRecord(newRecord);
  garage[currentCarIndex].currentMileage = currentMileage;
  saveGarage();

  status.innerText = 'Данные успешно сохранены!';
  status.style.color = '#4caf50';

  currentMileageInput.value = '';
  oilChangeCostInput.value = '';
  oilChangeDateInput.value = '';
  serviceType.value = '';

  serviceModal.classList.remove('modal--open');

  renderCards();
});

serviceModal.addEventListener('click', (evt) => {
  if (evt.target === serviceModal) {
    serviceModal.classList.remove('modal--open');
  }
})

loadGarage();
renderCards();
renderTabs();
