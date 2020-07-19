const logoutButton = new LogoutButton();
logoutButton.action = () => {
  ApiConnector.logout((response) => {
    console.log(response);
    if (response.success) {
      location.reload();
    } else {
      console.responseor('Произошла ошибка выхода. Перезагрузите компьютер и попробуйте снова');
    }
  });
};

ApiConnector.current((response) => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

const ratesBoard = new RatesBoard();

function getStocksData() {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
}

getStocksData();
setInterval(getStocksData, 60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    if (!response.success) {
      moneyManager.setMessage(true, response.data);
    } else {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(false, 'Пополнение счета выполнено успешно');
    }
  });
};

moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (response) => {
    if (!response.success) {
      moneyManager.setMessage(true, response.data);
    } else {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(false, 'Конвертация валюты выполнена успешно');
    }
  });
};

moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
    if (!response.success) {
      moneyManager.setMessage(true, response.data);
    } else {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(false, 'Перевод успешно выполнен');
    }
  });
};

const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites((response) => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
});

favoritesWidget.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, (response) => {
    if (!response.success) {
      moneyManager.setMessage(true, response.data);
    } else {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      moneyManager.setMessage(false, `Пользователь ${data.name} успешно добавлен в избранное`);
    }
  });
};

favoritesWidget.removeUserCallback = (data) => {
  ApiConnector.removeUserFromFavorites(data, (response) => {
    if (!response.success) {
      moneyManager.setMessage(true, response.data);
    } else {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      moneyManager.setMessage(false, `Пользователь успешно удален из Избранного`);
    }
  });
};
