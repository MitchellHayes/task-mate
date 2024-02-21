import React, { Component } from "react";
import "./eventList.css";
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      dialogOpen: false,
      newEvent: {
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
      },
    };
  }

  componentDidMount() {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      this.setState({ events: JSON.parse(savedEvents) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.events !== this.state.events) {
      localStorage.setItem('events', JSON.stringify(this.state.events));
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newEvent: { ...prevState.newEvent, [name]: value },
    }));
  };

  handleSubmit = () => {
    this.handleAddEvent({ ...this.state.newEvent, id: Date.now() }); // Simple ID generation for example
    this.setState({
      newEvent: {
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
      },
    });
    this.handleDialogClose();
  };

  handleAddEvent = (newEvent) => {
    this.setState((prevState) => ({
      events: [...prevState.events, newEvent],
    }));
  };

  handleRemoveEvent = (eventId) => {
    this.setState((prevState) => ({
      events: prevState.events.filter((event) => event.id !== eventId),
    }));
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  render() {
    const { events, dialogOpen, newEvent } = this.state;

    return (
      <Box className="eventList-card">
        <h2>Event List</h2>
        <Grid container spacing={1} sx={{ justifyContent: "center" }}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleDialogOpen}
            >
              Add Event
            </Button>
          </Grid>
          <Grid item xs={12}>
            <List className="event-list-container">
              {events.map((event) => (
                <ListItem key={event.id} disablePadding>
                  <ListItemButton>
                    <ListItemText
                      primary={event.title}
                      secondary={`${event.date || ""} ${
                        event.startTime || ""
                      } - ${event.endTime || ""} ${
                        event.location ? `at ${event.location}` : ""
                      }`}
                    />
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => this.handleRemoveEvent(event.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
        <Dialog open={dialogOpen} onClose={this.handleDialogClose} fullWidth>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Event Title"
              type="text"
              fullWidth
              variant="outlined"
              value={newEvent.title}
              onChange={this.handleInputChange}
            />
            <TextField
              margin="dense"
              name="date"
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={newEvent.date}
              onChange={this.handleInputChange}
            />
            <TextField
              margin="dense"
              name="startTime"
              label="Start Time"
              type="time"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={newEvent.startTime}
              onChange={this.handleInputChange}
            />
            <TextField
              margin="dense"
              name="endTime"
              label="End Time"
              type="time"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={newEvent.endTime}
              onChange={this.handleInputChange}
            />
            <TextField
              margin="dense"
              name="location"
              label="Location"
              type="text"
              fullWidth
              variant="outlined"
              value={newEvent.location}
              onChange={this.handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose}>Cancel</Button>
            <Button onClick={this.handleSubmit} color="primary">
              Add Event
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
}

export default EventList;
