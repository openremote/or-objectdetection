import React from 'react';
import logo from 'assets/notfound.gif'

class NotFound extends React.Component {
    render() {
        return(
            <div>
                <img src={logo} alt="loading..." />
            </div>
        )
    }
}

export default NotFound;