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
// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store'
import { UsersType } from 'src/types/apps/userTypes'
// ** Actions Imports
import { useRouter } from 'next/navigation'
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
interface UserData {
  nik: string
  email: string
  fullName: string
  password: string
  address: string
  phone_number: number
  dob: Date
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
  password: yup
    .string()
    .min(4, obj => showErrors('password', obj.value.length, obj.min))
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
  // role: yup.string().required()
})

const FormValidationSchema = () => {
  const [role, setRole] = useState<string>('')
  const [setValRole, setValueRole] = useState<string[]>([])
  // ** States
  const router = useRouter()
  const [state, setState] = useState<State>({
    password: '',
    showPassword: false
  })
  // console.log(role)
  const company_id = JSON.parse(localStorage.getItem('userData'))
  // console.log(company_id)
  const defaultValues = {
    nik: '4234d23',
    email: 'asdasd@gmail.com',
    fullName: 'asdasd',
    password: '123123123',
    address: 'asdasdasds',
    phone_number: '34534534634565',
    company_id: company_id.company_id,
    dob: null
  }
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.user)

  useEffect(() => {
    const storedToken = window.localStorage.getItem('token')
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
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword })
  }
  const handlePlanChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setRole(e.target.value as string)
  }, [])

  const onSubmit = (data: UserData) => {
    const dataAll = {
      data: data,
      role: role
    }
    // console.log(dataAll)

    const storedToken = window.localStorage.getItem('token')
    axiosConfig
      .post('/create-admin', dataAll, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + storedToken
        }
      })
      .then(async response => {
        // console.log(response)
        toast.success('Successfully Added!')
        router.push('/ms/admin')
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <Controller
                name='nik'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Nik'
                    onChange={onChange}
                    placeholder='Ksp635247813'
                    error={Boolean(errors.nik)}
                    aria-describedby='validation-schema-nik'
                    {...(errors.nik && { helperText: errors.nik.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='fullName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Full Name'
                    onChange={onChange}
                    placeholder='Leonard'
                    error={Boolean(errors.fullName)}
                    aria-describedby='validation-schema-fullName'
                    {...(errors.fullName && { helperText: errors.fullName.message })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='email'
                    value={value}
                    label='Email'
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='carterleonard@gmail.com'
                    aria-describedby='validation-schema-email'
                    {...(errors.email && { helperText: errors.email.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Password'
                    onChange={onChange}
                    id='validation-schema-password'
                    error={Boolean(errors.password)}
                    type={state.showPassword ? 'text' : 'password'}
                    {...(errors.password && { helperText: errors.password.message })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            <Icon fontSize='1.25rem' icon={state.showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='dob'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <DatePickerWrapper>
                    <DatePicker
                      selected={value}
                      showYearDropdown
                      showMonthDropdown
                      onChange={e => onChange(e)}
                      placeholderText='MM/DD/YYYY'
                      customInput={
                        <CustomInput
                          value={value}
                          onChange={onChange}
                          label='Date of Birth'
                          error={Boolean(errors.dob)}
                          aria-describedby='validation-basic-dob'
                          {...(errors.dob && { helperText: 'This field is required' })}
                        />
                      }
                    />
                  </DatePickerWrapper>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='address'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Address'
                    onChange={onChange}
                    placeholder='Jl Hr Agung'
                    error={Boolean(errors.address)}
                    aria-describedby='validation-schema-first-name'
                    {...(errors.address && { helperText: errors.address.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='phone_number'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Phone Number'
                    onChange={onChange}
                    placeholder='6285***'
                    error={Boolean(errors.phone_number)}
                    aria-describedby='validation-schema-phone_number'
                    {...(errors.phone_number && { helperText: errors.phone_number.message })}
                  />
                )}
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
                error={Boolean(errors.role)}
                aria-describedby='validation-schema-role'
                {...(errors.role && { helperText: errors.role.message })}
              >
                <MenuItem value='' disabled>
                  Select Role
                </MenuItem>
                {setValRole.map((data, i) => {
                  return (
                    <MenuItem key={i} value={data.id}>
                      {data.role_name}
                    </MenuItem>
                  )
                })}
              </CustomTextField>
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' variant='contained'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default FormValidationSchema
