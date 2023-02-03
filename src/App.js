import './App.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react'

const CLIENT_ID = "0937518b77fc47a1bdb079643ff9f53e";
const CLIENT_SECRET = "d5fe8f22936040868f90ce3ca06e75fe";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setalbums, ] = useState([]);

  useEffect(() => {
    // API Access Token
    var authParamaters = {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
      fetch('https://accounts.spotify.com/api/token', authParamaters )
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

  // Search
  async function search() {
    console.log("Search for " + searchInput);
  

  // Get request using search to get the artist ID
  var searchParamaters = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }
  var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParamaters )
  .then(response => response.json())
  .then(data => { return data.artists.items[0].id})

  console.log("Artist ID is " + artistID)
  // Get request with artist to grab all the albums for that artist
  var returnedAlbums = await fetch('https//api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=10', searchParamaters)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setalbums(data.items);
    });
  // Display those albums to user
  }
  console.log(albums);
  return (
    <div className="App">
      <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl
          placeholder='Search For Artist'
          type='input'
          onKeyPress={event => {
            if (event.key == "Enter") {
              search();
            }
          }}
          onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
          <Container>
            <Row className='mx-2 row row-cols-4'>
              {albums.map( (album, i) => {
                console.log(album);
                return (
              <Card>
               <Card.Img src={album.images[0].url} />
                  <Card.Body>
                    <Card.Title>{album.name}</Card.Title>
                  </Card.Body>
              </Card>
                )
              })}
            
            </Row>
          </Container>
      </Container>
    </div>
  );
}

export default App;
