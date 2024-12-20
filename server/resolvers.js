const Task = require("./model/task");

// Create function called getTasks, and getTask in query
// hint Model.find(), Model.findById()
// app.get('/tasks/:id', getTasks)
const resolvers = {
  Query: {
    getTasks: async () => {
      const tasks = await Task.find();
      return tasks;
    },
    getTask: async (_, { id }) => {
      const task = await Task.findById(id);
      return task;
    },
  },
  // create mutation function called createTask, updateTask and deleteTask
  // updateTask and deleteTask should be done by student
  // hint: new Model(params),  model.save(), Model.findByIdAndUpdate(id, updatedfields, {new: true})
  // new:true make sures that udpated data is returned
  // Model.findByIdAndDelete()
  Mutation: {
    createTask: async (_, { title, description, status }) => {
      const task = new Task({ title, description, status });
      await task.save();
      return task;
    },
    deleteTask: async (_, { id }) => {
      const task = await Task.findByIdAndDelete({ _id: id });
      return task;
    },
    updateTask: async (_, { id, title, description, status }) => {
      const task = await Task.findByIdAndUpdate(
        id,
        {
          title,
          description,
          status,
        },
        {
          new: true,
        }
      );
      return task;
    },
  },
};

module.exports = resolvers;
