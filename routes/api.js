"use strict";
const express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
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

let issueData = mongoose.model("issueData", issueSchema);

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      const query = req.query;
      query.project = project;
      console.log(req.query);
      issueData
        .find(query)
        .then((list) => {
          const reorderList = list.map((issue) => {
            return {
              _id: issue._id,
              issue_title: issue.issue_title,
              issue_text: issue.issue_text,
              created_on: issue.created_on,
              updated_on: issue.updated_on,
              created_by: issue.created_by,
              assigned_to: issue.assigned_to,
              open: issue.open,
              status_text: issue.status_text,
            };
          });

          res.send(reorderList);
        })
        .catch((error) => {
          console.error("Error retrieving response:", error);
        });
    })

    .post(async (req, res) => {
      try {
        let project = req.params.project;
        console.log(req.params);

        let createDate = new Date();

        if (
          req.body.issue_title == "" ||
          req.body.issue_text == "" ||
          req.body.created_by == ""
        ) {
          res.json({ error: "required field(s) missing" });
        }

        const newIssue = new issueData({
          project: project,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to,
          status_text: req.body.status_text,
        });

        newIssue
          .save()
          .then(() => {
            console.log("Document inserted succussfully :" + newIssue);
            res.json({
              assigned_to: newIssue.assigned_to,
              status_text: newIssue.status_text,
              open: newIssue.open,
              _id: newIssue._id,
              issue_title: newIssue.issue_title,
              issue_text: newIssue.issue_text,
              created_by: newIssue.created_by,
              created_on: newIssue.created_on,
              updated_on: newIssue.updated_on,
            });
          })
          .catch((err) => {
            console.log(err);
            res.json({ error: "required field(s) missing" });
          });
      } catch (err) {
        console.log(err);
      }
    })

    .put(async (req, res) => {
      try {
        let project = req.params.project;
        console.log("at put");
        console.log(req.body);
        if (!req.body._id) {
          res.json({ error: "missing _id" });

          return;
        }

        /*check for validid*/
        if (
          !req.body.issue_title &&
          !req.body.issue_text &&
          !req.body.created_by &&
          !req.body.assigned_to &&
          !req.body.status_text &&
          !req.body.open
        ) {
          res.json({ error: "no update field(s) sent", _id: req.body._id });
          console.log("error check");
          console.log(req.body);
          return;
        }

        if (mongoose.isValidObjectId(req.body._id) == false) {
          res.json({ error: "could not update", _id: req.body._id });

          return;
        }

        const data = await issueData.findById(req.body._id);
        if (!data) {
          res.json({ error: "could not update", _id: req.body._id });

          return;
        }

        /*start of updates*/
        if (req.body.issue_title != "") {
          issueData.findOneAndUpdate(
            { _id: req.body._id },
            { issue_title: req.body.issue_title },
            { new: true }
          );
        }

        if (!req.body.issue_text != "") {
          issueData.findOneAndUpdate(
            { _id: req.body._id },
            { issue_text: req.body.issue_text },
            { new: true }
          );
        }

        if (req.body.created_by != "") {
          issueData.findOneAndUpdate(
            { _id: req.body._id },
            { created_by: req.body.created_by },
            { new: true }
          );
          res.send();
        }

        if (req.body.assigned_to != "") {
          issueData.findOneAndUpdate(
            { _id: req.body._id },
            { assigned_to: req.body.assigned_to },
            { new: true }
          );
        }

        if (req.body.status_text != "") {
          issueData.findOneAndUpdate(
            { _id: req.body._id },
            { status_text: req.body.status_text },
            { new: true }
          );
        }

        if (req.body.open == "false") {
          issueData.findOneAndUpdate(
            { _id: req.body._id },
            { open: req.body.open },
            { new: true }
          );
        }

        issueData
          .findOneAndUpdate(
            { _id: req.body._id },
            { updated_on: new Date() },
            { new: true }
          )

          .catch((err) => {
            return res.json({ error: "could not update", _id: req.body._id });
            console.log(err);
          });

        res.json({ result: "successfully updated", _id: req.body._id });
      } catch (err) {
        console.log(err);
        return res.json({ error: "could not update", _id: req.body._id });
      }
    })

    .delete(async (req, res) => {
      try {
        let project = req.params.project;
        console.log(req.body._id + "idd");
        console.log(req.params);

        if (!req.body._id) {
          res.json({ error: "missing _id" });
          return;
        }

        /*check for valid id*/
        let idTest = /[0-9a-fA-F]{24}$/.test(req.body._id);
        if (idTest == false) {
          res.json({ error: "could not delete", _id: req.body._id });
          return;
        }

        let delData = await issueData.findOne({ _id: req.body._id });

        console.log(delData + "delete");
        if (!delData) {
          res.json({ error: "could not delete", _id: req.body._id });
          return;
        }

        issueData.findByIdAndRemove(req.body._id).then(() => {
          res.json({ result: "successfully deleted", _id: req.body._id });
        });
      } catch (err) {
        console.log(err);
        res.json({ error: "could not delete", _id: req.body._id });
      }
    });
};
