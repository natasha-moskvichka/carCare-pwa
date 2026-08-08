let garage = [];
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

function setCurrentCarIndex(index) {
  currentCarIndex = index;
}

export {garage, currentCarIndex, loadGarage, saveGarage, setCurrentCarIndex, ServiceRecord, Car}
