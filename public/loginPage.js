"use strict";

// вход пользователя в систему
function login(data) {
    ApiConnector.login(data, (answer) => answer.success ? location.reload() : userForm.setLoginErrorMessage(answer.data));
}

// регистрация пользователя в системе
function register(data) {
    ApiConnector.register(data, (answer) => answer.success ? location.reload() : userForm.setRegisterErrorMessage(answer.data));
}

const userForm = new UserForm();
userForm.loginFormCallback = login;
userForm.registerFormCallback = register;
