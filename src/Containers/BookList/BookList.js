import React from 'react';
import { Box, Container, Grid, Typography, Card, Button, CardActions, CardContent, InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Axios from 'axios';
import Pagination from '@material-ui/lab/Pagination';
import { useHistory } from 'react-router-dom';
import IssueBookModal from '../../Components/IssueBookModal';

const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: '#e0e0e0',
        '&:hover': {
            backgroundColor: '#e0e0ee',
        },
        marginLeft: 0,
        width: '100%',
        //   [theme.breakpoints.up('sm')]: {
        //     marginLeft: theme.spacing(1),
        //     width: 'auto',
        //   },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        //   [theme.breakpoints.up('sm')]: {
        //     width: '12ch',
        //     '&:focus': {
        //       width: '20ch',
        //     },
        //   },
    },
}));

export default function BookList() {
    const jwt = useSelector(state => state.user.jwt);
    const role = useSelector(state => state.user.role);

    const classes = useStyles();
    const history = useHistory();
    const [searchTerm, setsearchTerm] = React.useState('');
    const [books, setbooks] = React.useState([]);
    const [pagination, setpagination] = React.useState({ pages: 1, current: 1 });
    const [open, setopen] = React.useState(false);
    const [book_id, setbook_id] = React.useState(null);

    React.useEffect(() => {
        Axios({
            method: 'post',
            url: `http://localhost:4000/api/books/search/${pagination.current}`,
            data: { "search": searchTerm },
            headers: {
                'Authorization': 'Bearer ' + jwt,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                // handle success
                if (response.data?.success) {
                    setbooks(response.data?.books);
                    setpagination(preval => ({ ...preval, pages: response.data?.pages }));
                } else {
                    toast.error(response.data?.message || 'Error getting data', {
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
    }, [searchTerm, pagination.current]);

    const gotoDetails = (data) => {
        history.push({
            pathname: '/bookdetail',
            state: data
        });
    };

    const issueBook = ({ id }) => {
        if (id) {
            Axios({
                method: 'post',
                url: `http://localhost:4000/api/books/issue`,
                data: { book_id, user_id: id },
                headers: {
                    'Authorization': 'Bearer ' + jwt,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    // handle success
                    if (response.data?.success) {
                        setopen(false);
                        setbook_id(null);
                        toast.success(response.data?.message || 'Book issued successfully', {
                            position: "top-right",
                            autoClose: 5000,
                            closeOnClick: true,
                            pauseOnHover: true,
                        });
                    } else {
                        toast.error(response.data?.message || 'Error issueing book', {
                            position: "top-right",
                            autoClose: 5000,
                            closeOnClick: true,
                            pauseOnHover: true,
                        });
                    }
                })
                .catch(function (error) {
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
    };

    function truncateString(str, n) {
        if (str.length > n) {
          return str.substring(0, n) + "...";
        } else {
          return str;
        }
      }


    return (
        <div>
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    pt: 8,
                    pb: 6,
                }}
            >
                <Container maxWidth="sm" style={{ marginBottom: 25 }}>
                    <Typography
                        component="h4"
                        variant="h4"
                        align="center"
                        color="text.primary"
                        gutterBottom
                    >
                        Search Book
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            value={searchTerm}
                            onChange={(e) => setsearchTerm(e.target.value)}
                        />
                    </div>
                </Container>
            </Box>
            <Container sx={{ py: 8 }} maxWidth="md">
                <Grid container spacing={4}>
                    {books.map((item, i) => (
                        <Grid item key={i} xs={12} sm={6} md={4}>
                            <Card
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="h6">
                                        {item?.title}
                                    </Typography>
                                    <Typography gutterBottom variant="p" component="p">
                                        ISBN: {item?.ISBN}
                                    </Typography>
                                    <Typography>
                                        {truncateString(item?.description,50)}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => gotoDetails(item)} >View</Button>
                                    {role === 'admin' && <Button size="small">Edit</Button>}
                                    {role === 'admin' && <Button size="small" onClick={() => { setopen(true); setbook_id(item?._id) }}>Issue Book</Button>}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                    <div style={{ width: '100%' }}>
                        {books.length === 0 && <p style={{ textAlign: 'center' }}>No Books Found</p>}
                    </div>
                </Grid>
                <div style={{ justifyContent: 'center', padding: '40px 0', width: '100%' }}>
                    {pagination?.pages > 1 && <Pagination onChange={(e, p) => setpagination(pre => ({ ...pre, current: p }))} count={pagination.pages} variant="outlined" shape="rounded" />}
                </div>
                <IssueBookModal {...{ open, handleClose: () => setopen(!open), handleSubmit: issueBook }} />
            </Container>
        </div>
    )
}
