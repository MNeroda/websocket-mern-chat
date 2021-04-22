import React, {useState, useContext} from "react";
import {useHistory} from "react-router-dom"
import "../styles/navbar.css"
import {AuthContext} from "../context/AuthContext";

export const Navbar = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const [searchInput, setSearchInput] = useState("")

    const changeHandler = (event) => {
        setSearchInput(event.target.value)
    }

    const logoutHandler = (event) => {
        event.preventDefault()
        auth.logOut()
        history.push("/")
    }

    return (
        <nav>
            <div className="nav-wrapper">
                <a href="#" className="brand-logo">Logo</a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><a href="sass.html">Sass</a></li>
                    <li><a href="badges.html">Components</a></li>
                    <li><a href="collapsible.html">JavaScript</a></li>
                </ul>
            </div>
        </nav>

    )
}