import React from 'react';
import { Box, Container, Typography, Button } from '@material-ui/core';
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

export default function RenewReturn(props) {
    const jwt = useSelector(state => state.user.jwt);
    const classes = useStyles();
    const [refresh, setrefresh] = React.useState(false)
    const [issuedBooks, setissuedBooks] = React.useState([]);
    const [pagination, setpagination] = React.useState({ pages: 1, current: 1 });
    const { user_id, name } = props?.location?.state || {};

    React.useEffect(() => {
        Axios({
            method: 'post',
            url: `http://localhost:4000/api/books/issue-list/${user_id ? user_id : 'all'}/${pagination.current}`,
            data: { },
            headers: {
                'Authorization': 'Bearer ' + jwt,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                // handle success
                if (response.data?.success) {
                    setissuedBooks(response.data?.issues);
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
    }, [pagination.current, refresh]);

    const RenewReturnBook = (type, item) => {
        const data = {
            "book_id": item?.book_id?._id,
            "user_id": item.user_id?._id
        }
        Axios({
            method: 'post',
            url: type === 'renew' ? 'http://localhost:4000/api/books/renew' : 'http://localhost:4000/api/books/return',
            data: data,
            headers: {
                'Authorization': 'Bearer ' + jwt,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            // handle success
            if (response.data?.success) {
                setrefresh(preVal=>!preVal);
                toast.success(response.data?.message, {
                    position: "top-right",
                    autoClose: 5000,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            } else {
                toast.error(response.data?.message || 'Error updating info', {
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
                        {name ? name : 'All'} Renewables/Returnables
                    </Typography>
                </Container>
            </Box>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Book</TableCell>
                            <TableCell>Issue date</TableCell>
                            <TableCell>Return date</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {issuedBooks.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell component="th" scope="row">{row?.book_id?.title}</TableCell>
                                <TableCell>{new Date(row.issueDate).toLocaleString()}</TableCell>
                                <TableCell>{new Date(row.returnDate).toLocaleString()}</TableCell>
                                <TableCell>{row?.book_id?.category}</TableCell>
                                <TableCell>{row?.user_id?.firstName + ' ' + row?.user_id?.lastName}</TableCell>
                                <TableCell>
                                    <Button color="primary" disabled={row?.isRenewed} onClick={() => RenewReturnBook('renew', row)}>Renew</Button>
                                    <Button color="secondary" onClick={() => RenewReturnBook('return', row)}>Return</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ width: '100%' }}>
                {issuedBooks.length === 0 && <p style={{ justifyContent: 'center', padding: '20 0', textAlign: 'center' }}>No Issued Books</p>}
            </div>
            <div style={{ justifyContent: 'center', padding: '20 0', width: '100%', marginTop: 20 }}>
                {pagination?.pages > 1 && <Pagination onChange={(e, p) => setpagination(pre => ({ ...pre, current: p }))} count={pagination.pages} variant="outlined" shape="rounded" />}
            </div>
        </Container>
    )
}
