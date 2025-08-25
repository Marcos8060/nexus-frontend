'use client'
import { configureStore } from "@reduxjs/toolkit";
import nexusReducer from "./features/index";

export const store = configureStore({
  reducer: {
    nexus: nexusReducer,
  },
});
