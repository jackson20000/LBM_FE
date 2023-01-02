import { Card, Container, CardContent, Grid, Button } from '@material-ui/core';
import Axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import IssueBookModal from '../../Components/IssueBookModal';

export default function BookDetails(props) {
    const jwt = useSelector(state => state.user.jwt);
    const role = useSelector(state => state.user.role);
    let { state } = props?.location;
    const history = useHistory();
    const [open, setopen] = React.useState(false);
    const gotoBooks = () => history.push('/books');

    if(!state){
        gotoBooks();
    }
    const [data] = React.useState(state);

    const issueBook = ({ id }) => {
        if (id) {
            Axios({
                method: 'post',
                url: `http://localhost:4000/api/books/issue`,
                data: { book_id: data?._id, user_id: id },
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

    return (
        <Container style={{ marginTop: 20 }} >
            <Grid style={{justifyContent: 'center' }}>
                <Button onClick={gotoBooks}>Back</Button>
                {role==='admin' && <Button onClick={() => setopen(true)}>Issue Book</Button>}
                <Grid item md={10}>
                    <Card className="card" style={{padding: 30}}>
                        <h1 style={{ textAlign: 'center' }}>{data?.title}</h1>
                        <p className="text-muted px-3 py-2">Author :  <b>{data?.author}</b> </p>
                        <p className="text-muted px-3 py-2">ISBN :  <b>{data?.ISBN}</b> </p>
                        <p className="text-muted px-3 py-2">Category :  <b>{data?.category}</b></p>
                        <p className="text-muted px-3 py-2">In Stock :  <b>{data?.stock}</b></p>
                        <CardContent>
                            <h4 className="text-muted px-3 py-2">Description</h4>
                            <p className="card-text">{data?.description}</p>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <IssueBookModal {...{ open, handleClose: () => setopen(!open), handleSubmit: issueBook }} />
        </Container>
    )
}
