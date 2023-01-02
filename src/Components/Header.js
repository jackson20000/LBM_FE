import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import { actions } from '../redux/user'

const useStyles = makeStyles(theme => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
        },
        li: {
            listStyle: 'none',
        },
    },
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    }
}))


export default function Header({ isLoggedIn }) {
    const dispatch = useDispatch()
    const classes = useStyles();
    const role = useSelector(state => state.user.role);

    const loginStatus = () => {
        return isLoggedIn ? (
            <Button component={RouterLink} to="/" onClick={() => dispatch(actions.logOut())} color="primary" variant="outlined" className={classes.link}>
                Logout
            </Button>) :
            (<Button component={RouterLink} to="/signin" color="primary" variant="outlined" className={classes.link}>
                Login
            </Button>
            )
    }

    return (
        <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                    Library Management
                </Typography>
                {isLoggedIn && <nav>

                    {role === 'admin' &&
                        <>
                            <Link component={RouterLink} to="/Home" variant="button" color="textPrimary" href="#" className={classes.link}>
                                Home
                            </Link>
                            <Link component={RouterLink} to="/renewReturn" variant="button" color="textPrimary" href="#" className={classes.link}>
                                Return/renew
                            </Link>
                            <Link component={RouterLink} to="/signup" variant="button" color="textPrimary" href="#" className={classes.link}>
                                Add User
                            </Link>
                            <Link component={RouterLink} to="/users" variant="button" color="textPrimary" href="#" className={classes.link}>
                                User List
                            </Link>
                            <Link component={RouterLink} to="/addBook" variant="button" color="textPrimary" href="#" className={classes.link}>
                                Add Book
                            </Link>
                        </>
                    }

                    <Link component={RouterLink} to="/books" variant="button" color="textPrimary" href="#" className={classes.link}>
                        Books
                    </Link>

                </nav>}
                {loginStatus()}
            </Toolbar>
        </AppBar>
    )
}