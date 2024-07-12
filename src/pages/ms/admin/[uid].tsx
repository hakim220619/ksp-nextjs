// ** React Imports
import { useState, useCallback, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

import toast from 'react-hot-toast'

import MenuItem from '@mui/material/MenuItem'
import { SelectChangeEvent } from '@mui/material/Select'
import axiosConfig from '../../../configs/axiosConfig'
import { useRouter } from 'next/router'
import Link from 'next/link'

const FormValidationSchema = () => {
  const [nik, setNik] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [fullName, setFullName] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [phone_number, setPhoneNumber] = useState<string>('')

  const [role, setRole] = useState<string>('')
  const [setValRole, setValueRole] = useState<any[]>([])
  const router = useRouter()
  const { uid } = router.query
  useEffect(() => {
    const storedToken = window.localStorage.getItem('token')
    axiosConfig
      .post(
        '/general/findUsersByUid',
        { uid: uid },
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + storedToken
          }
        }
      )
      .then(response => {
        setNik(response.data.nik)
        setEmail(response.data.email)
        setFullName(response.data.fullName)
        setAddress(response.data.address)
        setPhoneNumber(response.data.phone_number)
        setRole(response.data.role)
      })
    axiosConfig
      .get('/general/getRole', {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + storedToken
        }
      })
      .then(response => {
        setValueRole(response.data)
      })
  }, [])
  const handlePlanChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setRole(e.target.value as string)
  }, [])

  const onSubmit = (data: any) => {}

  return (
    <Card>
      <CardHeader title='Added New Admin' />
      <CardContent>
        <form onSubmit={onSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <CustomTextField fullWidth value={nik} label='Nik' placeholder='Ksp635247813' />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField fullWidth value={fullName} label='Full Name' placeholder='Leonard' />
            </Grid>

            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                type='email'
                value={email}
                label='Email'
                placeholder='carterleonard@gmail.com'
                aria-describedby='validation-schema-email'
              />
            </Grid>

            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={address}
                label='Address'
                placeholder='Jl Hr Agung'
                aria-describedby='validation-schema-first-name'
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                value={phone_number}
                label='Phone Number'
                placeholder='6285***'
                aria-describedby='validation-schema-phone_number'
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                select
                fullWidth
                label='Role'
                defaultValue='Select Role'
                SelectProps={{
                  value: role,
                  displayEmpty: true,
                  onChange: e => handlePlanChange(e)
                }}
                aria-describedby='validation-schema-role'
              >
                <MenuItem value='' disabled>
                  Select Role
                </MenuItem>

                {setValRole.map((data, i) => (
                  <MenuItem key={i} value={data.id}>
                    {data.role_name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Save
              </Button>
              <Link href='/ms/admin' passHref>
                <Button type='submit' variant='contained' color='secondary'>
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
