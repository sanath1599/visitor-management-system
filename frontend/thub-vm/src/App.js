import React from 'react'; 
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'; 
import { Login } from './components/auth/login'
import VisitorForm from './components/VisitorForm';  
import 'bootstrap/dist/css/bootstrap.min.css';   
import { urls } from './helpers/routes/urls';
import './App.css'; 
import Dashboard from './components/Dashboard';


function App() {
  return ( 
    <Router>   
      <Switch>
        <Route path={urls.LOGIN_URL}> 
            <Login/>
        </Route> 
        <Route path={urls.VISITOR_URL}>
              <VisitorForm/>
        </Route> 
        <Route exact path={urls.DASHBOARD}>
              <Dashboard/>
        </Route> 
        <Route path="/">
            <VisitorForm/>
        </Route>
      </Switch>
    </Router> 

    
  );
}

export default App;
