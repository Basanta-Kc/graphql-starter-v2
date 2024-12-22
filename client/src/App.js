import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

// Queries
// eg https://www.apollographql.com/docs/react/data/queries/

// Mutations
// eg https://www.apollographql.com/docs/react/data/mutations

// const getTask = () => axios.get(/task)

// useQuery({queryFn: getTask})

const GET_TASKS = gql`
  query GetTasks {
    getTasks {
      _id
      description
      title
      status
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      _id
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask(
    $title: String!
    $description: String!
    $status: String!
  ) {
    createTask(title: $title, description: $description, status: $status) {
      _id
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String!
    $description: String!
    $status: String!
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
    ) {
      _id
    }
  }
`;

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const { loading, error, data, refetch } = useQuery(GET_TASKS);
  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: () => refetch(),
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    onCompleted: () => refetch(),
  });

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: () => refetch(),
  });

  // Create or Update Task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentTaskId) {
      // graphql call to update
      updateTask({
        variables: {
          id: currentTaskId,
          title,
          description,
          status,
        },
      });
    } else {
      createTask({
        variables: {
          title,
          description,
          status,
        },
      });
    }
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setCurrentTaskId(null);
    // refresh the data after edit or update
  };

  // Edit Task
  const handleEdit = (task) => {
    setCurrentTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  // Delete Task
  const handleDelete = async (id) => {
    deleteTask({
      variables: {
        id,
      },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
        />{" "}
        <br></br>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
        ></textarea>
        <br></br>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <br></br>
        <button type="submit">
          {currentTaskId ? "Update Task" : "Create Task"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.getTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>{task.description}</td>
              <td>
                <button onClick={() => handleEdit(task)}>Edit</button>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
