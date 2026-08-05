const html = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggleBtn');

const saveTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', saveTheme);

function toggleTheme() {
  let currentTheme = html.getAttribute('data-theme');
  let newTheme = currentTheme === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  renderThemeIcon();
}

function renderThemeIcon() {
  const currentTheme = html.getAttribute('data-theme');
  if (currentTheme === 'light') {
    themeToggleBtn.innerHTML = `<svg class="icon-theme"><use href="fonts/sprite.svg#light-theme"></use></svg>`;
  } else {
    themeToggleBtn.innerHTML = `<svg class="icon-theme"><use href="fonts/sprite.svg#dark-theme"></use></svg>`;
  }
}

themeToggleBtn.addEventListener('click', toggleTheme);

let currentCarIndex = null;

class ServiceRecord {
  constructor(type, cost, brand, mileage, date) {
    this.type = type;
    this.cost = cost;
    this.brand = brand;
    this.mileage = mileage;
    this.date = date;
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
const carCard = document.getElementById('carCard');

const serviceModal = document.getElementById('serviceModal');
const openServiceModalBtn = document.getElementById('openServiceModalBtn');
const oilChangeDateInput = document.getElementById('oilChangeDate');

const carHistory = document.getElementById('carHistory');
const historyList = document.getElementById('historyList');

const cardStatus = document.getElementById('cardStatus');
const historyTotal = document.getElementById('historyTotal');
const cardCarMileageInput = document.getElementById('cardCarMileageInput');

const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const trueDeleteBtn = document.getElementById('trueDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const cardStatsContainer = document.getElementById('cardStatsContainer');

function loadGarage() {
  const rawDate = localStorage.getItem('autoGarage');

  if (!rawDate) return;

  const parseGarage = JSON.parse(rawDate);

  parseGarage.forEach(rowCar => {
    const restoredCar = new Car(rowCar.name, rowCar.currentMileage);
    rowCar.history.forEach(rowRecord => {
      const restoredRecord = new ServiceRecord(rowRecord.type, rowRecord.cost, rowRecord.brand, rowRecord.mileage, rowRecord.date)

      restoredCar.addRecord(restoredRecord);
    });

    garage.push(restoredCar);
  })

  if (garage.length > 0) {
    currentCarIndex = 0;
  }
}

function saveGarage() {
  localStorage.setItem('autoGarage', JSON.stringify(garage));
}

function renderCards() {
  historyList.innerHTML = '';
  cardStatsContainer.innerHTML = '';
  let totalCost = 0;
  const lastRepairs = {};

  if (garage.length === 0) {
    deleteCarBtn.style.display = 'none';
    cardCarName.innerText = "Пожалуйста, добавьте ваш первый автомобиль";
    cardLastOilChange.innerText = '';
    carCard.style.display = 'none';
    carHistory.style.display = 'none';
    return;
  }

  const currentCar = garage[currentCarIndex];
  cardCarName.innerText = currentCar.name;
  cardCarMileageInput.value = currentCar.currentMileage;
  deleteCarBtn.style.display = 'block';
  carCard.style.display = 'flex';
  carHistory.style.display = 'block';

  const historyLength = currentCar.history.length;

  if (historyLength === 0) {
    historyList.innerHTML = '<p>Журнал пока пуст</p>';
    cardStatus.className = 'status-badge status--info';
    cardStatus.innerText = 'История пуста';

  } else {
    const lastRecord = currentCar.history[historyLength - 1];
    cardLastOilChange.innerText = `${lastRecord.mileage} км`;

    const lastRepairDate = new Date(lastRecord.date);
    const today = new Date();
    const diffInMs = today - lastRepairDate;
    const daysPassed = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const kmPassed = currentCar.currentMileage - lastRecord.mileage;

    if (daysPassed > 300) {
      cardStatus.classList.add('status--error');
      cardStatus.classList.remove('status--good');
      cardStatus.innerText = 'Пора на ТО (прошло более 10 месяцев)!';
    } else if (kmPassed > 10000) {
      cardStatus.classList.add('status--error');
      cardStatus.classList.remove('status--good');
      cardStatus.innerText = 'Пора на ТО (пробег после замены > 10 000 км)!';
    } else {
      cardStatus.classList.add('status--good');
      cardStatus.innerText = 'Автомобиль обслужен!'
    }

    currentCar.history.forEach(record => {
      const itemHTML = `
      <div class="history-item">
      <div class="history-item__main">
      <span class="history-item__type">${record.type}</span>
      <span class="history-item__meta">Пробег: ${record.mileage} км | Дата: ${record.date}</span>  
</div>
       <span class="history-item__cost">${record.cost} ₽</span>
</div>`;

      totalCost += record.cost;
      lastRepairs[record.type] = record;

      historyList.insertAdjacentHTML("beforeend", itemHTML);
    })

    Object.values(lastRepairs).forEach(repair => {
      const rowHTML = `
          <div class="info-row">
           <span class="car-card__row">Последний ремонт: <strong class="car-card__value">${repair.type}</strong></span>
          </div>
`
      cardStatsContainer.insertAdjacentHTML("beforeend", rowHTML);
    })
    historyTotal.innerText = `Всего расходов: ${totalCost} ₽`;

  }
}

function renderTabs() {
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

cardCarMileageInput.addEventListener('blur', () => {
  const updatedMileage = Number(cardCarMileageInput.value);

  if (updatedMileage > 0 || updatedMileage >= cardLastOilChange.mileage) {
    garage[currentCarIndex].currentMileage = updatedMileage;
    renderCards();
    saveGarage();
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
  deleteConfirmModal.classList.add('modal--open');
});

cancelDeleteBtn.addEventListener('click', () => {
  deleteConfirmModal.classList.remove('modal--open');
});

trueDeleteBtn.addEventListener('click', () => {
  garage.splice(currentCarIndex, 1);
  saveGarage();

  if (garage.length === 0) {
    currentCarIndex = null;
  } else {
    currentCarIndex = 0;
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

  // stockInput.addEventListener('input', () => {
  //   stockInput.value = stockInput.value.replace(/[^0-9]/g, '');
  // })

  if (currentMileage === 0 || oilChangeCost === 0 || oilChangeDate === '') {
    status.innerText = 'Ошибка! Заполните все поля';
    status.style.color = '#ff4d4d';
    return;
  }

  const newRecord = new ServiceRecord(serviceType.value, oilChangeCost, 'shell', currentMileage, oilChangeDate);
  garage[currentCarIndex].addRecord(newRecord);
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
renderThemeIcon()
