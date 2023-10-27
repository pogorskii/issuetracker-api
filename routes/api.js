"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const issueSchema = new mongoose.Schema({
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
  updated_on: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
    default: "",
  },
  open: {
    type: Boolean,
    default: true,
  },
  status_text: {
    type: String,
    default: "",
  },
  project: {
    type: String,
    required: true,
  },
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(async (req, res) => {
      try {
        const query = req.query;
        query.project = req.params.project;
        const response = await Issue.find(query).select(
          "_id issue_title issue_text created_on updated_on created_by assigned_to open status_text"
        );

        res.send(response);
      } catch (err) {
        console.error("Error retrieving response:", err);
      }
    })
    .post(async (req, res) => {
      try {
        if (
          !req.body.issue_title ||
          !req.body.issue_text ||
          !req.body.created_by
        ) {
          return res.json({ error: "required field(s) missing" });
        }
        const project = req.params.project;
        const {
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
        } = req.body;

        const newIssue = await Issue.create({
          project,
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
        });

        res.json(newIssue);
      } catch (err) {
        console.error(err);
      }
    })
    .put(async (req, res) => {
      try {
        const _id = req.body._id;
        const {
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          open,
        } = req.body;
        if (!_id) {
          return res.json({ error: "missing _id" });
        }
        if (
          !issue_title &&
          !issue_text &&
          !created_by &&
          !assigned_to &&
          !status_text &&
          !open
        ) {
          return res.json({
            error: "no update field(s) sent",
            _id,
          });
        }
        if (!mongoose.isValidObjectId(_id)) {
          return res.json({ error: "could not update", _id });
        }
        const data = await Issue.findById(_id);
        if (!data) {
          return res.json({ error: "could not update", _id });
        }
        await Issue.findByIdAndUpdate(_id, {
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          open,
          updated_on: new Date(),
        });
        res.json({ result: "successfully updated", _id });
      } catch (err) {
        return res.json({ error: "could not update", _id });
      }
    })
    .delete(async (req, res) => {
      try {
        const _id = req.body._id;
        if (!_id) {
          return res.json({ error: "missing _id" });
        }
        if (!mongoose.isValidObjectId(_id)) {
          return res.json({ error: "could not delete", _id });
        }
        const delData = await Issue.findById(_id);
        if (!delData) {
          return res.json({ error: "could not delete", _id });
        }
        await Issue.findByIdAndRemove(_id);

        return res.json({ result: "successfully deleted", _id });
      } catch (err) {
        return res.json({ error: "could not delete", _id });
      }
    });
};
