/*global swal*/

import React from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';

import { useState, useEffect } from 'react';

const apiToken = 'BQAbMryvlmSvfSlXHTrY5eB1ItS1SNnLVEfaMHo3nmECyyupJyOw12nEjbuXTOW_ECATl80SM8NT-Abkh4-pV0rbSFPRpgsFsRNmeqZNFsxOqoKTWjnClhzTSu2YUXeV2LxKhnbIn1q2rMFqhyON0lgtjik6GoL3yHSFjcsZwF_ZRgREgL2s7YcJO70Li8OjzVXOsDX6Hp5mXM3x4zkZqA';

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

const AlbumCover = (props) =>  {
  const src = props.track.album.images[0].url;
  return (
    <img src={src} style={{ width: 400, height: 400 }} />
  );
};

const App = () => {
  const [tracks, setTracks] = useState();
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [timeout, setTimeout] = useState();

  useEffect(() => {
    fetch(`https://api.spotify.com/v1/me/tracks`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + apiToken,
      },
    })
      .then(response => response.json())
      .then((data) => {
        setTracks(data.items);
        const randomIndex = getRandomNumber(data.items.length);
        setCurrentTrack(data.items[randomIndex].track);
        setSongsLoaded(true);
      });
  }, []);

  useEffect(() => {
    setTimeout(setTimeout(() => getNewTrack(), 1500));
  }, [currentTrack]);

  const checkAnswer = (id) => {
    if (currentTrack.id === id) {
      clearTimeout(timeout);
      swal('Bravo!', 'You won', 'success').then(() => getNewTrack());
    } else {
      swal('Try again', 'This is not the correct answer', 'error');
    }
  };

  const getNewTrack = () => {
    if (!tracks) {
      return;
    }
    const randomIndex = getRandomNumber(tracks.length);
    setCurrentTrack(tracks[randomIndex].track);
  };

  if (!songsLoaded) {
    return (
      <div className="App">
        <img src={loading} className="App-logo" alt="logo"/>
      </div>
    );
  }

  const randomIndex1 = getRandomNumber(tracks.length);
  const randomIndex2 = getRandomNumber(tracks.length);

  const track1 = currentTrack;
  const track2 = tracks[randomIndex1].track;
  const track3 = tracks[randomIndex2].track;

  const propositions = shuffleArray([track1, track2, track3]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <h1 className="App-title">Name that Tune</h1>
      </header>
      <div className="App-images">
        <AlbumCover track={track1}/>
        <Sound url={track1.preview_url} playStatus={Sound.status.PLAYING}/>
      </div>
      <div className="App-buttons">
        {propositions.map(track =>
          <Button onClick={() => checkAnswer(track.id)}>{track.name}</Button>
        )}
      </div>
    </div>
  );
};

export default App;