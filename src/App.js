import React from "react";
import { Route, Switch } from "react-router-dom";
import ImagePage from "./pages/ImagePage";
import HomePage from "./pages/HomePage";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";

const theme = createMuiTheme({
  shadows: Array(25).fill("none"),
  palette: {
    primary: orange,
    secondary: orange
  },
  overrides: {
    MuiButton: {
      containedPrimary: {
        color: "white",
        borderRadius: "0"
      }
    }
  }
});

export default function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/images/:id" component={ImagePage} />
      </Switch>
    </MuiThemeProvider>
  );
}
