import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import AutoComplete from './AutoComplete';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function IssueBookModal({ open, handleClose, handleSubmit }) {
    const [selectedUser, setselectedUser] = React.useState({});
    const _submit = () => {
        handleSubmit(selectedUser);
        setselectedUser({});
    }
    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">Issue Book</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Select the user to issue book
                    </DialogContentText>
                    <AutoComplete {...{ setselectedUser }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="danger">
                        Cancel
                    </Button>
                    <Button onClick={_submit} color="primary">
                        Issue Book
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
