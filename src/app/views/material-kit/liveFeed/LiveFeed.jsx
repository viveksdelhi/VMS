import React, { useState } from "react";
import { Card, CardMedia, IconButton, Grid } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import {
  DragDropContext,//original 2
  Droppable,
  Draggable
} from "react-beautiful-dnd";
import ReactPlayer from 'react-player';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';

export const LiveFeed = ({
  videoUrl,
  isPlaying,
  handlePlayPause,
  isRecording,
  handleRecording,
  isTracking,
  handleTrack,
  handleSnapshot
}) => {
  return (
    <Card sx={{ height: "100%", backgroundColor: "#333" }}>
      <CardMedia
        component="div"
        sx={{
          height: "100%",
          paddingTop: "56.25%", // 16:9 aspect ratio
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "1.25rem",
          position: "relative"
        }}
      >
        <ReactPlayer
          url={videoUrl}
          playing={isPlaying}
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
          controls
        />
      </CardMedia>
      <Grid container spacing={2} justifyContent="center" sx={{ padding: 1 }}>
        <Grid item>
          <IconButton
            onClick={handlePlayPause}
            color="primary"
            aria-label="play/pause"
            title="Play/Pause"
            sx={{
              border: '2px solid',
              borderColor: isPlaying ? 'primary.main' : 'rgba(255, 255, 255, 0.23)',
              borderRadius: '50%',
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            onClick={handleSnapshot}
            color="secondary"
            aria-label="snapshot"
            title="Snapshot"
            sx={{
              border: '2px solid',
              borderColor: 'rgba(255, 255, 255, 0.23)',
              borderRadius: '50%',
            }}
          >
            <CameraAltIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            onClick={handleRecording}
            aria-label="record"
            title="Record"
            sx={{
              color: isRecording ? 'green' : 'error.main',
              border: '2px solid',
              borderColor: isRecording ? 'green' : 'rgba(255, 255, 255, 0.23)',
              borderRadius: '50%',
            }}
          >
            <RadioButtonCheckedIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            onClick={handleTrack}
            aria-label="track"
            title="Track"
            sx={{
              color: isTracking ? 'green' : 'warning.main',
              border: '2px solid',
              borderColor: isTracking ? 'green' : 'rgba(255, 255, 255, 0.23)',
              borderRadius: '50%',
            }}
          >
            <TrackChangesIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Card>
  );
};

const LiveFeedGrid = () => {
  const [cards, setCards] = useState([
    { id: 1, videoUrl: 'https://www.youtube.com/live/Nq2wYlWFucg?feature=shared', isPlaying: false, isRecording: false, isTracking: false },
    { id: 2, videoUrl: 'https://www.youtube.com/live/Xmm3Kr5P1Uw?feature=shared', isPlaying: false, isRecording: false, isTracking: false },
    { id: 3, videoUrl: 'https://www.youtube.com/live/nyd-xznCpJc?feature=shared', isPlaying: false, isRecording: false, isTracking: false },
    { id: 4, videoUrl: 'https://www.youtube.com/live/-h_MjQPP8wE?feature=shared', isPlaying: false, isRecording: false, isTracking: false },
    { id: 5, videoUrl: 'https://www.youtube.com/live/kyQv9PTTH3Y?feature=shared', isPlaying: false, isRecording: false, isTracking: false },
    { id: 6, videoUrl: 'https://www.youtube.com/live/VZEDTeJu9Oo?feature=shared', isPlaying: false, isRecording: false, isTracking: false },
  ]);

  const [visibleCount, setVisibleCount] = useState(6); // Default show all videos

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCards(items);
  };

  const toggleState = (index, stateKey) => {
    const newCards = [...cards];
    newCards[index][stateKey] = !newCards[index][stateKey];
    setCards(newCards);
  };

  const handleVisibilityChange = (count) => {
    setVisibleCount(count);
    const updatedCards = cards.map((card, index) => ({
      ...card,
      isPlaying: index < count, 
    }));
    setCards(updatedCards);
  };

  return (
    <div style={{ width: '100%' }}>
      <Grid container spacing={2} justifyContent="start" sx={{ marginBottom: 1 }}>
        <Grid item>
          <IconButton
            onClick={() => handleVisibilityChange(2)}
            color="primary"
            title="Show 2 videos"
            aria-label="show 2 videos"
            sx={{ border: '2px solid', borderRadius: '0%', padding: '0px' }}
          >
            <LooksTwoIcon/>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            onClick={() => handleVisibilityChange(3)}
            color="primary"
            title="Show 3 videos"
            aria-label="show 3 videos"
            sx={{ border: '2px solid', borderRadius: '0%', padding: '0px' }}
          >
            <Looks3Icon/>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            onClick={() => handleVisibilityChange(4)}
            color="primary"
            title="Show 4 videos"
            aria-label="show 4 videos"
            sx={{ border: '2px solid', borderRadius: '0%', padding: '0px' }}
          >
            <Looks4Icon/>
          </IconButton>
        </Grid>
      </Grid>
      
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="liveFeedCards" direction="horizontal">
          {(provided) => (
            <Grid
              container
              spacing={3}
              justifyContent="center"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {cards.slice(0, visibleCount).map((card, index) => (
                <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                  {(provided) => (
                    <Grid
                      item
                      xs={12}
                      md={visibleCount === 2 ? 6 : visibleCount === 3 ? 4 : 3} // Adjust grid size
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{...provided.draggableProps.style, height: '100%'}}
                    >
                      <LiveFeed
                        videoUrl={card.videoUrl}
                        isPlaying={card.isPlaying}
                        handlePlayPause={() => toggleState(index, "isPlaying")}
                        isRecording={card.isRecording}
                        handleRecording={() => toggleState(index, "isRecording")}
                        isTracking={card.isTracking}
                        handleTrack={() => toggleState(index, "isTracking")}
                        handleSnapshot={() => alert("Snapshot taken!")}
                      />
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default LiveFeedGrid;
