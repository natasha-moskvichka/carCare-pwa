let currentCarIndex = null;

class ServiceRecord {
  constructor(type, cost, brand, mileage) {
    this.type = type;
    this.cost = cost;
    this.brand = brand;
    this.mileage = mileage;
  }
}

class Car {
  constructor(name, currentMileage) {
    this.name = name;
    this.currentMileage = currentMileage;
    this.history = [];
  }

 addRecord(record) {
    this.history.push(record);
 }
}

let garage = [];

const currentMileageInput = document.getElementById('currentMileage');
const oilChangeCostInput = document.getElementById('oilChangeCost');
const saveBtn = document.getElementById('saveBtn');
const status = document.getElementById('status');
const tabsContainer = document.getElementById('tabsContainer');
const cardCarMileage = document.getElementById('cardCarMileage');
const cardLastOilChange = document.getElementById('cardLastOilChange');
const cardCarName = document.getElementById('cardCarName');
const addBtn = document.getElementById('addCarBtn');
const addCarModal = document.getElementById('addCarModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const confirmAddCarBtn = document.getElementById('confirmAddCarBtn');
const newCarNameInput = document.getElementById('newCarName');
const newCarMileageInput = document.getElementById('newCarMileage');
const modalCarWarning = document.getElementById('modalCarWarning');
const deleteCarBtn = document.getElementById('deleteCarBtn');
const formCard = document.getElementById('formCard');
const carCard = document.getElementById('carCard');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const serviceModal = document.getElementById('serviceModal');
const openServiceModalBtn = document.getElementById('openServiceModalBtn');

function loadGarage () {
  const rawDate = localStorage.getItem('autoGarage');

  if (!rawDate) return;

  const parseGarage = JSON.parse(rawDate);

  parseGarage.forEach(rowCar => {
    const restoredCar = new Car(rowCar.name, rowCar.currentMileage);
    rowCar.history.forEach(rowRecord => {
      const restoredRecord = new ServiceRecord(rowRecord.type, rowRecord.cost, rowRecord.brand, rowRecord.mileage)

    restoredCar.addRecord(restoredRecord);
    });

    garage.push(restoredCar);
  })

  if (garage.length > 0) {
    currentCarIndex = 0;
  }
}

function saveGarage () {
  localStorage.setItem('autoGarage', JSON.stringify(garage));
}

function renderCards () {
  if (garage.length === 0) {
    deleteCarBtn.style.display = 'none';
    cardCarName.innerText = "Пожалуйста, добавьте ваш первый автомобиль";
    cardCarMileage.innerText = '';
    cardLastOilChange.innerText = '';
    carCard.style.display = 'none';
    return;
  }

  const currentCar = garage[currentCarIndex];
  cardCarName.innerText = currentCar.name;
  cardCarMileage.innerText = currentCar.currentMileage + ' км';
  deleteCarBtn.style.display = 'block';
  carCard.style.display = 'flex';

  const historyLength = currentCar.history.length;

  if (historyLength === 0) {
    cardLastOilChange.innerText = 'Нет данных';
  } else {
    const  lastRecord = currentCar.history[historyLength - 1];
    cardLastOilChange.innerText = `${lastRecord.mileage} км`;
  }
}

function renderTabs () {
  tabsContainer.innerText = '';
  garage.forEach((car, index) => {
    const btn = document.createElement('button');
    btn.className = 'btn tab-btn';
    btn.innerText = car.name;

    if (index === currentCarIndex) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      currentCarIndex = index;
      renderCards();
      renderTabs();
    })

    tabsContainer.appendChild(btn);
  })
}

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('theme-light-amber');
})

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
  currentCarIndex = garage.length - 1;

  newCarNameInput.value = '';
  newCarMileageInput.value = '';
  addCarModal.classList.remove('modal--open');
  renderCards();
  renderTabs();
})

closeModalBtn.addEventListener('click', () => {
  addCarModal.classList.remove('modal--open');
});

deleteCarBtn.addEventListener('click', () => {
  garage.splice(currentCarIndex, 1);
  saveGarage();

  if (garage.length === 0) {
    currentCarIndex = null;
  } else {
    currentCarIndex = 0;
  }

  renderCards();
  renderTabs();
})

addBtn.addEventListener('click', () => {
  addCarModal.classList.add('modal--open');
})

saveBtn.addEventListener('click', () => {
  const currentMileage = Number(currentMileageInput.value);
  const oilChangeCost = Number(oilChangeCostInput.value);


  // stockInput.addEventListener('input', () => {
  //   stockInput.value = stockInput.value.replace(/[^0-9]/g, '');
  // })

  if (currentMileage === 0 || oilChangeCost === 0) {
    status.innerText = 'Ошибка! Заполните все поля';
    status.style.color = '#ff4d4d';
    return;
  }

  const newRecord = new ServiceRecord('oil', oilChangeCost, 'shell', currentMileage);
  garage[currentCarIndex].addRecord(newRecord);
  saveGarage();

  status.innerText = 'Данные успешно сохранены!';
  status.style.color = '#4caf50';

  currentMileageInput.value = '';
  oilChangeCostInput.value = '';

  serviceModal.classList.remove('modal--open');

  renderCards();
})

loadGarage();
renderCards();
renderTabs();

