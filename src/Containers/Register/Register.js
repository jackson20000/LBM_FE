import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Link as RouterLink } from 'react-router-dom'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

import { FormControl, InputLabel, MenuItem, Select, TextareaAutosize } from '@material-ui/core'
import Axios from 'axios'
import { toast } from 'react-toastify'

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    formControl: {
        width: '100%',
    }
}))

export default function SignUp() {
    const isLoggedIn = useSelector(state => state.user.isLoggedIn && state.user.jwt !== null)
    const jwt = useSelector(state => state.user.jwt);
    const signupError = useSelector(state => state.user.signupError)
    const isSignupError = signupError ? true : false
    const classes = useStyles()

    const [values, setValues] = React.useState({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        gender: '',
        address: '',
    })


    const handleOnChange = (value, name) => {
        setValues({ ...values, [name]: value })
    }

    const signUp = (userObj, access_token) => {
        Axios({
            method: 'post',
            url: 'http://localhost:4000/api/auth/signup',
            data: userObj,
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                // handle success
                if (response.data) {
                    toast.success('User Added', {
                        position: "top-right",
                        autoClose: 5000,
                        closeOnClick: true,
                        pauseOnHover: true,
                    });
                    setValues({
                        username: '',
                        password: '',
                        email: '',
                        firstName: '',
                        lastName: '',
                        gender: '',
                        address: ''
                    });
                } else {
                    toast.error(response.data?.message || 'User Adding failed', {
                        position: "top-right",
                        autoClose: 5000,
                        closeOnClick: true,
                        pauseOnHover: true,
                    });
                }
            })
            .catch(function (error) {
                // handle error
                let errorMessage = 'Network Error'
                if (error.response) {
                    errorMessage = error.response.data.message
                    errorMessage = errorMessage === 'USERNAME_IS_NOT_AVAILABLE' ? 'Username/Email is not available' : errorMessage
                }
                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            })
    };

    if (!isLoggedIn) return <Redirect to="" />

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Add User
                </Typography>
                <form className={classes.form} onSubmit={() => signUp(values, jwt)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                value={values.firstName}
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                onChange={(e) => handleOnChange(e.target.value, e.target.name)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                value={values.lastName}
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                                onChange={(e) => handleOnChange(e.target.value, e.target.name)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                // margin="normal"
                                required
                                fullWidth
                                id="username"
                                value={values.username}
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => handleOnChange(e.target.value, e.target.name)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                value={values.password}
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => handleOnChange(e.target.value, e.target.name)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                // margin="normal"
                                required
                                fullWidth
                                id="email"
                                value={values.email}
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={(e) => handleOnChange(e.target.value, e.target.name)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="filled" className={classes.formControl}>
                                <InputLabel htmlFor="filled-age-native-simple">Gender</InputLabel>
                                <Select
                                    name="gender"
                                    fullWidth
                                    value={values.gender}
                                    required
                                    style={{ width: "100%" }}
                                    onChange={(e) => handleOnChange(e.target.value, e.target.name)}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'male'}>Male</MenuItem>
                                    <MenuItem value={'female'}>Female</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="filled" className={classes.formControl}>
                                <TextareaAutosize
                                    // maxRows={4}
                                    onChange={(e) => handleOnChange(e.target.value, e.target.name)}
                                    placeholder="Maximum 4 rows"
                                    name="address"
                                    style={{ width: '100%', height: 60 }}
                                    value={values.address}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            {isSignupError && <label style={{ color: 'red' }}>{signupError}</label>}
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => signUp(values, jwt)}
                    >
                        Sign Up
                    </Button>
                </form>
            </div>
        </Container>
    )
}