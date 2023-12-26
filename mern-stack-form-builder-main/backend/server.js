// // server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3001;

mongoose.connect('mongodb://localhost:27017/formbuilder', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());

const formSchema = new mongoose.Schema({
  title: String,
  inputs: [{ type: String, title: String, placeholder: String }],
});

const Form = mongoose.model('Form', formSchema);

// Get all forms
app.get('/forms', async (req, res) => {
  try {
    const forms = await Form.find({}, 'title');
    res.json(forms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new form
app.post('/form/create', async (req, res) => {
  const { title, inputs } = req.body;

  try {
    const newForm = new Form({ title, inputs });
    await newForm.save();
    res.json({ message: 'Form created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get form by ID
app.get('/form/:id', async (req, res) => {
  const formId = req.params.id;

  try {
    const form = await Form.findById(formId);
    res.json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update form by ID
app.put('/form/:id/edit', async (req, res) => {
  const formId = req.params.id;
  const { title, inputs } = req.body;

  try {
    await Form.findByIdAndUpdate(formId, { title, inputs });
    res.json({ message: 'Form updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
