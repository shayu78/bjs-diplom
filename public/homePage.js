"use strict";

// выход из личного кабинета
const logoutButton = new LogoutButton();
logoutButton.action = () => ApiConnector.logout((answer) => answer.success ? location.reload() : console.error(answer.data));

// получение информации о текущем пользователе
ApiConnector.current((answer) => answer.success ? ProfileWidget.showProfile(answer.data) : console.error(answer.data));

// блок кода с получением курсов валют
const ratesBoard = new RatesBoard();

function getRates() {
    ApiConnector.getStocks((answer) => {
        if (answer.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(answer.data);
        }
    });
}

getRates();
const getRatesInterval = setInterval(getRates, 60000);

const moneyManager = new MoneyManager();

// блок кода пополнения баланса
function addMoney(data) {
    ApiConnector.addMoney(data, (answer) => moneyResultProcessing(answer, `Баланс пополнен на ${data.amount} ${data.currency}`));
}

moneyManager.addMoneyCallback = addMoney;

// блок кода конвертирования валюты
function convertMoney(data) {
    ApiConnector.convertMoney(data, (answer) => moneyResultProcessing(answer, `Конвертирование ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`));
}

moneyManager.conversionMoneyCallback = convertMoney;

// блок кода с переводом валюты
function transferMoney(data) {
    ApiConnector.transferMoney(data, (answer) =>
        moneyResultProcessing(answer, `Перевод ${data.amount} ${data.currency} пользователю с идентификатором ${data.to}`));
}

moneyManager.sendMoneyCallback = transferMoney;

const favoritesWidget = new FavoritesWidget();

// получение списка избранного
ApiConnector.getFavorites((answer) => answer.success ? updateFavoritesData(answer.data) : console.error(answer.data));

// блок кода добавления пользователя в список избранных
function addUserToFavorites(data) {
    ApiConnector.addUserToFavorites(data, (answer) => answer.success ? updateFavoritesData(answer.data) : favoritesWidget.setMessage(true, answer.data));
}

favoritesWidget.addUserCallback = addUserToFavorites;

// блок кода удаления пользователя из списка избранных
function removeUserFromFavorites(data) {
    ApiConnector.removeUserFromFavorites(data, (answer) => answer.success ? updateFavoritesData(answer.data) : favoritesWidget.setMessage(true, answer.data));
}

favoritesWidget.removeUserCallback = removeUserFromFavorites;

// обработка результатов операций с валютами
function moneyResultProcessing(answer, successText) {
    if (answer.success) {
        ProfileWidget.showProfile(answer.data);
        moneyManager.setMessage(false, successText);
    } else moneyManager.setMessage(true, answer.data);
}

// обновление списков избранных пользователей
function updateFavoritesData(data) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(data);
    moneyManager.updateUsersList(data);
}
