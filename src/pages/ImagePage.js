import React, { Component } from "react";
import { S3Image } from "aws-amplify-react";
import "./Image.css";
import { Auth } from "aws-amplify";
import moment from "moment";

class HomePage extends Component {
  state = { user: {} };

  componentDidMount() {
    Auth.currentAuthenticatedUser().then(user => {
      this.setState({ user });
    });
  }

  render() {
    const id = this.props.id ? this.props.id : this.props.match.params.id;
    const lastModified = moment(this.props.date).format("YYYY/MM/DD");
    // Mon Aug 26 2019 16:14:33 GMT+0200 (Central European Summer Time)
    return (
      <article className="Post">
        <header>
          <div className="Post-user">
            <div className="Post-user-avatar">
              <img
                src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"
                alt=""
              />
            </div>
            <div className="Post-user-nickname">
              <span>{this.state.user.username}</span>
            </div>
          </div>
        </header>
        <div className="Post-image">
          <div className="Post-image-bg">
            <S3Image level="private" imgKey={id} />
          </div>
        </div>
        <div className="Post-caption">
          <p> Name: {id}</p>
          <p> Date: {lastModified} </p>
        </div>
      </article>
    );
  }
}

export default HomePage;
