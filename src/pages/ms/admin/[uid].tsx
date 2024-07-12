// ** React Imports
import { forwardRef, useState, ChangeEvent, useCallback, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import DatePicker from 'react-datepicker'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import MenuItem from '@mui/material/MenuItem'
import { SelectChangeEvent } from '@mui/material/Select'
import axiosConfig from '../../../configs/axiosConfig'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface State {
  password: string
  showPassword: boolean
}

interface CustomInputProps {
  value: DateType
  label: string
  error: boolean
  onChange: (event: ChangeEvent) => void
}

const CustomInput = forwardRef(({ ...props }: CustomInputProps, ref) => {
  return <CustomTextField fullWidth inputRef={ref} {...props} sx={{ width: '100%' }} />
})

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  email: yup.string().email().required(),

  nik: yup
    .string()
    .min(3, obj => showErrors('nik', obj.value.length, obj.min))
    .required(),
  fullName: yup
    .string()
    .min(3, obj => showErrors('fullName', obj.value.length, obj.min))
    .required(),
  dob: yup.date().required(),
  address: yup.string().required(),
  phone_number: yup
    .number()
    .min(3, obj => showErrors('phone number', obj.value.length, obj.min))
    .required()
})

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
  // console.log(uid)
  // const [dataUid, setUid] = useState<any>(uid)
  const [state, setState] = useState<State>({
    password: '',
    showPassword: false
  })
  const data = localStorage.getItem('userData') as string
  const company = JSON.parse(data)

  const defaultValues = {
    nik: nik,
    email: email,
    fullName: fullName,
    address: address,
    phone_number: phone_number,
    role: role
  }

  useEffect(() => {
    const storedToken = window.localStorage.getItem('token')
    const customConfig = {
      uid,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + storedToken
      }
    }
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

  // ** Hook

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword })
  }
  const handlePlanChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setRole(e.target.value as string)
  }, [])

  const onSubmit = (data: any) => {
    const dataAll = {
      data: data,
      role: role
    }

    const storedToken = window.localStorage.getItem('token')
    axiosConfig
      .post('/create-admin', dataAll, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + storedToken
        }
      })
      .then(async response => {
        console.log(response)
        toast.success('Successfully Added!')
        // router.push('/ms/admin')
      })
      .catch(() => {
        toast.error("Failed This didn't work.")
        console.log('gagal')
      })
  }

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
