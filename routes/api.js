"use strict";

const mongoose = require("mongoose");

const { Schema } = mongoose;

// Create Schema
const issueSchema = new Schema({
  project: String,
  assigned_to: String,
  status_text: String,
  open: { type: Boolean, default: true },
  issue_title: String,
  issue_text: String,
  created_by: String,
  created_on: Date,
  updated_on: Date,
});

// Create Model
const Issue = mongoose.model("Issue", issueSchema);

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async (req, res) => {
      const project = req.params.project;

      const query = { project };
      if (req.query.issue_title) query.issue_title = req.query.issue_title;
      if (req.query.issue_text) query.issue_text = req.query.issue_text;
      if (req.query.created_by) query.created_by = req.query.created_by;
      if (req.query.assigned_to) query.assigned_to = req.query.assigned_to;
      if (req.query.status_text) query.status_text = req.query.status_text;
      if (req.query.open !== undefined) query.open = req.query.open;

      const response = await Issue.find(query);
      if (!response) res.send("Could not find tracked issues.");

      res.json(response);
    })

    .post(async (req, res) => {
      const project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;
      if (issue_title == "" || issue_text == "" || created_by == "")
        return res.json({ error: "required field(s) missing" });
      const newIssue = new Issue({
        project,
        assigned_to,
        status_text,
        issue_title,
        issue_text,
        created_by,
        created_on: new Date(),
        updated_on: new Date(),
      });
      const response = await newIssue.save();

      res.json(response);
    })

    .put(async (req, res) => {
      if (!req.body._id) return res.json({ error: "missing _id" });
      const id = req.body._id;

      const project = req.params.project;

      const query = { project };
      if (req.body.issue_title) query.issue_title = req.body.issue_title;
      if (req.body.issue_text) query.issue_text = req.body.issue_text;
      if (req.body.created_by) query.created_by = req.body.created_by;
      if (req.body.assigned_to) query.assigned_to = req.body.assigned_to;
      if (req.body.status_text) query.status_text = req.body.status_text;
      if (req.body.open !== undefined) query.open = req.body.open;

      if (query === {})
        return res.json({ error: "no update field(s) sent", _id: id });
      query.updated_on = new Date();

      let response;
      try {
        response = await Issue.findByIdAndUpdate(id, query);
      } catch (err) {
        return res.json({ error: "could not update", _id: id });
      }
      res.json(response);
    })

    .delete(async (req, res) => {
      // let project = req.params.project;
      const id = req.body._id;
      if (!id) return res.json({ error: "missing _id" });

      try {
        await Issue.findByIdAndDelete(id);
        return res.json({ result: "successfully deleted", _id: _id });
      } catch (err) {
        return res.json({ error: "could not delete", _id: _id });
      }
    });
};
