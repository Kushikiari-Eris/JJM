import React from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'


axios.defaults.withCredentials = true

import { ThemeProvider } from "@material-tailwind/react";
 
const root = ReactDOM.createRoot(document.getElementById("root"));
 
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>

        <App />
   
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
