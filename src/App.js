import React, {Component} from 'react';
import './App.css';
import fetch from 'node-fetch'
import {Card, Button, Form, Alert} from 'react-bootstrap'
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import L from 'leaflet'
import { Typeahead } from 'react-bootstrap-typeahead';

var myIcon = L.icon({
  iconUrl: 'https://i.ibb.co/wM9wWvg/map-marker-2-64-1.png',
  iconSize: [16,16],
  iconAnchor: [8, 27.5],
  popupAnchor: [0,-20.5]
})
var redIcon = L.icon({
  iconUrl: 'https://i.ibb.co/CsBtCpC/map-marker-2-64.png',
  iconSize: [16,16],
  iconAnchor: [8, 16],
  popupAnchor: [0,-20]
})



class App extends Component {
  
  getCountry(params) {
    var countrylc = params.toLowerCase()
    var country = this.state.countrysMap[countrylc]
    // console.log(params[0])
    fetch("https://morte-coronavirus.herokuapp.com/search/"+country, { method: "Get" })
    .then(res => res.text())
    .then(text => {
      try {
        const result = JSON.parse(text)
        console.log(result)
        if(result.country_ptbr){
          this.setState({
            result,
            alert: false,
            alert2: false,
            lat: result.latitude,
            lng: result.longitude,
          })
        }else{
          this.setState({
            alert: false,
            alert2: true,
          })
        }
      } catch(err) {
        this.setState({
          alert2: false,
          alert: true,
        })
      }
      // console.log(this.state.countryName)
    });
  }

  componentDidMount() {
    let url = "https://morte-coronavirus.herokuapp.com/search";
    let settings = { method: "Get" };
    fetch(url, settings)
    .then(res => res.json())
    .then(countrys => {
      this.setState({
        countrys,
      })
      Object.keys(countrys).forEach(country => {
        this.setState(prevState => ({
          countrysMap: {...prevState.countrysMap, [countrys[country].country_ptbr.toLowerCase()]:countrys[country].country_ptbr},
          countrsArr: [...prevState.countrsArr, countrys[country].country_ptbr]
        }))
      })
      console.log(this.state.countrysMap)
      
      this.getCountry('Brasil')
    });
  }


  

  state = {
    lat: -21.1767,
    lng: -47.8208,
    zoom: 3,
    countrys: [],
    result: [],
    countryName: '',
    alert: false,
    alert2: false,
    viewport: {
      center: [-21.1767, -47.8208],
      },
    countrysMap: {
    },
    countrsArr:[],
    z: 3
  }

  formSubmited = (event) => {
    event.preventDefault();
    this.getCountry(this.state.countryName)
  }

  valueChanged = (event) =>{
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onViewportChanged = (viewport) => {
    this.setState({
      // zoom: viewport.zoom
    })
    };
    
    handlePopupOpen = (e) => {
      this.getCountry(e.popup.options.children)
    }
    handleViewport = (e) => {
      if(!(e.zoom === this.state.z)){
        console.log('changed')
        this.setState({
          z: e.zoom
        })
      } else {
        console.log('notChanged')
      }
        console.log(e.zoom)
    }
    render(){


    (function(){
    var originalInitTile = L.GridLayer.prototype._initTile
    L.GridLayer.include({
        _initTile: function (tile) {
            originalInitTile.call(this, tile);

            var tileSize = this.getTileSize();

            tile.style.width = tileSize.x + 1 + 'px';
            tile.style.height = tileSize.y + 1 + 'px';
        }
    });
    })()

    const position = [this.state.lat, this.state.lng]
    
    return (
      <div className="cont">
        <Map className="map" center={position} zoom={this.state.z} onViewportChanged={this.handleViewport} onpopupopen={this.handlePopupOpen}>
          <TileLayer
            attribution={'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'}
            url={'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'}
            id={'mapbox/cj5l80zrp29942rmtg0zctjto'}
            maxZoom={18}
            minZoom={2}
            tileSize={512}
            zoomOffset={-1}

          />
          {this.state.countrys.map((country) => (
            
            <Marker 
            key={country.id}
            icon={country.country_ptbr === this.state.countryName ?  redIcon : myIcon}
            position={[country.latitude,country.longitude]}>

              <Popup >
                {country.country_ptbr}
              </Popup>
            </Marker>
          ))}
        </Map>
      
        <Card  className='search text-white bg-dark mb-3 float-left'>
          <Card.Body className="p-1 align-middle">
            <Form inline onSubmit={this.formSubmited}>
              <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
                País
              </Form.Label>
              {/* <Form.Control onChange={this.valueChanged} name='countryName' className="my-1 mr-sm-2" id="inlineFormCustomSelectPref" custom>
              </Form.Control> */}
              <Typeahead
              className="m-1"
                id="país"
                onChange={ (countryName) =>{
                  this.setState({
                    countryName: countryName[0]
                  })
                }}
                name='countryName'
                options={this.state.countrsArr}
              />
              
              <Button type="submit" className="my-1 btn-secondary">
                Buscar
              </Button>
            </Form>
            { this.state.alert ? 
            <Alert variant='dark' className="m-0 p-1">
              País não encontrado!
            </Alert>
            : null }
            { this.state.alert2 ? 
            <Alert variant='dark' className="m-0 p-1">
              Digite o nome do país!
            </Alert>
            : null }
          </Card.Body>
        </Card>
        <Card className='cards text-white bg-dark mb-3 float-right'>
          <Card.Header>{this.state.result.country_ptbr}</Card.Header>
          <Card.Body>
            <Card.Title>Casos: {this.state.result.cases}</Card.Title>
            <Card.Text>
              Confirmados: {this.state.result.confirmed}<br/>
              Mortes: {this.state.result.deaths}<br/>
              Recuperados: {this.state.result.recovered}<br/>
            </Card.Text>
          </Card.Body>
        </Card>
    </div>
    );
  }
}

export default App;
