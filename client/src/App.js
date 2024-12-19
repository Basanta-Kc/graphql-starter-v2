import { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_TASKS = gql`
  query GetTasks {
    getTasks {
      _id
      title
      status
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

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $_id: ID!
    $title: String
    $description: String
    $status: String
  ) {
    updateTask(
      _id: $_id
      title: $title
      description: $description
      status: $status
    ) {
      _id
      title
      description
      status
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($_id: ID!) {
    deleteTask(_id: $_id) {
      _id
    }
  }
`;

// Queries
// eg https://www.apollographql.com/docs/react/data/queries/

// Mutations
// eg https://www.apollographql.com/docs/react/data/mutations

const tasks = [
  {
    _id: 1,
    title: "Learn Grpahql",
    description: "Leanr graphql with react & express with apolloserver",
    status: "Pending",
  },
];

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const {
    data: queryData,
    error: queryError,
    loading: queryLoading,
    refetch,
  } = useQuery(GET_TASKS);

  const [createTask, { data, loading, error }] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      refetch();
    },
  });

  console.log(data);

  // Create or Update Task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentTaskId) {
      // graphql call to update
    } else {
      createTask({ variables: { title, description, status } });
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
    // grpahql deelte
  };

  if (queryLoading) return "Loading...";

  if (error) return `Error! ${error.message}`;

  if (queryError) return `Error! ${error.message}`;

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
          {loading ? "..." : ""}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {queryData.getTasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status}</td>
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
