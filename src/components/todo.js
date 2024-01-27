import React, { Component } from "react";
import "./todo.css";
import { v4 as uuidv4 } from "uuid";
import {
  Button,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  ExpandLess,
  ExpandMore,
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
  addTask(parentId = null) {
    if (this.state.userInput !== "") {
      const userInput = {
        id: uuidv4(),
        value: this.state.userInput,
        parentId: parentId,
        children: [],
        status: "active", // will change to complete when done
      };

      // Update list
      const list = [...this.state.list];

      if (parentId === null) {
        list.push(userInput);
      } else {
        const parentIndex = list.findIndex((item) => item.id === parentId);
        if (parentIndex !== -1) {
          list[parentIndex].children.push(userInput);
        }
      }

      this.setState({
        list,
        userInput: "",
      });
    }
  }

  // Allows closing of tasks to include closing parent when all children are closed
  closeTask(taskId) {
    this.setState((prevState) => {
      let list = prevState.list.map((item) => {
        if (item.id === taskId || item.parentId === taskId) {
          return { ...item, status: "completed" };
        }
        return item;
      });

      list.forEach((item, index) => {
        if (item.parentId) {
          const parentIndex = list.findIndex(
            (parent) => parent.id === item.parentId
          );
          if (
            parentIndex !== -1 &&
            list.every(
              (child) =>
                child.parentId !== item.parentId || child.status === "completed"
            )
          ) {
            list[parentIndex] = { ...list[parentIndex], status: "completed" };
          }
        }
      });

      return { list };
    });
  }

  // Allows deleting of tasks to include deleting parent when all children are deleted
  deleteTask(taskId) {
    this.setState((prevState) => {
      let list = prevState.list.map((item) => {
        if (item.id === taskId || item.parentId === taskId) {
          return { ...item, status: "deleted" };
        }
        return item;
      });

      list.forEach((item, index) => {
        if (item.parentId) {
          const parentIndex = list.findIndex(
            (parent) => parent.id === item.parentId
          );
          if (
            parentIndex !== -1 &&
            list.every(
              (child) =>
                child.parentId !== item.parentId ||
                child.status === "deleted" ||
                child.status === "completed"
            )
          ) {
            list[parentIndex] = { ...list[parentIndex], status: "deleted" };
          }
        }
      });

      return { list };
    });
  }

  // Start editing an item
  startEditing = (taskId) => {
    const { list } = this.state;
    const taskIndex = list.findIndex((item) => item.id === taskId);

    if (taskIndex !== -1) {
      this.setState({
        editingIndex: taskIndex,
        editingText: list[taskIndex].value,
        isEditingChild: list[taskIndex].parentId !== null,
      });
    }
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
      updatedList[editingIndex] = {
        ...updatedList[editingIndex],
        value: editingText,
      };
      this.setState({
        list: updatedList,
        editingIndex: null,
        editingText: "",
        isEditingChild: false,
      });
    }
  };

  render() {
    return (
      <Box className="todo-card">
        <h2>To Do List</h2>
        <Grid container spacing={1} sx={{ justifyContent: "center" }}>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="add an item"
              value={this.state.userInput}
              onChange={(e) => this.updateInput(e.target.value)}
              inputProps={{ "aria-label": "add an item" }}
            />
          </Grid>
          <Grid item xs="auto" sx={{ display: "flex", alignItems: "center" }}>
            <Button variant="contained" onClick={() => this.addTask()}>
              ADD
            </Button>
          </Grid>
          <Grid item xs={8}>
            <List>
              {this.state.list
                .filter((task) => task.status !== "deleted")
                .map((task, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          aria-label="action task"
                          onClick={() => this.closeTask(task.id)}
                        />
                      </ListItemIcon>
                      {this.state.list[this.state.editingIndex]?.id ===
                      task.id ? (
                        <TextField
                          fullWidth
                          value={this.state.editingText}
                          onChange={(e) =>
                            this.updateEditingText(e.target.value)
                          }
                          onBlur={this.saveEdit}
                          autoFocus
                        />
                      ) : (
                        <ListItemText primary={task.value} />
                      )}

                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => this.startEditing(task.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => this.deleteTask(task.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default Todo;
