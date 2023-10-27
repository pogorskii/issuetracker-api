"use strict";

const mongoose = require("mongoose");

const { Schema } = mongoose;

// Create Schema
const issueSchema = new Schema({
  project: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
    default: "",
  },
  status_text: {
    type: String,
    default: "",
  },
  open: { type: Boolean, default: true },
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  created_on: { type: Date, default: Date.now },
  updated_on: {
    type: Date,
    default: Date.now,
  },
});

// Create Model
const Issue = mongoose.model("Issue", issueSchema);

module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(async (req, res) => {
      try {
        const project = req.params.project;
        const query = req.query;
        query.project = project;
        const queryRes = await Issue.find(query);
        res.json({
          _id: queryRes._id,
          issue_title: queryRes.issue_title,
          issue_text: queryRes.issue_text,
          created_on: queryRes.created_on,
          updated_on: queryRes.updated_on,
          created_by: queryRes.created_by,
          assigned_to: queryRes.assigned_to,
          open: queryRes.open,
          status_text: queryRes.status_text,
        });
      } catch (err) {
        console.error("Error retrieving response:", error);
      }
    })

    // .post(async (req, res) => {
    //   const project = req.params.project;
    //   const { issue_title, issue_text, created_by, assigned_to, status_text } =
    //     req.body;
    //   if (issue_title == "" || issue_text == "" || created_by == "")
    //     return res.json({ error: "required field(s) missing" });
    //   const newIssue = new Issue({
    //     project,
    //     assigned_to,
    //     status_text,
    //     issue_title,
    //     issue_text,
    //     created_by,
    //     created_on: new Date(),
    //     updated_on: new Date(),
    //   });
    //   const response = await newIssue.save();

    //   const showObj = {
    //     assigned_to: response.assigned_to,
    //     status_text: response.status_text,
    //     open: response.open,
    //     _id: response._id,
    //     issue_title: response.issue_title,
    //     issue_text: response.issue_text,
    //     created_by: response.created_by,
    //     created_on: response.created_on,
    //     updated_on: response.updated_on,
    //   };

    //   res.json(showObj);
    // })

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

        const newIssue = new Issue({
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

    // .put(async (req, res) => {
    //   if (!req.body._id) return res.json({ error: "missing _id" });
    //   const id = req.body._id;

    //   const project = req.params.project;

    //   const query = { project };
    //   if (req.body.issue_title) query.issue_title = req.body.issue_title;
    //   if (req.body.issue_text) query.issue_text = req.body.issue_text;
    //   if (req.body.created_by) query.created_by = req.body.created_by;
    //   if (req.body.assigned_to) query.assigned_to = req.body.assigned_to;
    //   if (req.body.status_text) query.status_text = req.body.status_text;
    //   if (req.body.open !== undefined) query.open = req.body.open;

    //   if (query === {})
    //     return res.json({ error: "no update field(s) sent", _id: id });
    //   query.updated_on = new Date();

    //   let response;
    //   try {
    //     response = await Issue.findByIdAndUpdate(id, query);
    //   } catch (err) {
    //     return res.json({ error: "could not update", _id: id });
    //   }
    //   res.json(response);
    // })

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

        const data = await Issue.findById(req.body._id);
        if (!data) {
          res.json({ error: "could not update", _id: req.body._id });

          return;
        }

        /*start of updates*/
        if (req.body.issue_title != "") {
          Issue.findOneAndUpdate(
            { _id: req.body._id },
            { issue_title: req.body.issue_title },
            { new: true }
          );
        }

        if (!req.body.issue_text != "") {
          Issue.findOneAndUpdate(
            { _id: req.body._id },
            { issue_text: req.body.issue_text },
            { new: true }
          );
        }

        if (req.body.created_by != "") {
          Issue.findOneAndUpdate(
            { _id: req.body._id },
            { created_by: req.body.created_by },
            { new: true }
          );
          res.send();
        }

        if (req.body.assigned_to != "") {
          Issue.findOneAndUpdate(
            { _id: req.body._id },
            { assigned_to: req.body.assigned_to },
            { new: true }
          );
        }

        if (req.body.status_text != "") {
          Issue.findOneAndUpdate(
            { _id: req.body._id },
            { status_text: req.body.status_text },
            { new: true }
          );
        }

        if (req.body.open == "false") {
          Issue.findOneAndUpdate(
            { _id: req.body._id },
            { open: req.body.open },
            { new: true }
          );
        }

        Issue.findOneAndUpdate(
          { _id: req.body._id },
          { updated_on: new Date() },
          { new: true }
        ).catch((err) => {
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

        let delData = await Issue.findOne({ _id: req.body._id });

        console.log(delData + "delete");
        if (!delData) {
          res.json({ error: "could not delete", _id: req.body._id });
          return;
        }

        Issue.findByIdAndRemove(req.body._id).then(() => {
          res.json({ result: "successfully deleted", _id: req.body._id });
        });
      } catch (err) {
        console.log(err);
        res.json({ error: "could not delete", _id: req.body._id });
      }
    });
};
