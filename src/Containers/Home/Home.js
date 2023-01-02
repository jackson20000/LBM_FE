import Axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({

}));

export default function Home() {
    const classes = useStyles();
    const jwt = useSelector(state => state.user.jwt);
    const role = useSelector(state => state.user.role);
    const [activity, setactivity] = React.useState([]);
    const [pagination, setpagination] = React.useState({ pages: 1, current: 1 });
    const [count, setcount] = React.useState({});
    React.useEffect(() => {
        Axios({
            method: 'get',
            url: `http://localhost:4000/api/admin/dashboard/${pagination.current}`,
            headers: {
                'Authorization': 'Bearer ' + jwt,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                // handle success
                if (response.data?.success) {
                    setactivity(response.data?.activity);
                    setpagination(preval => ({ ...preval, pages: response.data?.pages }));
                    setcount(response.data?.count);
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
    }, [pagination.current]);

    if (role !== 'admin') return <Redirect to="/books" />

    return (
        <div style={{ padding: 50 }}>
            <h1>Dashboard</h1>
            <Grid container spacing={3}>
                <Grid item md={10}>
                    <TableContainer component={Paper}>
                        <h3 style={{ marginLeft: 20 }}>Recent User Activity</h3>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Info</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {activity.map((row) => (
                                    <TableRow key={row._id}>
                                        <TableCell component="th" scope="row">{row.info}</TableCell>
                                        <TableCell component="th" scope="row">{row.category}</TableCell>
                                        <TableCell>{new Date(row.time).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item md={2}>
                    <Paper style={{padding: 20, marginBottom: 20}}>
                        <Typography >Total Books: <br></br><span style={{fontSize: 28}}>{count?.book}</span></Typography>
                    </Paper >
                    <Paper style={{padding: 20}}>
                        <Typography >Total Users: <br></br><span style={{fontSize: 28}}>{count?.user}</span></Typography>
                    </Paper >
                </Grid>
            </Grid>

        </div>
    )
}
