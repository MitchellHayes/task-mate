import React, { Component } from "react";
import { Button, IconButton, List, ListItem, ListItemIcon, ListItemText, TextField, Grid, Box, Input } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

class Todo extends Component {
  constructor(props) {
    super(props);

    // Setting up state
    this.state = {
      userInput: "",
      list: [],
      editingIndex: null,
      editingText: "",
    };
  }
  // Set a user input value
  updateInput(value) {
    this.setState({ userInput: value });
  }

  // Add item if user input in not empty
  addItem() {
    if (this.state.userInput !== "") {
      const userInput = {
        // Add a random id which is used to delete
        id: Math.random(),

        // Add a user value to list
        value: this.state.userInput,
      };

      // Update list
      const list = [...this.state.list];
      list.push(userInput);

      // reset state
      this.setState({
        list,
        userInput: "",
      });
    }
  }

  // Function to delete item from list use id to delete
  deleteItem(key) {
    const list = [...this.state.list];

    // Filter values and leave value which we need to delete
    const updateList = list.filter((item) => item.id !== key);

    // Update list in state
    this.setState({
      list: updateList,
    });
  }

  // Start editing an item
  startEditing = (index) => {
    this.setState({
      editingIndex: index,
      editingText: this.state.list[index].value,
    });
  };

  // Update the editing text
  updateEditingText = (value) => {
    this.setState({ editingText: value });
  };

  // Save the edited item
  saveEdit = () => {
    const { editingIndex, editingText, list } = this.state;
    if (editingText.trim() !== "") {
      let updatedList = [...list];
      updatedList[editingIndex].value = editingText;
      this.setState({
        list: updatedList,
        editingIndex: null,
        editingText: "",
      });
    }
  };

  render() {
    return (
      <Box sx={{ width: "100%", maxWidth: 400, margin: "auto" }}>
        <Box sx={{ my: 4, textAlign: "center", fontSize: "3rem", fontWeight: "bolder" }}>
          Todo List
        </Box>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <TextField 
                id="outlined-basic" 
                label="add an item..." 
                variant="outlined" 
                value={this.state.userInput}
                onChange={(e) => this.updateInput(e.target.value)}
                inputProps={{ 'aria-label': 'add something' }}
                />
              <Button variant="contained" size="small" onClick={() => this.addItem()} sx={{ ml: 2 }}>
                ADD
              </Button>
            </Box>
          </Grid>
        </Grid>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {this.state.list.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemIcon>
                <IconButton edge="start" aria-label="delete" onClick={() => this.deleteItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemIcon>
              {this.state.editingIndex === index ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  value={this.state.editingText}
                  onChange={(e) => this.updateEditingText(e.target.value)}
                  onBlur={this.saveEdit}
                  autoFocus
                />
              ) : (
                <ListItemText primary={item.value} />
              )}
              <IconButton edge="end" aria-label="edit" onClick={() => this.startEditing(index)}>
                <EditIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  }
}

export default Todo;