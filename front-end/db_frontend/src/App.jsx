import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavbarComponent from "./components/navbar.component.jsx";
import {Route, Routes} from "react-router-dom";
import HomeComponent from "./components/home.component.jsx";
import {Avatar} from "flowbite-react";
import LoginComponent from "./components/login.component.jsx";
import RegisterComponent from "./components/register.component.jsx";

function App() {

  return (
      <div className="isolate bg-white dark:bg-gray-800 flex flex-col min-h-screen">
        <Routes className="">
            <Route path="/" element={<HomeComponent />}/>
            {/*<Route path="/home" element={}/>*/}
            <Route path="/login" element={<LoginComponent/>}/>
            <Route path="/register" element={<RegisterComponent/>}/>
        </Routes>

    {/*  <div>*/}
    {/*    <a href="https://vitejs.dev" target="_blank">*/}
    {/*      <img src={viteLogo} className="logo" alt="Vite logo" />*/}
    {/*    </a>*/}
    {/*    <a href="https://reactjs.org" target="_blank">*/}
    {/*      <img src={reactLogo} className="logo react" alt="React logo" />*/}
    {/*    </a>*/}
    {/*  </div>*/}
    {/*  <h1>Vite + React</h1>*/}
    {/*  <div className="card">*/}
    {/*    <button onClick={() => setCount((count) => count + 1)}>*/}
    {/*      count is {count}*/}
    {/*    </button>*/}
    {/*    <p>*/}
    {/*      Edit <code>src/App.jsx</code> and save to test HMR*/}
    {/*    </p>*/}
    {/*  </div>*/}
    {/*  <p className="read-the-docs">*/}
    {/*    Click on the Vite and React logos to learn more*/}
    {/*  </p>*/}
    {/*</div>*/}
    </div>
  )
}

export default App
