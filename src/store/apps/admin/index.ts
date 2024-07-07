// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axiosConfig from 'src/configs/axiosConfig'

interface DataParams {
  q: string
  role: string
  status: string
  pagination: {}
  currentPlan: string
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
  // console.log(customConfig)

  const response = await axiosConfig.get('/list-admin', customConfig)
  // console.log(response.data)
  return response.data
})

// // ** Add User
// export const addUser = createAsyncThunk(
//   'appUsers/addUser',
//   async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
//     console.log(data)
//     const storedToken = window.localStorage.getItem('token')
//     const response = await axiosConfig.post('/create-admin', {
//       headers: {
//         Accept: 'application/json',
//         Authorization: 'Bearer ' + storedToken
//       },
//       data
//     })
//     console.log(response)

//     dispatch(fetchData(getState().user.params))

//     return response.data
//   }
// )

// // ** Delete User
// export const deleteUser = createAsyncThunk(
//   'appUsers/deleteUser',
//   async (id: number | string, { getState, dispatch }: Redux) => {
//     const response = await axiosConfig.delete('/apps/users/delete', {
//       data: id
//     })
//     dispatch(fetchData(getState().user.params))

//     return response.data
//   }
// )

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
