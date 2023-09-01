import React, { Component } from 'react';

export default class App extends Component {
    static displayName = App.name;

    database = [
        {
            username: "user1",
            password: "pass1"
        },
        {
            username: "user2",
            password: "pass2"
        }
    ];

    errors = {
        uname: "invalid username",
        pass: "invalid password"
    };

    constructor(props) {
        super(props);
        this.state = {
            forecasts: [],
            loading: true,
            errorMessages: {
                name: "pass",
                message: ""
            },
            //setErrorMessages: '',
            isSubmitted: false,
            pageView: false
        };
    }

    setIsSubmitted = (boolVal) => {
        sessionStorage.setItem("pageView", boolVal);
    };

    setErrorMessages = (name) => {
        this.renderErrorMessage(name);
    };

    handleSubmit = (event) => {

        //Prevent page reload
        event.preventDefault();

        var { uname, pass } = document.forms[0];

        // Find user login info
        const userData = this.database.find((user) => user.username === uname.value);

        // Compare user info
        if (userData) {
            if (userData.password !== pass.value) {
                // Invalid password
                this.setErrorMessages({ name: "pass", message: this.errors.pass });
            } else {
                this.setIsSubmitted(true);
                this.forceUpdate();
            }
        } else {
            // Username not found
            this.setErrorMessages({ name: "uname", message: this.errors.uname });
        }
    };

    renderErrorMessage = (name) => {
        //window.alert(name.name + " : " + name.message)
        window.alert(this.state.errorMessages.name)

        name.name === this.state.errorMessages.name && (
            <div className="error">{this.state.errorMessages.message}</div>
        );
    }

    componentDidMount() {
        this.populateWeatherData();
    }

    static renderForecastsTable(forecasts) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr key={forecast.date}>
                            <td>{forecast.date}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {

        let renderForm = (
            <div className="form">
                <form onSubmit={this.handleSubmit}>
                    <div className="input-container">
                        <label>Username </label>
                        <input type="text" name="uname" required />
                        {this.renderErrorMessage("uname")}
                    </div>
                    <div className="input-container">
                        <label>Password </label>
                        <input type="password" name="pass" required />
                        {this.renderErrorMessage("pass")}
                    </div>
                    <div className="button-container">
                        <input type="submit" />
                    </div>
                </form>
            </div>
        );

        let contents = this.state.loading
            ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
            : App.renderForecastsTable(this.state.forecasts);

        return (
            <div className="app">
                <div className="login-form">
                    <div className="title">Sign In</div>
                    {this.state.isSubmitted = sessionStorage.getItem("pageView")}
                    {this.state.isSubmitted ? contents : renderForm}
                </div>
            </div>
        );
    }

    async populateWeatherData() {
        const response = await fetch('weatherforecast');
        const data = await response.json();
        this.setState({ forecasts: data, loading: false });
    }
}
