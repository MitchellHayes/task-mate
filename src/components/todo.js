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
  ToggleButton,
} from "@mui/material";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

class Todo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInput: "",
      childTaskInput: "",
      list: [],
      editingText: "",
      addingChildOf: null,
      editingId: null,
      isEditingChild: false,
      filterStatus: "active",
    };
  }

  componentDidUpdate() {
    const { list } = this.state;
    localStorage.setItem("todoList", JSON.stringify(list));
  }

  componentDidMount() {
    const savedList = localStorage.getItem("todoList");
    if (savedList) {
      this.setState({ list: JSON.parse(savedList) });
    }
  }

  // Set a user input value
  updateInput(value) {
    this.setState({ userInput: value });
  }

  updateChildInput(value) {
    this.setState({ childTaskInput: value });
  }

  // Handle toggle button state
  handleFilterChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      this.setState({ filterStatus: newAlignment });
    }
  };

  // Add item if user input in not empty
  addTask(parentId = null) {
    const input = parentId ? this.state.childTaskInput : this.state.userInput;
    if (input !== "") {
      const newTask = {
        id: uuidv4(),
        value: input,
        parentId,
        children: [],
        status: "active",
      };

      this.setState((prevState) => {
        const newList = parentId
          ? prevState.list.map((item) =>
              item.id === parentId
                ? { ...item, children: [...item.children, newTask] }
                : item
            )
          : [...prevState.list, newTask];

        return {
          list: newList,
          userInput: parentId ? prevState.userInput : "",
          childTaskInput: parentId ? "" : prevState.childTaskInput,
        };
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
    let taskToEdit;

    if (isChild) {
      const parentTask = list.find((item) => item.id === parentId);
      taskToEdit = parentTask.children.find((child) => child.id === taskId);
    } else {
      taskToEdit = list.find((item) => item.id === taskId);
    }

    if (taskToEdit) {
      this.setState({
        editingId: taskId,
        editingText: taskToEdit.value,
        isEditingChild: isChild,
      });
    }
  };

  // Update the editing text
  updateEditingText = (value) => {
    this.setState({ editingText: value });
  };

  // Save the edited item
  saveEdit = () => {
    const { editingId, editingText, list, isEditingChild } = this.state;
    if (editingText.trim() !== "") {
      let updatedList = list.map((item) => {
        if (isEditingChild) {
          if (item.children.some((child) => child.id === editingId)) {
            return {
              ...item,
              children: item.children.map((child) =>
                child.id === editingId
                  ? { ...child, value: editingText }
                  : child
              ),
            };
          }
        } else {
          if (item.id === editingId) {
            return { ...item, value: editingText };
          }
        }
        return item;
      });

      this.setState({
        list: updatedList,
        editingId: null,
        editingText: "",
        isEditingChild: false,
      });
    }
  };

  render() {
    const filteredTasks = this.state.list.filter(
      (task) =>
        task.status !== "deleted" &&
        task.parentId === null &&
        task.status === this.state.filterStatus
    );
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
            <ToggleButtonGroup
              color="primary"
              value={this.state.filterStatus}
              variant="soft"
              exclusive
              onChange={this.handleFilterChange}
            >
              <ToggleButton value="active">Active</ToggleButton>
              <ToggleButton value="completed">Completed</ToggleButton>
            </ToggleButtonGroup>
            <List className="todo-list-container">
                {filteredTasks.map((parentTask) => (
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
                        {this.state.editingId === parentTask.id &&
                        !this.state.isEditingChild ? (
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
                        {this.state.filterStatus !== "completed" && (
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => this.startEditing(parentTask.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => this.deleteTask(parentTask.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemButton>
                      {this.state.filterStatus !== "completed" && (
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
                      )}
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
                                {this.state.editingId === childTask.id &&
                                this.state.isEditingChild ? (
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
                                {this.state.filterStatus !== "completed" && (
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
                                )}
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
                              value={this.state.childTaskInput}
                              onChange={(e) =>
                                this.updateChildInput(e.target.value)
                              }
                              onBlur={() => {
                                this.addTask(parentTask.id);
                                this.setState({ addingChildOf: null });
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
