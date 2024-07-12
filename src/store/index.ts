// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import admin from 'src/store/apps/admin/index'

export const store = configureStore({
  reducer: {
    admin
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
