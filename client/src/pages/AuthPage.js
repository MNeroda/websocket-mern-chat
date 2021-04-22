import React, {useState, useEffect, useContext} from "react"
import "../styles/authPage.css"
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const {loading,error,request, clearError} = useHttp()
    const [login, setLogin] = useState(true)

    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const message = useMessage()

    useEffect(()=> {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [login])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request("api/auth/register", "POST", {...form})
            message(data.message)
        } catch (e) {

        }
    }

    const loginHandler = async () => {
        try {
            const data = await request("api/auth/login", "POST", {...form})
            auth.login(data.token, data.userId)
        } catch (e) {

        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col s6 offset-s3">
                    <h1>Чат</h1>
                    <div className="card blue darken-1">
                        <div className="card-content white-text">
                            {login && <span className="card-title">Авторизация</span>}
                            {!login && <span className="card-title">Регистрация</span>}

                            <div className="input-field">
                                <input
                                    placeholder="Введите email"
                                    id="email"
                                    type="text"
                                    className="validate yellow-input"
                                    name="email"
                                    onChange={changeHandler}
                                    value={form.email}
                                />
                                    <label htmlFor="email">Электронная почта</label>
                            </div>

                            <div className="input-field">
                                <input
                                    placeholder="Введите пароль"
                                    id="password"
                                    type="password"
                                    className="validate yellow-input"
                                    name="password"
                                    onChange={changeHandler}
                                    value={form.password}
                                />
                                <label htmlFor="password">Пароль</label>
                            </div>

                            {
                                !login &&
                                <div className="input-field">
                                    <input
                                        placeholder="Введите Имя"
                                        id="name"
                                        type="text"
                                        className="validate yellow-input active"
                                        name="name"
                                        onChange={changeHandler}
                                        value={form.name}
                                    />
                                    <label htmlFor="name">Ваше имя</label>

                                </div>
                            }

                        </div>

                        {/*       LOGIN BUTTONS        */}
                        {
                            login &&
                            <div className="card-action">
                                <button
                                    className="btn yellow darken-4 margin-auth-button"
                                    disabled={loading}
                                    onClick={loginHandler}
                                >
                                    Войти
                                </button>

                                <button
                                    className="btn grey lighten-1 black-text"
                                    onClick={() => setLogin(false)}
                                    disabled={loading}
                                >
                                    Регистрация
                                </button>
                            </div>
                        }

                        {/*       REGISTER BUTTONS       */}

                        {
                            !login &&
                            <div className="card-action">
                                <button
                                    className="btn grey lighten-1 margin-auth-button"
                                    disabled={loading}
                                    onClick={() => setLogin(true)}
                                >
                                    Назад
                                </button>

                                <button
                                    className="btn yellow darken-4 black-text white-text"
                                    onClick={registerHandler}
                                    disabled={loading}
                                >
                                    Регистрация
                                </button>
                            </div>
                        }

                    </div>

                </div>
            </div>
        </div>
    )
}