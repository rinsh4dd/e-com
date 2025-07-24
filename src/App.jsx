import "./App.css";

import React from "react";
import { Toaster } from "react-hot-toast";
import UserRouter from "./route";
import { GetAllProducts } from "./service/product";

function App() {
  return (
    <>
     <Toaster position="top-center" reverseOrder={false} />
      <UserRouter />
    </>
  );
}

export default App;
