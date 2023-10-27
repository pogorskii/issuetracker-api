const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("tests for routes", function () {
    /*#1*/
    test("Create an issue with every field: POST request ", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/projects")
        .send({
          issue_title: "title",
          issue_text: "text",
          created_by: "cm",
          assigned_to: "cm",
          status_text: "text 2",
          open: true,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(res.body.created_by, "cm");
          assert.equal(res.body.assigned_to, "cm");
          assert.equal(res.body.status_text, "text 2");
          assert.equal(res.body.open, true);

          done();
        });
    });
    /*test2*/

    test("Create an issue with only required fields: POST request", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/projects")
        .send({
          issue_title: "Issue",
          issue_text: "Functional Test",
          created_by: "fCC",
          assigned_to: "",
          status_text: "",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Issue");
          assert.equal(res.body.created_by, "fCC");
          assert.equal(res.body.issue_text, "Functional Test");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        });
    });
    /*test3*/

    test("Create an issue with missing required fields: POST request ", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/projects")
        .send({
          issue_title: "Issue",
          issue_text: "Functional Test",
          created_by: "fCC",
          assigned_to: "",
          status_text: "",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Issue");
          assert.equal(res.body.created_by, "fCC");
          assert.equal(res.body.issue_text, "Functional Test");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        });
    });

    /*test4*/

    test("View issues on a project: GET request", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")

        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length > 0, true);
          done();
        });
    });
    /*one filter*/
    test("View issues on a project with one filter: GET request ", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")

        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length > 0, true);
          done();
        });
    });
    /*test5*/

    test("View issues on a project with multiple filters: GET request ", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")

        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.length > 0, true);
          done();
        });
    });
    /*test6*/

    test("Update one field on an issue: PUT request", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: "653b646e216593c96e346dea",
          issue_title: "put test",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, "653b646e216593c96e346dea");

          done();
        });
    });
    /*test7*/
    test("Update multiple fields on an issue: PUT request", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: "653b646e216593c96e346dea",
          issue_title: "put test",
          issue_text: "put test",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, "653b646e216593c96e346dea");

          done();
        });
    });
    /*test8*/
    test("Update an issue with missing _id: PUT", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/projects")
        .send({
          _id: "",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");

          done();
        });
    });
    /*nofields to update*/
    test("Update an issue with no fields to update: PUT", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/projects")
        .send({
          _id: "653b646e216593c96e346dea",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");

          done();
        });
    });
    /*test9*/
    test("update an issue with an invalid _id: PUT", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/projects")
        .send({
          _id: "",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");

          done();
        });
    });

    /*test10*/
    test("Delete an issue: DELETE request to", function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/projects")
        .send({
          _id: "6469",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");

          done();
        });
    });
    /*test11*/

    test("Delete an issue with an invalid _id: DELETE", function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/projects")
        .send({
          _id: "6469",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");

          done();
        });
    });
    /*test12*/
    test("Delete an issue with missing _id", function (done) {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/projects")
        .send({
          _id: "",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");

          done();
        });
    });
  });
});
