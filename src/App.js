// import FileReaderInput from 'react-file-reader-input';
import React, { Component } from 'react';
import { BottomNavigation } from 'material-ui/BottomNavigation';
import { Card, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Flex, Box } from 'reflexbox'
import { grey400 } from 'material-ui/styles/colors';
import { List, ListItem } from 'material-ui/List';
import { teal600 } from 'material-ui/styles/colors';
import { withRouter } from 'react-router';
import CameraAltIcon from 'material-ui/svg-icons/image/camera-alt';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import DoneIcon from 'material-ui/svg-icons/action/done';
import Drawer from 'material-ui/Drawer';
import FacebookProvider, { Like } from 'react-facebook';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import Iframe from 'react-iframe';
import LaunchIcon from 'material-ui/svg-icons/action/launch';
import Measure from 'react-measure';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import SentimentSatisfiedIcon from 'material-ui/svg-icons/social/sentiment-satisfied';
import Subheader from 'material-ui/Subheader';
import Webcam from 'react-webcam';

import results from './results';

import './App.css';
import adsImage from './ads.jpg';
import scanImage from './scan.png';

const styles = {
  // title: {
  //   cursor: 'pointer',
  //   fontSize: 18,
  // },
  cameraIcon: {
    width: 48,
    height: 48,
  },
};


const muiTheme = getMuiTheme({
  palette: {
    accent1Color: teal600,
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      screenshot: null,
      file: '',
      imagePreviewUrl: '',
      response: {},
      status: 'nothing',
      drawerOpen: false,
      secondDrawerOpen: false,
      result: 'casetify',
      open: false,
    };
  }

  componentDidMount() {
    console.log('hasBasicSupport', this.hasBasicSupport());
    console.log('hasGetUserMedia', this.hasGetUserMedia());
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  hasBasicSupport() {
    var a = {
      canvas: function() {
        var a = document.createElement("canvas");
        return !(!a.getContext || !a.getContext("2d"))
      },
      FormData: function() {
        return "function" === typeof FormData || "object" === typeof FormData
      },
      fileReader: function() {
        return window.File && window.FileReader && window.FileList && window.Blob
      }
    };
    var b = true;
    var c = new Uint8Array([]);
    try {
        new Blob([c], {
            type: "text/plain"
        })
    } catch (d) {
        b = false
    }
    return a.canvas() && a.FormData() && a.fileReader() && b
  }

  uploadImage(imageFile) {
    return new Promise((resolve, reject) => {
      let imageFormData = new FormData();

      imageFormData.append('image', imageFile);
      imageFormData.append('token', 'ec00729699ae451a');

      var xhr = new XMLHttpRequest();

      xhr.open('post', 'https://search.craftar.net/v1/search', true);

      xhr.onload = function () {
        if (this.status === 200) {
          resolve(JSON.parse(this.response));
        } else if (this.status === 400) {
          resolve(JSON.parse(this.response));
        } else {
          reject(this.statusText);
        }
      };

      xhr.send(imageFormData);
    });
  }

  dataUrlToBlob(a) {
    for (var b = atob(a.split(",")[1]), c = [], d = 0; d < b.length; d++) c.push(b.charCodeAt(d));
    return new Blob([new Uint8Array(c)], {
      type: "image/jpg"
    })
  }

  _handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    console.log('handle uploading-', this.state.file);
    // this.uploadImage(this.state.file);
    const that = this;
    this.craftarUpload(this.state.file,  (dataUrl) => {
      that.uploadImage(that.dataUrlToBlob(dataUrl))
        .then((response) => {
          that.setState({ status: 'done upload' });
          console.log('Response', response);
          // {"search_time": 75, "results": [{"item": {"name": "casetify", "url": "https://www.casetify.com/", "custom": "https://crs-beta-catchoom.s3.amazonaws.com/collections/9e21805b6d0f40e5959f847af5f3c85e/metadata/ede3332ad26849949568de876da3140e.json", "content": null, "trackable": false, "uuid": "ede3332ad26849949568de876da3140e"}, "image": {"thumb_120": "https://crs-beta-catchoom.s3.amazonaws.com/cache/collections/9e21805b6d0f40e5959f847af5f3c85e/images/ede3332ad26849949568de876da3140e_1a62f389be8543a89b7b881c17d368b8_thumb_120.jpe", "uuid": "1a62f389be8543a89b7b881c17d368b8"}, "score": 69}]}
          if (response.results && response.results.length > 0) {
            that.setState({
              result: response.results[0].item.name,
              open: true,
            });
          } else if (response.results && response.results.length === 0) {
            alert('No results');
          } else {
            alert(JSON.stringify(response));
          }
          that.setState({ response });
        });
    });
  }

  craftarUpload(file, callback) {
    const that = this;
    // Create an image
    var img = document.createElement("img");
    // Create a file reader
    var reader = new FileReader();
    // Set the image once loaded into file reader
    that.setState({ status: 'before compressing' });
    reader.onload = function(e)
    {
      that.setState({ status: 'start compressing' });
      img.src = e.target.result;

      var canvas = document.createElement("canvas");
      var MAX_WIDTH = 180;
      var MAX_HEIGHT = 180;
      var width = img.width;
      var height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      // ctx.fillStyle = '#fff';  /// set white fill style
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.5);

      if (callback && typeof(callback) === "function") {
        callback(dataUrl)
      }
      // setTimeout((dataurl) => {
      //   that.uploadImage(that.dataUrlToBlob(dataUrl))
      //   .then((response) => {
      //     that.setState({ status: 'done upload' });
      //     console.log('Response', response);
      //     // {"search_time": 75, "results": [{"item": {"name": "casetify", "url": "https://www.casetify.com/", "custom": "https://crs-beta-catchoom.s3.amazonaws.com/collections/9e21805b6d0f40e5959f847af5f3c85e/metadata/ede3332ad26849949568de876da3140e.json", "content": null, "trackable": false, "uuid": "ede3332ad26849949568de876da3140e"}, "image": {"thumb_120": "https://crs-beta-catchoom.s3.amazonaws.com/cache/collections/9e21805b6d0f40e5959f847af5f3c85e/images/ede3332ad26849949568de876da3140e_1a62f389be8543a89b7b881c17d368b8_thumb_120.jpe", "uuid": "1a62f389be8543a89b7b881c17d368b8"}, "score": 69}]}
      //     if (response.results && response.results.length > 0) {
      //       that.setState({
      //         result: response.results[0].item.name,
      //         open: true,
      //       });
      //     } else if (response.results && response.results.length == 0) {
      //     } else {
      //       alert(JSON.stringify(response));
      //     }
      //     that.setState({ response });
      //   });
      // }, 1000);
    }

    // Load files into file reader
    reader.readAsDataURL(file);
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      });
    }

    reader.readAsDataURL(file)
  }

  hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  renderWebcam() {
    return (
      <Flex column>
        <Box>
          <Measure>
          { dimensions =>
            <div>
              <Webcam
                ref={(webcam) => {
                  this.webcam = webcam;
                }}
                height={window.innerHeight - 130}
                width={dimensions.width}
                audio={false}
                screenshotFormat="image/jpeg"
              />
            </div>
          }
          </Measure>
        </Box>
        <Box>
          <FlatButton
            icon={<CameraAltIcon color={grey400} style={styles.cameraIcon} />}
            style={{ height: 70 }}
            onTouchTap={() => this.screenshot()}
          />
        </Box>

        {/* this.state.screenshot ? <img alt="screenshot" src={this.state.screenshot} /> : null */}
      </Flex>
    );
  }

  renderPickImage() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img alt="preview" className="image-wrapper-preview" src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<img alt="pick" className="image-wrapper" src={scanImage} />);
    }

    return (
      <div className="App-intro">
        {$imagePreview}
        <Flex column>
          <Box pt={1}>
            <form onSubmit={(e)=>this._handleSubmit(e)} className="App-camera">
              <Flex px={2} align='center'>
                <Box px={1} flexAuto>
                  {this.state.imagePreviewUrl && <IconButton iconStyle={{ color: 'red' }} onClick={() => this.setState({ imagePreviewUrl: '' })}>
                    <ClearIcon />
                  </IconButton>}
                </Box>
                <Box px={1} flexAuto>
                  <FlatButton
                    icon={<CameraAltIcon color={grey400} style={styles.cameraIcon} />}
                    style={{ height: 70 }}
                    onTouchTap={() => this.refs.fileUploader.click()}
                  />
                </Box>
                <Box px={1} flexAuto>
                  {this.state.imagePreviewUrl && <IconButton iconStyle={{ color: 'green' }} type="submit" onClick={(e) => this._handleSubmit(e)}>
                    <DoneIcon />
                  </IconButton>}
                </Box>
                <input className="fileInput" hidden type="file" ref="fileUploader" accept="image/*" onChange={(e)=>this._handleImageChange(e)} />
              </Flex>
            </form>
          </Box>
        </Flex>

        {/* <FileReaderInput as="binary" accept="image/*" id="my-file-input" onChange={(event, results) => this.selectPhoto(event, results)}>
          <FlatButton
            backgroundColor="#a4c639"
            hoverColor="#8AA62F"
            icon={<CameraIcon color={fullWhite} style={styles.cameraIcon} />}
            style={{ height: 70 }}
          />
        </FileReaderInput> */}
      </div>
    );
  }

  screenshot() {
    const that = this;
    const screenshot = this.webcam.getScreenshot();
    this.setState({ screenshot });
    this.craftarUpload(this.dataUrlToBlob(screenshot), (dataUrl) => {
      that.uploadImage(that.dataUrlToBlob(dataUrl))
        .then((response) => {
          that.setState({ status: 'done upload' });
          console.log('Response', response);
          // {"search_time": 75, "results": [{"item": {"name": "casetify", "url": "https://www.casetify.com/", "custom": "https://crs-beta-catchoom.s3.amazonaws.com/collections/9e21805b6d0f40e5959f847af5f3c85e/metadata/ede3332ad26849949568de876da3140e.json", "content": null, "trackable": false, "uuid": "ede3332ad26849949568de876da3140e"}, "image": {"thumb_120": "https://crs-beta-catchoom.s3.amazonaws.com/cache/collections/9e21805b6d0f40e5959f847af5f3c85e/images/ede3332ad26849949568de876da3140e_1a62f389be8543a89b7b881c17d368b8_thumb_120.jpe", "uuid": "1a62f389be8543a89b7b881c17d368b8"}, "score": 69}]}
          if (response.results && response.results.length > 0) {
            that.setState({
              result: response.results[0].item.name,
              open: true,
            });
          } else if (response.results && response.results.length === 0) {
            alert('No results');
          } else {
            alert(JSON.stringify(response));
          }
          that.setState({ response });
        });
    });
  }

  selectPhoto(event, results) {
    results.forEach(result => {
      const [_, file] = result;

      const that = this;
      const reader = new window.FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function() {
        const base64data = reader.result;
        that.setState({ imagePreviewUrl: base64data });
      }
      this.setState({
        file: file,
        status: 'Before craftar ' + file.name
      });
      console.log('file', file);
      this.craftarUpload(file, (dataUrl) => {
        that.uploadImage(that.dataUrlToBlob(dataUrl))
          .then((response) => {
            console.log('Response', response, response.results.length);
            // {"search_time": 75, "results": [{"item": {"name": "casetify", "url": "https://www.casetify.com/", "custom": "https://crs-beta-catchoom.s3.amazonaws.com/collections/9e21805b6d0f40e5959f847af5f3c85e/metadata/ede3332ad26849949568de876da3140e.json", "content": null, "trackable": false, "uuid": "ede3332ad26849949568de876da3140e"}, "image": {"thumb_120": "https://crs-beta-catchoom.s3.amazonaws.com/cache/collections/9e21805b6d0f40e5959f847af5f3c85e/images/ede3332ad26849949568de876da3140e_1a62f389be8543a89b7b881c17d368b8_thumb_120.jpe", "uuid": "1a62f389be8543a89b7b881c17d368b8"}, "score": 69}]}
            if (response.results && response.results.length > 0) {
              that.setState({
                result: response.results[0].item.name,
                open: true,
              });
            } else if (response.results && response.results.length === 0) {
              alert('No results');
            } else {
              alert(JSON.stringify(response));
            }
            that.setState({ response });
          });
      });
    });
  }

  render() {
    let actions = [];
    if (this.state.result && results[this.state.result].action === 'link') {
      actions = [
        <FlatButton
          label='取消'
          primary={true}
          onTouchTap={this.handleClose}
        />,
        <FlatButton
          label={results[this.state.result].actionText}
          primary={true}
          onTouchTap={this.handleClose}
          href={results[this.state.result].actionData}
        />,
      ];
    } else if (this.state.result && results[this.state.result].action === 'save') {
      actions = [
        <FlatButton
          label='取消'
          primary={true}
          onTouchTap={this.handleClose}
        />,
        <FlatButton
          label={results[this.state.result].actionText}
          primary={true}
          onTouchTap={this.handleClose}
          download
          href={results[this.state.result].actionData}
        />,
      ];
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <Dialog
            actions={actions}
            modal={false}
            contentStyle={{
              width: '100%',
              maxWidth: 'none',
            }}
            onRequestClose={this.handleClose}
            open={this.state.open}
            autoScrollBodyContent={true}
          >
            <Card>
              <CardMedia>
                <img alt="card-media" src={results[this.state.result].image} />
              </CardMedia>
              <CardHeader
                title={results[this.state.result].title}
                subtitle={results[this.state.result].subtitle}
                avatar={results[this.state.result].avatar}
              />
              <CardTitle title={results[this.state.result].couponTitle} subtitle={results[this.state.result].couponSubtitle} />
              <CardText>
                {results[this.state.result].body}
              </CardText>
            </Card>
          </Dialog>

          <Paper className="App-header" zDepth={1}>
            <BottomNavigation selectedIndex={this.state.selectedIndex} style={{ backgroundColor: '#4DB6AC' }}>
              <FlatButton style={{ color: 'white', marginTop: 10 }} label="使用步驟" onTouchTap={() => this.setState({ drawerOpen: !this.state.drawerOpen })} />
              <h3 style={{ color: 'white' }}>Super Mall</h3>
              <FlatButton style={{ color: 'white', marginTop: 10, fontSize: 6 }} label="關於 AnySnap" onTouchTap={this.handleOpen} />
            </BottomNavigation>
          </Paper>

          {/* this.renderPickImage() */}
          {!this.hasGetUserMedia() && this.renderPickImage()}
          {this.hasGetUserMedia() && this.renderWebcam()}

          <Drawer open={this.state.drawerOpen} className="Drawer" docked={false} onRequestChange={(drawerOpen) => this.setState({drawerOpen})}>
            <img alt="ads" style={{ width: 256 }} src={adsImage} />
            <List>
              <Subheader>使用步驟</Subheader>
              <ListItem primaryText="① 加入主畫面" rightIcon={<LaunchIcon />} disabled />
              <ListItem primaryText="② 拍攝相關海報" rightIcon={<CameraAltIcon />} disabled />
              <ListItem primaryText="③ 發現驚喜" rightIcon={<SentimentSatisfiedIcon />} disabled />
            </List>
            <Divider />
            <List>
              <ListItem primaryText="關於我們" />
              <ListItem primaryText="廣告查詢" />
              <ListItem primaryText="支援" onTouchTap={() => this.props.router.push('/support')} />
              <ListItem primaryText="免責聲明" />
              <ListItem primaryText="私隱條例" />
              <ListItem primaryText="聯絡我們" />
            </List>
            <Divider />
            <FacebookProvider appID="1750551371873255">
              <Like href="http://www.facebook.com" colorScheme="dark" showFaces share width="256" />
            </FacebookProvider>
          </Drawer>
          <Drawer width={300} className="Drawer" docked={false} openSecondary={true} open={this.state.secondDrawerOpen} onRequestChange={(secondDrawerOpen) => this.setState({secondDrawerOpen})}>
            {/* <Iframe url="https://www.facebook.com/plugins/page.php?href=https:%2F%2Fwww.facebook.com%2Fcoderexample&tabs=timeline%2Cmessages&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=496223437090509" width={500} height={"100%"} /> */}
            {/* <AppBar
              title={<span style={styles.title}>支援</span>}
              // onTitleTouchTap={() => this.setState({ secondDrawerOpen: false })}
              // iconElementLeft={<IconButton onTouchTap={() => this.setState({ secondDrawerOpen: false })}><CloseIcon /></IconButton>}
              iconElementRight={<IconButton onTouchTap={() => this.setState({ secondDrawerOpen: false })}><CloseIcon /></IconButton>}
            /> */}
            <Iframe url="https://webchat.botframework.com/embed/QNA?s=4khMcLPLx9Y.cwA.hXE.v1LoSKpLvL2uns4KVzUr5T5q3ywtnQfgfPAgzg3bcqw" width={300} height={"100%"} />
          </Drawer>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(App);
