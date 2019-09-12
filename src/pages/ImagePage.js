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

    return (
      <article className="post">
        <header>
          <div className="post-user">
            <div className="post-user-avatar">
              <img
                src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"
                alt=""
              />
            </div>
            <div className="post-user-nickname">
              <span>{this.state.user.username}</span>
            </div>
          </div>
        </header>
        <div className="post-image">
          <div className="post-image-bg">
            <S3Image level="private" imgKey={id} />
          </div>
        </div>
        <div className="post-caption">
          <p> Name: {id}</p>
          <p> Date: {lastModified} </p>
        </div>
      </article>
    );
  }
}

export default HomePage;
