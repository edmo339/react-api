import './App.css';
import deezer from './deezer.png';
import icon from './icon.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card, Form, Nav, Navbar, NavItem } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Player from './Player';
import { BsSearch } from 'react-icons/bs';
//import  AudioPlayer  from 'components/AudioPlayer';


const CLIENT_ID = '369be8bfc67a410e843d382d7f3072a8';
const CLIENT_SECRET = 'b67608b5dbb24a71ab6f7ad54b8e69d5';


function App() {
  const [ searchInput, setSearchInput ] = useState("");
  const [ accessToken, setAccessToken ] = useState("");
  const [ albums, setAlbums ] = useState([]);

  useEffect (() => {
    //API Access Token
    var authParameters = {
      method: 'POST' ,
      headers: {
        'Content-Type' : 'application/x-www-Form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
    .then(result => result.json())
    .then(data => setAccessToken(data.access_token))
  }, [])

  // Search
  async function search() {
    console.log("Search for " + searchInput);

    // Get request using search to get the artist ID
    var searchParameters = {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist' , searchParameters)
    .then(response => response.json())
    .then(data => { return data.artists.items[0].id })

    console.log("Artist ID is " + artistID);
    // Get request with Artist ID to obtain tracks

    var albums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=single&market=US&limit=8', searchParameters)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setAlbums(data.items);
    });
    // Navbar
    // Search
    // Display albums
  }
  console.log(albums);

  return (
    <div className="App" maxWidth={false} w-100>
      <Container class="w-85 p-3 mb-2 bg-primary">
       
      <Navbar pb="5" bg="light" variant="light" sticky="top">
        <Container style={{ width: '100%' }}>
        <NavItem href="#home"> <img src={deezer} alt="logo"/></NavItem>
         

          <InputGroup className='mb-3' size='lg' style={{ width: '50%' }}>
          <Button onClick={search} class="white rounded"> <BsSearch />
          </Button>
          <FormControl
          placeholder='Search For Artist'
          type='input'
          onKeyPress={ event => {
            if (event.key == "Enter") {
            search();
            }
          }}
          onChange={event => setSearchInput(event.target.value)}
          />
          </InputGroup>

          <Nav className="justify-content-around">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#home">Library</Nav.Link>
            <Nav.Link href="#features">Discover</Nav.Link>
            <Nav.Link href="#pricing">Library</Nav.Link>
           
          </Nav>
        </Container>
      </Navbar>

      <Container>
        <h2 className='pt-5 d-flex align-items-start'>Search Results for: {searchInput} </h2>
        <Row className='mx-3 pt-5 px-2 row row-cols-4 border-0 w-100'>
          {albums.map( (album, i) => {
            console.log(album);
            return (
            <Card  key={album.uri} className="border-0 px-10" style={{ cursor: "pointer" }}>
            <Card.Img src={album.images[0].url} class="rounded-4" />
            <Card.Body>
              <Card.Title>{album.name}</Card.Title>
            </Card.Body>
          </Card>
          )
          })}
        
        </Row>
        
      </Container>
      <Player />
      </Container>
    </div>

  );
}

export default App;
