import React, {Component} from 'react';
import './App.css';
import fetch from 'node-fetch'
import {Card, Button, Form, Alert} from 'react-bootstrap'
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import L from 'leaflet'

var myIcon = L.icon({
  iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII',
  iconSize: [16,27.5],
  iconAnchor: [8, 27.5],
  popupAnchor: [0,-20.5]
})



class App extends Component {
  
  getCountry(params) {
    fetch("https://morte-coronavirus.herokuapp.com/search/"+params, { method: "Get" })
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
        countrys
      })
    });
   this.getCountry('Brasil')
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
      center: [49.32707, 19.10041],
      zoom: 5,
      }
  }

  getMapZoom() {
    return this.map && this.map.leafletElement.getZoom();
 }

  handleZoomstart = (map) => {
    console.log(this.map && this.map.leafletElement);
  };

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
      zoom: viewport.zoom
    })
    console.log(viewport.zoom);
    };
  render(){
    const handlePopupOpen = (e) => {
      this.getCountry(e.popup.options.children)
      console.log(e.popup.options.children)
      // console.log("Popup is closed")
    }


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
        <Map className="map" center={position} zoom={this.state.zoom} viewport={this.state.viewport} onViewportChanged={this.onViewportChanged} onpopupopen={handlePopupOpen}>
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
            icon={myIcon}
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
              <Form.Control onChange={this.valueChanged} name='countryName' className="my-1 mr-sm-2" id="inlineFormCustomSelectPref" custom>
              </Form.Control>
              
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
