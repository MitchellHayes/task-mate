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
  TextField,
  Grid,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

class Todo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInput: "",
      list: [],
      editingIndex: null,
      editingText: "",
      addingChildOf: null, // New state variable
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
  closeTask = (taskId, isChild = false, parentId = null) => {
    this.setState((prevState) => {
      if (isChild && parentId) {
        const updatedList = prevState.list.map((parent) => {
          if (parent.id === parentId) {
            // First, toggle the status of the selected child task
            const updatedChildren = parent.children.map((child) => {
              if (child.id === taskId) {
                return {
                  ...child,
                  status: child.status === "active" ? "completed" : "active",
                };
              }
              return child;
            });

            // Then, check if all the child tasks are now completed
            const areAllChildrenCompleted = updatedChildren.every(
              (child) => child.status !== "active"
            );

            // If all child tasks are completed, update the parent's status as well
            return {
              ...parent,
              status: areAllChildrenCompleted ? "completed" : "active", // Set parent status based on children's status
              children: updatedChildren,
            };
          }
          return parent;
        });

        return { list: updatedList };
      } else {
        const updatedList = prevState.list.map((item) => {
          if (item.id === taskId) {
            const newStatus = item.status === "active" ? "completed" : "active";

            let updatedChildren;
            if (newStatus === "completed") {
              // If the parent is set to 'completed', update all non-deleted children to 'completed'
              updatedChildren = item.children.map((child) => {
                if (child.status !== "deleted") {
                  return { ...child, status: "completed" };
                }
                return child;
              });
            } else {
              // If the parent is set to 'active', set all non-deleted children to 'active'
              updatedChildren = item.children.map((child) => {
                if (child.status !== "deleted") {
                  return { ...child, status: "active" };
                }
                return child;
              });
            }

            return { ...item, status: newStatus, children: updatedChildren };
          }
          return item;
        });
        return { list: updatedList };
      }
    });
  };

  // Allows deleting of tasks to include deleting parent when all children are deleted
  deleteTask(taskId, isChild = false, parentId = null) {
    this.setState((prevState) => {
      let updatedList = [...prevState.list];

      if (isChild) {
        const parentIndex = updatedList.findIndex(
          (item) => item.id === parentId
        );
        if (parentIndex !== -1) {
          updatedList[parentIndex].children = updatedList[
            parentIndex
          ].children.map((child) =>
            child.id === taskId ? { ...child, status: "deleted" } : child
          );
        }
      } else {
        updatedList = updatedList.map((item) =>
          item.id === taskId ? { ...item, status: "deleted" } : item
        );
      }

      return { list: updatedList };
    });
  }

  // Start editing an item
  startEditing = (taskId, isChild = false, parentId = null) => {
    const { list } = this.state;
    let taskIndex = -1;

    if (isChild) {
      const parentIndex = list.findIndex((item) => item.id === parentId);
      if (parentIndex !== -1) {
        taskIndex = list[parentIndex].children.findIndex(
          (item) => item.id === taskId
        );
        if (taskIndex !== -1) {
          this.setState({
            editingIndex: taskIndex,
            editingText: list[parentIndex].children[taskIndex].value,
            isEditingChild: true,
          });
        }
      }
    } else {
      taskIndex = list.findIndex((item) => item.id === taskId);
      if (taskIndex !== -1) {
        this.setState({
          editingIndex: taskIndex,
          editingText: list[taskIndex].value,
          isEditingChild: false,
        });
      }
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
              label="Add a new task"
              value={this.state.userInput}
              onChange={(e) => this.updateInput(e.target.value)}
              inputProps={{ "aria-label": "Add a new task" }}
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
                .filter(
                  (task) => task.status !== "deleted" && task.parentId === null
                )
                .map((parentTask) => (
                  <React.Fragment key={parentTask.id}>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            aria-label="action task"
                            checked={parentTask.status === "completed"}
                            onChange={() => this.closeTask(parentTask.id)}
                          />
                        </ListItemIcon>
                        {this.state.list[this.state.editingIndex]?.id ===
                        parentTask.id ? (
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
                          <ListItemText primary={parentTask.value} />
                        )}
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => this.startEditing(parentTask.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => this.deleteTask(parentTask.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemButton>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          this.setState({
                            addingChildOf: parentTask.id,
                            userInput: "",
                          })
                        }
                      >
                        Add Child Task
                      </Button>
                    </ListItem>
                    {parentTask.children && (
                      <List component="div" disablePadding>
                        {parentTask.children
                          .filter((childTask) => childTask.status !== "deleted")
                          .map((childTask) => (
                            <ListItem key={childTask.id} sx={{ pl: 4 }}>
                              <ListItemButton>
                                <ListItemIcon>
                                  <Checkbox
                                    edge="start"
                                    aria-label="action task"
                                    checked={childTask.status === "completed"}
                                    onChange={() =>
                                      this.closeTask(
                                        childTask.id,
                                        true,
                                        parentTask.id
                                      )
                                    }
                                  />
                                </ListItemIcon>
                                {this.state.editingIndex === childTask.id ? (
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
                                  <ListItemText primary={childTask.value} />
                                )}
                                <IconButton
                                  edge="end"
                                  aria-label="edit"
                                  onClick={() =>
                                    this.startEditing(
                                      childTask.id,
                                      true,
                                      parentTask.id
                                    )
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() =>
                                    this.deleteTask(
                                      childTask.id,
                                      true,
                                      parentTask.id
                                    )
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemButton>
                            </ListItem>
                          ))}
                        {this.state.addingChildOf === parentTask.id && (
                          <ListItem sx={{ pl: 4 }}>
                            <TextField
                              fullWidth
                              label="Add child task"
                              value={this.state.userInput}
                              onChange={(e) => this.updateInput(e.target.value)}
                              onBlur={() => {
                                this.addTask(parentTask.id);
                                this.setState({
                                  addingChildOf: null,
                                  userInput: "",
                                });
                              }}
                              autoFocus
                            />
                          </ListItem>
                        )}
                      </List>
                    )}
                  </React.Fragment>
                ))}
            </List>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default Todo;
