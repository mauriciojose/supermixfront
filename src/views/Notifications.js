/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";


class Notifications extends React.Component {
  
  constructor(props){
    super(props)
    this.notificationAlertRef = React.createRef();
  }
  
  notify(place, type, msg){
    // var color = Math.floor(Math.random() * 5 + 1);
    // var type;
    // switch (color) {
    //   case 1:
    //     type = "primary";
    //     break;
    //   case 2:
    //     type = "success";
    //     break;
    //   case 3:
    //     type = "danger";
    //     break;
    //   case 4:
    //     type = "warning";
    //     break;
    //   case 5:
    //     type = "info";
    //     break;
    //   default:
    //     break;
    // }
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            {msg}
          </div>
        </div>
      ),
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: 7,
    };
    this.notificationAlertRef.current.notificationAlert(options);
  }

  render(){
    return (
      <>
        <div className="content-alert">
          <div className="react-notification-alert-container">
            <NotificationAlert ref={this.notificationAlertRef} />
          </div>
  
        </div>
      </>
    );
  }
}

export {Notifications};
