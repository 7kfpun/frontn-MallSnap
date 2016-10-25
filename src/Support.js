// import FileReaderInput from 'react-file-reader-input';
import React, { Component } from 'react';
import { teal600 } from 'material-ui/styles/colors';
import { withRouter } from 'react-router';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import Iframe from 'react-iframe';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './Support.css';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: teal600,
  },
});

class Support extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Iframe url="https://webchat.botframework.com/embed/QNA?s=4khMcLPLx9Y.cwA.hXE.v1LoSKpLvL2uns4KVzUr5T5q3ywtnQfgfPAgzg3bcqw" width={"100%"} height={"100%"} />
          <IconButton className="Support-close" onTouchTap={() => this.props.router.push('/')}><CloseIcon color='white' /></IconButton>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(Support);
