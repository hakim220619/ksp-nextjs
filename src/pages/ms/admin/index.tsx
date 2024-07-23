import { useState, useEffect, useCallback } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { SelectChangeEvent } from '@mui/material/Select'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import CustomChip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'
import { fetchData, deleteUser } from 'src/store/apps/admin'
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'
import TableHeader from 'src/pages/ms/admin/TableHeader'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axiosConfig from '../../../configs/axiosConfig'
import CircularProgress from '@mui/material/CircularProgress'
import { Box } from '@mui/system'
const MySwal = withReactContent(Swal)

interface UserStatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: UsersType
}

const userStatusObj: UserStatusType = {
  Active: 'success',
  Online: 'success',
  pending: 'warning',
  inactive: 'secondary',
  Verification: 'warning',
  Offline: 'warning',
  Blocked: 'error'
}

const RowOptions = ({ uid }: { uid: any }) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const handleRowOptionsClick = () => {}
  const handleRowEditedClick = () => {
    router.push('/ms/admin/' + uid)
  }
  const handleRowOptionsClose = () => {
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
  { flex: 0.25, minWidth: 100, field: 'no', headerName: 'NO' },
  { flex: 0.25, minWidth: 280, field: 'company_name', headerName: 'COMPANY' },
  { flex: 0.25, minWidth: 180, field: 'nik', headerName: 'NIK' },
  { flex: 0.25, minWidth: 180, field: 'fullName', headerName: 'FULL NAME' },
  { flex: 0.15, field: 'email', minWidth: 260, headerName: 'EMAIL' },
  { flex: 0.15, field: 'role', minWidth: 170, headerName: 'ROLE' },
  { flex: 0.15, field: 'phone_number', minWidth: 170, headerName: 'PHONE' },
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
  const [role, setRole] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const data = localStorage.getItem('userData') as string
  const getDataLocal = JSON.parse(data)
  const [company, setCompany] = useState<any>(`${getDataLocal.company_id}`)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [loading, setLoading] = useState<boolean>(true)
  const [setValcompany, setValueCompany] = useState<any[]>([])

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.admin)
  useEffect(() => {
    const storedToken = window.localStorage.getItem('token')

    setLoading(true)
    dispatch(
      fetchData({
        role,
        status,
        company,
        q: value
      })
    ).finally(() => {
      setLoading(false)
    })
    axiosConfig
      .get('/general/getCompany', {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + storedToken
        }
      })
      .then(response => {
        setValueCompany(response.data)
      })
  }, [dispatch, role, status, company, value])
  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])
  const handleRoleChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setRole(e.target.value as string)
  }, [])
  const handleCompanyChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setCompany(e.target.value as string)
  }, [])
  const handleStatusChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setStatus(e.target.value as string)
  }, [])
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          {getDataLocal.role == 'Developer' ? (
            <CardContent>
              <Grid container spacing={12}>
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
                <Grid item sm={4} xs={12}>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue='Select Company'
                    SelectProps={{
                      value: company,
                      displayEmpty: true,
                      onChange: e => handleCompanyChange(e)
                    }}
                  >
                    <MenuItem value='all'>Select Company</MenuItem>
                    {setValcompany.map((data, i) => (
                      <MenuItem key={i} value={data.id}>
                        {data.company_name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
              </Grid>
            </CardContent>
          ) : (
            <CardContent>
              <Grid container spacing={12}>
                <Grid item sm={6} xs={12}>
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
                <Grid item sm={6} xs={12}>
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
          )}
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          {loading ? (
            <div>
              {Array.from(new Array(1)).map((_, index) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                  <CircularProgress color='secondary' />
                </div>
              ))}
            </div>
          ) : (
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
          )}
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserList
