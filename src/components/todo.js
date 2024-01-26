import React, { Component } from "react";
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Grid,
  Box,
} from "@mui/material";
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
      <Box
        sx={{
          px: "16px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{ fontSize: "1.875em", color: "#121e26", fontWeight: "bolder" }}
        >
          Todo List
        </Box>
        <Grid container spacing={1} sx={{ justifyContent: "center" }}>
          <Grid item xs={8}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="add an item..."
              variant="outlined"
              value={this.state.userInput}
              onChange={(e) => this.updateInput(e.target.value)}
              inputProps={{ "aria-label": "add something" }}
              display="flex"
            />
          </Grid>
          <Grid item xs="auto">
            <Button variant="contained" onClick={() => this.addItem()}>
              ADD
            </Button>
          </Grid>
        </Grid>
        <List sx={{ width: "80%" }}>
          {this.state.list.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemIcon>
                <IconButton
                  edge="start"
                  aria-label="delete"
                  onClick={() => this.deleteItem(item.id)}
                >
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
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => this.startEditing(index)}
              >
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
