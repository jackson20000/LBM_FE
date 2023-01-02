import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'

import Container from '@material-ui/core/Container'
import SignIn from './SignIn/SignIn'
import Register from './Register/Register'
import Public from './PublicPage/Public'
import NotFound from './NotFound/NotFound'
import Header from '../Components/Header'
import AddBook from './AddBook/AddBook'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import BookList from './BookList/BookList'
import BookDetails from './BookDetails/BookDetails'
import UserList from './UserList/UserList'
import RenewReturn from './RenewReturn/RenewReturn'
import Home from './Home/Home'
export default function App() {

  const isLoggedIn = useSelector(state => state.user.isLoggedIn && state.user.jwt !== null)

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      isLoggedIn === true
        ? <Component {...props} />
        : <Redirect to='/signin' />
    )} />
  )

  return (
    <Container style={{padding: 0, width: "100%", maxWidth:'unset'}}>
      <Header isLoggedIn={isLoggedIn} />
      <Switch>
        <Route path='/' component={SignIn} exact />
        <Route path="/signin" component={SignIn} />
        <PrivateRoute path="/Home" component={Home} />
        <PrivateRoute path="/signup" component={Register} />
        <PrivateRoute path="/addBook" component={AddBook} />
        <PrivateRoute path="/users" component={UserList} />
        <PrivateRoute path="/books" component={BookList} />
        <PrivateRoute path="/bookdetail" component={BookDetails} />
        <PrivateRoute path="/renewReturn" component={RenewReturn} />
        <Route component={NotFound} />
      </Switch>
      <ToastContainer />
    </Container>
  )
}
