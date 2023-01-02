import React from 'react';
import { Box, Container, Typography, InputBase, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Pagination from '@material-ui/lab/Pagination';

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
    },
}));

export default function UserList() {
    const jwt = useSelector(state => state.user.jwt);
    const classes = useStyles();
    const history = useHistory();
    const [searchTerm, setsearchTerm] = React.useState('');
    const [refresh, setrefresh] = React.useState(false)
    const [users, setusers] = React.useState([]);
    const [pagination, setpagination] = React.useState({ pages: 1, current: 1 });

    React.useEffect(() => {
        Axios({
            method: 'post',
            url: `http://localhost:4000/api/admin/users/${pagination.current}`,
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
                    setusers(response.data?.users);
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
                }
                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            })
    }, [searchTerm, pagination.current, refresh]);

    const gotorenew = (data) => {
        history.push({
            pathname: '/renewReturn',
            state: { user_id: data?._id, name: `${data?.firstName}'s` }
        });
    };

    const deleteUser = (id) => {
        Axios({
            method: 'delete',
            url: `http://localhost:4000/api/users/user/delete-profile/${id}`,
            headers: {
                'Authorization': 'Bearer ' + jwt,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                // handle success
                if (response.data?.success) {
                    setrefresh(preVal=>!preVal);
                    toast.success(response.data?.message || 'User Deleted', {
                        position: "top-right",
                        autoClose: 5000,
                        closeOnClick: true,
                        pauseOnHover: true,
                    });
                } else {
                    toast.error(response.data?.message || 'Error deleting user', {
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
    };

    return (
        <Container>
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    pt: 3,
                    pb: 3,
                }}
            >
                <Container maxWidth="sm" style={{ marginBottom: 15 }}>
                    <Typography
                        component="h4"
                        variant="h4"
                        align="center"
                        color="text.primary"
                        gutterBottom
                    >
                        Search Users
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
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>User name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Date Regisetered</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell component="th" scope="row">{row.firstName}</TableCell>
                                <TableCell component="th" scope="row">{row.lastName}</TableCell>
                                <TableCell component="th" scope="row">{row.username}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.gender}</TableCell>
                                <TableCell>{new Date(row.joined).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button color="primary" onClick={() => gotorenew(row)}>issued Books</Button>
                                    <Button color="secondary" onClick={() => deleteUser(row?._id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ width: '100%' }}>
                {users.length === 0 && <p style={{ justifyContent: 'center', padding: '20 0', textAlign: 'center' }}>No Users Found</p>}
            </div>
            <div style={{ justifyContent: 'center', padding: '20 0', width: '100%', marginTop: 20 }}>
                {pagination?.pages > 1 && <Pagination onChange={(e, p) => setpagination(pre => ({ ...pre, current: p }))} count={pagination.pages} variant="outlined" shape="rounded" />}
            </div>
        </Container>
    )
}
