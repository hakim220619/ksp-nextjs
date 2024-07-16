import { useState, useEffect, useCallback } from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/admin'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'

// ** Custom Table Components Imports
import TableHeader from 'src/pages/ms/admin/TableHeader'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axiosConfig from '../../../configs/axiosConfig'

const MySwal = withReactContent(Swal)

interface UserStatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: UsersType
}

// // ** renders client column
// const userRoleObj: UserRoleType = {
//   Admin: { icon: 'tabler:device-laptop', color: 'secondary' },
//   author: { icon: 'tabler:circle-check', color: 'success' },
//   editor: { icon: 'tabler:edit', color: 'info' },
//   maintainer: { icon: 'tabler:chart-pie-2', color: 'primary' },
//   subscriber: { icon: 'tabler:user', color: 'warning' }
// }

const userStatusObj: UserStatusType = {
  Active: 'success',
  Online: 'success',
  pending: 'warning',
  inactive: 'secondary',
  Verification: 'warning',
  Offline: 'warning',
  Blocked: 'error'
}

// ** renders client column
// const renderClient = (row: UsersType) => {
//   if (row.avatar.length) {
//     return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
//   } else {
//     return (
//       <CustomAvatar
//         skin='light'
//         color={row.avatarColor}
//         sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
//       >
//         {getInitials(row.fullName ? row.fullName : 'John Doe')}
//       </CustomAvatar>
//     )
//   }
// }

const RowOptions = ({ uid }: { uid: any }) => {
  // ** Hooks
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const handleRowOptionsClick = () => {
    // setAnchorEl(event.currentTarget)
  }
  const handleRowEditedClick = () => {
    // router.push('/ms/admin/' + uid + '')
    router.push('/ms/admin/' + uid + '')
  }
  const handleRowOptionsClose = () => {
    const storedToken = window.localStorage.getItem('token')

    console.log(uid)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(deleteUser(uid))
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success'
        })
      }
    })
    // setAnchorEl(null)
  }
  const handleDelete = () => {
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' color='info' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:eye' />
      </IconButton>
      <IconButton size='small' color='success' onClick={handleRowEditedClick}>
        <Icon icon='tabler:edit' />
      </IconButton>
      <IconButton size='small' color='error' onClick={handleDelete}>
        <Icon icon='tabler:trash' />
      </IconButton>
    </>
  )
}

const columns: GridColDef[] = [
  {
    flex: 0.25,
    minWidth: 10,
    field: 'no',
    headerName: 'NO'
  },
  {
    flex: 0.25,
    minWidth: 280,
    field: 'nik',
    headerName: 'NIK'
  },
  {
    flex: 0.25,
    minWidth: 280,
    field: 'fullName',
    headerName: 'FULL NAME'
  },

  {
    flex: 0.15,
    field: 'email',
    minWidth: 260,
    headerName: 'EMAIL'
  },
  {
    flex: 0.15,
    field: 'role',
    minWidth: 170,
    headerName: 'ROLE'
  },
  {
    flex: 0.15,
    field: 'phone_number',
    minWidth: 170,
    headerName: 'PHONE'
  },
  {
    flex: 0.1,
    minWidth: 180,
    field: 'state',
    headerName: 'STATUS',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row.state}
          color={userStatusObj[row.state]}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    flex: 0,
    minWidth: 200,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions uid={row.uid} />
  }
]

const UserList = () => {
  // ** State
  const [role, setRole] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.admin)
  useEffect(() => {
    dispatch(
      fetchData({
        role,
        status,
        q: value
      })
    )
  }, [dispatch, role, status, value])
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setRole(e.target.value as string)
  }, [])

  const handleStatusChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setStatus(e.target.value as string)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        {/* {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontalWithDetails.map((item: CardStatsHorizontalWithDetailsProps, index: number) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatsHorizontalWithDetails {...item} />
                </Grid>
              )
            })}
          </Grid>
        )} */}
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Role'
                  SelectProps={{
                    value: role,
                    displayEmpty: true,
                    onChange: e => handleRoleChange(e)
                  }}
                >
                  <MenuItem value=''>Select Role</MenuItem>
                  <MenuItem value='Admin'>Admin</MenuItem>
                  <MenuItem value='Super Admin'>Super Admin</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Status'
                  SelectProps={{
                    value: status,
                    displayEmpty: true,
                    onChange: e => handleStatusChange(e)
                  }}
                >
                  <MenuItem value=''>Select Status</MenuItem>
                  <MenuItem value='pending'>Pending</MenuItem>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                </CustomTextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rowHeight={100}
            rows={store.data}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      {/* <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} /> */}
    </Grid>
  )
}

export default UserList
