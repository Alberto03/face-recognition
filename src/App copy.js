import { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
  apiKey: 'da09540c058748e4bb7cb654cd0fdf8e'
 });

const particlesOptions = {
  particles: {
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    },
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }    
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        /*{
          id: "a403429f2ddf4b49b307e318f00e528b",
          version: "34ce21a40cc24b6b96ffee54aabff139",
        },*/ 
        Clarifai.FACE_DETECT_MODEL,
        /*53e1df302c079b3db8a0a36033ed2d15*/
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response))) 
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignedIn: false})
    } else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render(){

   const { isSignedIn, imageUrl, route, box } = this.state;

    return (
      <div className="App">
  
        <Particles className = 'particles'
         params={particlesOptions}
        />
  
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>

        { route === 'home' ? 

          <div>
            <Logo/>
            <Rank/>
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={box} imageUrl={imageUrl}/>
          </div>

          : 
          (
            route === 'signin' ?

              <Signin onRouteChange={this.onRouteChange}/>
            :

            <Register onRouteChange={this.onRouteChange}/>
          )
           
        }
      
      </div>
    );
  }
}

export default App;