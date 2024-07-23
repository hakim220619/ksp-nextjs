import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'
// ** Axios Imports
import axiosConfig from 'src/configs/axiosConfig'

interface DataParams {
  company: string
  q: string
}
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Anggota
export const fetchData = createAsyncThunk('appAnggota/fetchData', async (params: DataParams) => {
  const storedToken = window.localStorage.getItem('token')
  const customConfig = {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + storedToken
    }
  }
  const response = await axiosConfig.get('/list-anggota', customConfig)
  console.log(response)

  return response.data
})

export const deleteUser = createAsyncThunk(
  'appAnggota/deleteUser',
  async (uid: number | string, { getState, dispatch }: Redux) => {
    console.log(uid)

    const storedToken = window.localStorage.getItem('token')
    const dataAll = {
      data: uid
    }
    const customConfig = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + storedToken
      }
    }
    const response = await axiosConfig.post('/delete-admin', dataAll, customConfig)
    const { company, q } = getState().admin

    // Memanggil fetchData untuk memperbarui data setelah penghapusan
    dispatch(fetchData({ company, q }))

    return response.data
  }
)
export const appAnggotaSlice = createSlice({
  name: 'appAnggota',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.total
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appAnggotaSlice.reducer
