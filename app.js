let currentCarIndex = 0;

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

const myAudi = new Car('Audi', 1200);
const myHonda = new Car('Honda', 3800);

const garage = [myAudi, myHonda];

const currentMileageInput = document.getElementById('currentMileage');
const oilChangeCostInput = document.getElementById('oilChangeCost');
const saveBtn = document.getElementById('saveBtn');
const status = document.getElementById('status');
const tabsContainer = document.getElementById('tabsContainer');
const cardCarMileage = document.getElementById('cardCarMileage');
const cardLastOilChange = document.getElementById('cardLastOilChange');
const cardCarName = document.getElementById('cardCarName');

saveBtn.addEventListener('click', () => {

  const currentMileage = Number(currentMileageInput.value);
  const oilChangeCost = Number(oilChangeCostInput.value);

  if (currentMileage === 0 || oilChangeCost === 0) {
    status.innerText = 'Ошибка! Заполните все поля';
    status.style.color = '#ff4d4d';
    return;
  }

  const newRecord = new ServiceRecord('oil', oilChangeCost, 'shell', currentMileage);
  garage[currentCarIndex].addRecord(newRecord);

  status.innerText = 'Данные успешно сохранены!';
  status.style.color = '#4caf50';

  currentMileageInput.value = '';
  oilChangeCostInput.value = '';

  renderCards();
})

function renderCards () {

  const currentCar = garage[currentCarIndex];
  cardCarName.innerText = currentCar.name;
  cardCarMileage.innerText = currentCar.currentMileage + ' км';

  const historyLength = currentCar.history.length;
  console.log(historyLength)

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

renderCards();
renderTabs();

