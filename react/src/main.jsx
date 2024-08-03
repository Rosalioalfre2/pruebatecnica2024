import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Flowbite } from "flowbite-react";
import { AlertProvider } from "./context/AlertContext";
import { NextUIProvider } from "@nextui-org/react";
import './index.css'
import { AuthProvider } from "@/context/AuthContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <Flowbite>
        <AlertProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </AlertProvider>
      </Flowbite>
    </NextUIProvider>
  </React.StrictMode>,
)
