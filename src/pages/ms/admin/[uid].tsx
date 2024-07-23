// ** React Imports
import { useState, useCallback, useEffect, FormEvent } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'

// ** Axios Import
import axiosConfig from '../../../configs/axiosConfig'
import { useRouter } from 'next/router'
import Link from 'next/link'

// ** Types
interface Role {
  id: string
  role_name: string
}
interface State {
  id: string
  state_name: string
}

interface User {
  nik: string
  email: string
  fullName: string
  address: string
  phone_number: string
  dateOfBirth: string
  role: string
}

const FormValidationSchema = () => {
  const [nik, setNik] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [fullName, setFullName] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const [roles, setRoles] = useState<Role[]>([])
  const [state, setState] = useState<string>('')
  const [states, setStates] = useState<State[]>([])
  const [company_id, setCompanyId] = useState<string>('')
  const [setValCompany, setValueCompany] = useState<any[]>([])

  const [updated_by, setUpdatedBy] = useState<string>()
  const router = useRouter()
  const { uid } = router.query

  const data = localStorage.getItem('userData') as string
  const getDataCache = JSON.parse(data)

  useEffect(() => {
    const storedToken = window.localStorage.getItem('token')
    if (storedToken) {
      axiosConfig
        .post(
          '/general/findUsersByUid',
          { uid },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(response => {
          const { nik, email, fullName, address, phone_number, date, role, company_id, state } = response.data
          setNik(nik)
          setEmail(email)
          setFullName(fullName)
          setAddress(address)
          setPhoneNumber(phone_number)
          setDateOfBirth(date.slice(0, 10))
          setRole(role)
          setCompanyId(company_id)
          setState(state)
          setUpdatedBy(getDataCache.id)
        })

      axiosConfig
        .get('/general/getRole', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then(response => {
          setRoles(response.data)
        })

      axiosConfig
        .get('/general/getState', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${storedToken}`
          }
        })
        .then(response => {
          // console.log(response)

          setStates(response.data)
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
    }
  }, [uid])

  const handleCompanyChange = useCallback((e: React.ChangeEvent<{ value: unknown }>) => {
    setCompanyId(e.target.value as string)
  }, [])
  const handleRoleChange = useCallback((e: React.ChangeEvent<{ value: unknown }>) => {
    setRole(e.target.value as string)
  }, [])
  const handleStateChange = useCallback((e: React.ChangeEvent<{ value: unknown }>) => {
    setState(e.target.value as string)
  }, [])

  const validateForm = () => {
    if (!nik) {
      toast.error('Nik is required')
      return false
    }
    if (!fullName) {
      toast.error('Full Name is required')
      return false
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Valid email is required')
      return false
    }
    if (!address) {
      toast.error('Address is required')
      return false
    }
    if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
      toast.error('Valid phone number is required')
      return false
    }
    if (!dateOfBirth) {
      toast.error('Date of Birth is required')
      return false
    }
    if (!role) {
      toast.error('Role is required')
      return false
    }
    if (!state) {
      toast.error('State is required')
      return false
    }
    return true
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    const storedToken = window.localStorage.getItem('token')
    const data = {
      uid,
      nik,
      email,
      fullName,
      address,
      phone_number: phoneNumber,
      dateOfBirth,
      role,
      company_id,
      state,
      updated_by
    }
    // console.log(data)

    if (storedToken) {
      axiosConfig
        .post(
          '/update-admin',
          { data },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`
            }
          }
        )
        .then(() => {
          toast.success('Successfully Added!')
          router.push('/ms/admin')
        })
        .catch(() => {
          toast.error("Failed. This didn't work.")
        })
    }
  }

  return (
    <Card>
      <CardHeader title='Update Admin' />
      <CardContent>
        <form onSubmit={onSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={nik}
                onChange={e => setNik(e.target.value)}
                label='Nik'
                placeholder='Ksp635247813'
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                label='Full Name'
                placeholder='Leonard'
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                label='Email'
                placeholder='carterleonard@gmail.com'
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type='date'
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                label='Date of Birth'
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                label='Phone Number'
                placeholder='6285***'
              />
            </Grid>

            <Grid item xs={6}>
              <CustomTextField select fullWidth label='Role' value={role} onChange={handleRoleChange}>
                <MenuItem value='' disabled>
                  Select Role
                </MenuItem>
                {roles.map(roleItem => (
                  <MenuItem key={roleItem.id} value={roleItem.id}>
                    {roleItem.role_name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField select fullWidth label='State' value={state} onChange={handleStateChange}>
                <MenuItem value='' disabled>
                  Select State
                </MenuItem>
                {states.map(data => (
                  <MenuItem key={data.state_name} value={data.state_name}>
                    {data.state_name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField select fullWidth label='Company' value={company_id} onChange={handleCompanyChange}>
                <MenuItem value='' disabled>
                  Select Company
                </MenuItem>
                {setValCompany.map(data => (
                  <MenuItem key={data.id} value={data.id}>
                    {data.company_name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={address}
                onChange={e => setAddress(e.target.value)}
                label='Address'
                placeholder='Jl Hr Agung'
              />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Save
              </Button>
              <Box m={1} display='inline'>
                {/* This adds a margin between the buttons */}
              </Box>
              <Link href='/ms/admin' passHref>
                <Button type='button' variant='contained' color='secondary'>
                  Back
                </Button>
              </Link>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormValidationSchema
