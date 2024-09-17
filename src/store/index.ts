// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import admin from 'src/store/apps/admin/index'
import anggota from 'src/store/apps/anggota/index'
import anggotaVerification from 'src/store/apps/anggota/daftar/index'

export const store = configureStore({
  reducer: {
    admin,
    anggota,
    anggotaVerification
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
