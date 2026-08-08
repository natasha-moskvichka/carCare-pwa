import {garage, currentCarIndex, setCurrentCarIndex} from "./state.js";

const tabsContainer = document.getElementById('tabsContainer');
const cardLastOilChange = document.getElementById('cardLastOilChange');
const cardCarName = document.getElementById('cardCarName');
const deleteCarBtn = document.getElementById('deleteCarBtn');
const carCard = document.getElementById('carCard');

const carHistory = document.getElementById('carHistory');
const historyList = document.getElementById('historyList');

const cardStatus = document.getElementById('cardStatus');
const historyTotal = document.getElementById('historyTotal');
const cardStatsContainer = document.getElementById('cardStatsContainer');
const historyChart = document.getElementById('historyChart');
const cardCarMileageInput = document.getElementById('cardCarMileageInput');

function renderCards() {
  historyList.innerHTML = '';
  cardStatsContainer.innerHTML = '';
  historyChart.innerHTML = '';

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

  const lastOilChange = currentCar.history.findLast(record => record.type === 'Замена масла');

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

    if (daysPassed > 300 && lastOilChange) {
      cardStatus.classList.add('status--error');
      cardStatus.classList.remove('status--good');
      cardStatus.classList.remove('status--info');
      cardStatus.innerText = 'Пора на ТО (прошло более 10 месяцев)!';
    } else if (kmPassed > 10000 && lastOilChange) {
      cardStatus.classList.add('status--error');
      cardStatus.classList.remove('status--good');
      cardStatus.classList.remove('status--info');
      cardStatus.innerText = 'Пора на ТО (пробег после замены > 10 000 км)!';
    } else {
      cardStatus.classList.add('status--good');
      cardStatus.classList.remove('status--info');
      cardStatus.classList.remove('status--error');
      cardStatus.innerText = 'Автомобиль обслужен!'
    }

    currentCar.history.forEach(record => {
      totalCost += record.cost;
    })

    currentCar.history.forEach(record => {
      const percent = totalCost > 0 ? Math.round((record.cost / totalCost) * 100) : 0;

      const itemHTML = `
      <div class="history-item">
        <div class="history-item__main">
          <span class="history-item__type">${record.type}</span>
          <span class="history-item__meta">Пробег: ${record.mileage} км | Дата: ${record.date}</span>  
        </div>
        <span class="history-item__cost">${record.cost} ₽</span>
      </div>`;

      let barClass = '';

      switch (record.type) {
        case 'Замена масла':
          barClass = 'oil';
          break;
        case 'Замена колодок' :
          barClass = 'brakes';
          break;
        case 'Замена фильтра' :
          barClass = 'filter';
          break;
        default:
          barClass = 'other';
      }

      const barHTML = `<div class="chart-bar chart-bar--${barClass}" style="width: ${percent}%"></div>`;
      historyChart.insertAdjacentHTML('beforeend', barHTML);

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
      setCurrentCarIndex(index);
      renderCards();
      renderTabs();
    })

    tabsContainer.appendChild(btn);
  })
}

export {renderTabs, renderCards};



