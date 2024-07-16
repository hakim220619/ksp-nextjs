import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'
// ** Axios Imports
import axiosConfig from 'src/configs/axiosConfig'

interface DataParams {
  q: string
  role: string
  status: string
}
interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appUsers/fetchData', async (params: DataParams) => {
  const storedToken = window.localStorage.getItem('token')
  const customConfig = {
    params,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + storedToken
    }
  }
  const response = await axiosConfig.get('/list-admin', customConfig)

  return response.data
})

export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
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
    console.log(dispatch(fetchData(getState())))
    dispatch(fetchData(getState()))

    return response.data
  }
)
export const appUsersSlice = createSlice({
  name: 'appUsers',
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

export default appUsersSlice.reducer
