'use strict';

const e = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

module.exports = function (app) {
  
  // Connect to Database using mongoose
  mongoose.connect(process.env.SECRET_URI, { useNewUrlParser: true, useUnifiedTopology: true});

  //Schema to store new project issues
  const projectSchema = new Schema({
    'project_name': {type: String, required: true},
    'assigned_to': String,
    'status_text': String,
    'open': Boolean,
    'issue_title': {type: String, required: true},
    'issue_text': {type: String, required: true},
    'created_by': {type: String, required: true},
    'created_on': Date,
    'updated_on': Date
  });

  const ProjectIssue = mongoose.model('Issue', projectSchema);

  app.route('/api/issues/:project')

    .get(function (req, res){
      console.log(req.query);
      let project = req.params.project;

      let projectJson = req.query;
      projectJson['project_name'] = project;

      ProjectIssue.find(projectJson, (err, data) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log(data);
          res.send(data);
        }
      });
      
    })
    
    .post(function (req, res){
      console.log(req.body);
      console.log(req.params.project);
      
      const newIssue = new ProjectIssue({
        'project_name': req.params.project,
        'assigned_to': (req.body['assigned_to'] ? req.body['assigned_to'] : ""),
        'status_text': (req.body['status_text'] ? req.body['assigned_to'] : ""),
        'open': true,
        'issue_title': req.body['issue_title'],
        'issue_text': req.body['issue_text'],
        'created_by': req.body['created_by'],
        'created_on': new Date(),
        'updated_on': new Date()
      }).save((err, data) => {
        if (err) {
          console.log(err);
          res.json({error: 'required field(s) missing'});
        } else {
          console.log(data);
          res.json({
            'assigned_to': data['assigned_to'],
            'status_text': data['status_text'],
            'open': data['open'],
            '_id': data['_id'],
            'issue_title': data['issue_title'],
            'issue_text': data['issue_text'],
            'created_by': data['created_by'],
            'created_on': data['created_on'],
            'updated_on': data['updated_on']
          });
        }
      })
      
      let project = req.params.project;
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
