import React, { Component } from "react";
import awsconfig from "../aws-exports";
import Amplify, { Storage } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ImagePage from "./ImagePage.js";
import LinearProgress from "@material-ui/core/LinearProgress";

Amplify.configure(awsconfig);

Storage.configure({
  AWSS3: {
    bucket: "bojan-bucket-amplify",
    region: "us-east-1",
    level: "public"
  }
});

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  buttons: {
    display: "flex",
    width: "250px",
    justifyContent: "space-around",
    margin: "auto"
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: 500,
    height: 450
  }
});

class HomePage extends Component {
  state = {
    imageName: "",
    imageFile: "",
    response: "",
    images: [],
    progress: 0
  };

  getKeys() {
    Storage.list("", { level: "private" })
      .then(data => {
        this.setState({ images: data });
        this.setState({ progress: 0 });
      })
      .catch(err => {
        console.log("error fetching image", err);
      });
  }

  componentDidMount() {
    this.getKeys();
  }

  renderProgress = value => {
    if (value) {
      return (
        <LinearProgress variant="buffer" value={value} valueBuffer={100} />
      );
    }
  };

  uploadImage = () => {
    const cao = value => this.renderProgress(value);
    const up = this;
    Storage.put(`${this.upload.files[0].name}`, this.upload.files[0], {
      level: "private",
      contentType: this.upload.files[0].type,
      metadata: { test: "value" },
      progressCallback(progress) {
        cao(parseInt((progress.loaded / progress.total) * 100));
        up.setState({
          progress: parseInt((progress.loaded / progress.total) * 100)
        });
      }
    })
      .then(result => {
        this.upload = null;
        this.setState({ response: "Success uploading file!" });
        this.getKeys();
      })
      .catch(err => {
        console.log(err);
        this.setState({ response: `Cannot uploading file: ${err}` });
      });
  };

  render() {
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <AddAPhotoIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Upload Image
          </Typography>

          <form className={classes.form}>
            <input
              type="file"
              accept="image/png, image/jpeg"
              style={{ display: "none" }}
              ref={ref => (this.upload = ref)}
              onChange={e =>
                this.setState({
                  imageFile: this.upload.files[0],
                  imageName: this.upload.files[0].name
                })
              }
            />

            <TextField
              variant="outlined"
              margin="normal"
              value={this.state.imageName}
              placeholder="Select file"
              required
              fullWidth
            />

            <div className={classes.buttons}>
              <label htmlFor="raised-button-file">
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  component="span"
                  onClick={e => {
                    this.upload.value = null;
                    this.upload.click();
                  }}
                  loading={this.state.uploading}
                >
                  Browse
                </Button>
              </label>

              <label htmlFor="raised-button-file">
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  component="span"
                  onClick={this.uploadImage}
                >
                  Upload File
                </Button>
              </label>
            </div>

            <br />
            {this.renderProgress(this.state.progress)}
            <br />

            {this.state.progressPercent}

            {!this.state.response && <div>{this.state.response}</div>}
          </form>
        </div>

        <div className={classes.root}>
          <br />

          {this.state.images
            .sort(function(a, b) {
              var c = new Date(a.lastModified);
              var d = new Date(b.lastModified);
              return d - c;
            })
            .map(image => (
              <ImagePage
                id={image.key}
                key={image.key}
                date={image.lastModified}
              />
            ))}
        </div>
      </Container>
    );
  }
}

export default withAuthenticator(
  withStyles(styles)(HomePage),
  true,
  [],
  null,
  null,
  { hiddenDefaults: ["phone_number"] }
);
