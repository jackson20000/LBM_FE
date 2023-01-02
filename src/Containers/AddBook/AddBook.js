import React from 'react';
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { FormControl, InputLabel, MenuItem, Select, TextareaAutosize } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import { toast } from 'react-toastify';

const category = ["Science", "Biology", "Physics", "Chemistry", "Novel", "Travel", "Cooking", "Philosophy", "Mathematics", "Ethics", "Technology"];

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


export default function AddBook() {
    const classes = useStyles();
    const jwt = useSelector(state => state.user.jwt);

    const [formfields, setformfields] = React.useState({
        title: "",
        ISBN: "",
        stock: 0,
        author: "",
        description: "",
        category: ""
    });


    const handleOnChange = (value, name) => {
        setformfields({ ...formfields, [name]: value })
    };


    const submit = () => {
        Axios({
            method: 'post',
            url: 'http://localhost:4000/api/books/new',
            data: formfields,
            headers: {
                'Authorization': 'Bearer ' + jwt,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                // handle success
                if (response.data?.success) {
                    toast.success('Book Added', {
                        position: "top-right",
                        autoClose: 5000,
                        closeOnClick: true,
                        pauseOnHover: true,
                    });
                    setformfields({
                        title: "",
                        ISBN: "",
                        stock: 0,
                        author: "",
                        description: "",
                        category: ""
                    })
                } else {
                    toast.error(response.data?.message || 'Book Adding failed', {
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
                }
                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            })
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Add Book
                </Typography>
                <form className={classes.form} onSubmit={submit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="title"
                                variant="outlined"
                                required
                                fullWidth
                                id="title"
                                label="Book Title"
                                value={formfields.title}
                                autoFocus
                                onChange={(e) => handleOnChange(e.target.value, e.target.name)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="ISBN"
                                value={formfields.ISBN}
                                label="ISBN"
                                name="ISBN"
                                autoComplete="ISBN"
                                onChange={(e) => handleOnChange(e.target.value, e.target.name)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                value={formfields.author}
                                id="Author Name"
                                label="Author Name"
                                name="author"
                                autoComplete="Author Name"
                                autoFocus
                                onChange={(e) => handleOnChange(e.target.value, e.target.name)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="filled" className={classes.formControl}>
                                <InputLabel htmlFor="filled-age-native-simple">Category</InputLabel>
                                <Select
                                    name="category"
                                    value={formfields.category}
                                    fullWidth
                                    required
                                    style={{ width: "100%" }}
                                    onChange={(e) => handleOnChange(e.target.value, e.target.name)}
                                >
                                    <MenuItem value="">
                                        <em>Select One</em>
                                    </MenuItem>
                                    {category.map((v, i) => <MenuItem key={i} value={v}>{v}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                value={formfields.stock}
                                type="number"
                                label="Stock"
                                name="stock"
                                onChange={(e) => handleOnChange(e.target.value, e.target.name)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="filled" className={classes.formControl}>
                                <TextareaAutosize
                                    onChange={(e) => handleOnChange(e.target.value, e.target.name)}
                                    placeholder="Book Description"
                                    name="description"
                                    value={formfields.description}
                                    style={{ width: '100%', height: 60 }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={submit}
                    >
                        Add Book
                    </Button>
                </form>
            </div>
        </Container>
    )
}
