//here only routing is done and if the ro

'use strict';

const createProgram = require('./functions/createProgram');
const updateProgram =require('./functions/updateProgram');
const readProgram =require('./functions/readProgram');
const readIndex=require('./functions/readIndex');

const cors = require('cors');
const nodemailer = require('nodemailer');
var request = require('request');
var mongoose = require('mongoose');
// var image = require('./models/documents');
var dateTime = require('node-datetime');
var path = require('path');
var cloudinary = require('cloudinary').v2;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var crypto = require('crypto');
var cfenv = require('cfenv');
var express = require('express');
module.exports = router => {

    router.get('/', (req, res) => res.end('Welcome to vfm service,please hit a service !'));


    router.post('/registerUser', cors(), (req, res1) => {
        console.log("entering register function ");

        const email_id = req.body.email;

        console.log(email_id);
        const password_id = req.body.password;
        console.log(password_id);
        const userObjects = req.body.userObject;
        console.log(userObjects);
        const usertype_id = req.body.usertype;
        console.log(usertype_id);
        var json = {
            "email": email_id,
            "password": password_id,
            "userObject": userObjects,
            "usertype": usertype_id
        };

        var options = {
            url: 'https://apidigi.herokuapp.com/registerUser',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: json
        };


        if (!email_id || !password_id || !usertype_id) {

            res1.status(400).json({
                message: 'Invalid Request !'
            });

        } else {

            request(options, function(err, res, body) {
                if (res && (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 409)) {

                    res1.status(res.statusCode).json({
                        message: body.message
                    })
                }

            });
        }
    });
    // login -  routes user input to login API.
    router.post('/login', cors(), (req, res1) => {
        console.log("entering login function ");

        const emailid = req.body.email;
        console.log(emailid);
        const passwordid = req.body.password;
        console.log(passwordid);

        var json = {
            "email": emailid,
            "password": passwordid,

        };

        var options = {
            url: 'https://apidigi.herokuapp.com/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: json
        };


        if (!emailid || !passwordid) {

            res1.status(400).json({
                message: 'Invalid Request !'
            });

        } else {


            request(options, function(err, res, body) {
                if (res && (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 401 || res.statusCode === 402 || res.statusCode === 404)) {

                    res1.status(res.statusCode).json({
                        message: body.message,
                        token: body.token,
                        usertype: body.usertype,
                        userdetails: body.userDetails


                    })
                }

            });
        }
    });

    //newRequest -  routes user input to function newRequest. 
    router.post("/createProgram", (req, res) => {
        console.log("Routing User Input to createProgram Function.....!")

        var random_no = "";
        var possible = "0254548745486765468426879hgjguassaiooisjgdiooahvhghudrkhvdgi12041453205253200044525846abcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < 4; i++)
            random_no += possible.charAt(Math.floor(Math.random() * possible.length));

        var programid = crypto.createHash('sha256').update(random_no).digest('base64');
        console.log("programid"+programid);
        var status = req.body.status;
        console.log("status"+status);
        var InvolvedParties = req.body.InvolvedParties;
        console.log("InvolvedParties"+InvolvedParties);
        var transactionString = JSON.stringify(req.body.transactionString);
        console.log("transactionString"+transactionString);
        if (!transactionString || !transactionString) {
            res.status(400).json({
                message: 'Invalid Request'
            });
        } else {

            createProgram.createProgram(programid, status, InvolvedParties, transactionString)

                .then(result => {
                    res.status(result.status).json({
                        message: result.message
                        
                    })
                })

                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        }
    });

    // updateProgram -  routes user input to function updateProgram.
    router.post("/updateProgram", (req, res) => {
        console.log("Routing User Input to updateProgram Function.....!")
        
        var programid = req.body.programid;
        var status = req.body.status;
        var transactionString = req.body.transactionString;

        if (!transactionString || !transactionString) {
            res.status(400).json({
                message: 'Invalid Request'
            })
        } else {
            updateProgram.updateProgram(programid, status, transactionString)

                .then(result => {
                    res.status(result.status).json({
                        message: result.message,
                    })
                })

                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        }
    });

    // readRequest - query fetches user input given by user for newRequest.
    router.get("/readProgram", (req, res) => {
        var requestList = [];
      
        if (1 == 1) {
            
            const programid1 = checkToken(req);
            const programid = programid1;
            

            readProgram.readProgram(programid)
                .then(function(result) {
                   
                     return res.json({
                        "status":200,
                        "message": result.query
                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {
            res.status(401).json({
                "status": false,
                message: 'cant fetch data !'
            });
        }
    });

    // readIndex - query fetches user input given by user for newRequest.
    router.get("/readIndex",cors(), (req, res) => {
        var requestList = [];
        if (1 == 1) {

        readIndex.readIndex({
            "user": "dhananjay.p",
            "getusers": "getusers"
        })
        .then(function(result) {
               
              return res.json({
                 "status": 200,
                 "message":  result.query
             });
         })
 
         .catch(err => res.status(err.status).json({
             message: err.message
         }));
        }else {
            res.status(401).json({
                "status": false,
                message: 'cant fetch data !'
            });
        }
    });

   // uploadDocs - uploads files to cloudinary server. 
   router.post('/UploadDocs', multipartMiddleware, function(req, res, next) {
    var url;
          console.log("req.files.image" + JSON.stringify(req.files));
          var imageFile = req.files.file.path;
  
  
         cloudinary.uploader.upload(imageFile,{
                  tags: 'express_sample'
              })
  
             .then(function(image) {
                  console.log('** file uploaded to Cloudinary service');
                  console.dir(image);
                 url = image.url;
             
  
                 return res.send({
                      url :url,
                     message: "files uploaded succesfully"
                      })
                  });
                })

  
      function filterstatus(status) {
      
      if (1 == 1) {
                  
                  
          readIndex.readIndex({
              "user": "dhananjay.p",
              "getusers": "getusers"
          })
                  
          .then(function(result) {
                  
                  
          console.log("result" + result.query)
          var statusfilter = [];
                  
                  
          for (let i = 0; i < result.query.status.length; i++) {
          console.log("status" + status);
          console.log("statusledger" + result.query[i].status);
          if (result.query[i].status=== status) {
                  
          statusfilter.push(result.query[i].status);
          console.log("statusfilter" + statusfilter);
        }
                      }
          return statusfilter;
         })
                  
         .catch(err => res.status(err.status).json({
          message: err.message
         }));
                  
         } else {
             return res.status(401).json({
             message: 'cant fetch data !'
         });
                  
        }
  }
  
    function count(arr) {
      var statusname = [],
          statuscount = [],
          prev;
  
      arr.sort();
      for (var i = 0; i < arr.length; i++) {
          if (arr[i] !== prev) {
              statusname.push(arr[i]);
              statuscount.push(1);
          } else {
              statuscount[statuscount.length - 1]++;
          }
          prev = arr[i];
      }
      console.log("statusname" + statusname);
      var result = [];
      for (var status in statusname) {
  
  
          result.push({
              statusname: statusname[status],
              statuscount: statuscount[status]
          });
      }
  
      return result;
  }

  function checkToken(req) {

      const token = req.headers['authorization'];

      if (token) {

          try {
               (token.length!=0)
               return token
          } catch (err) {
              return false;
          }
      } else {
          return false;
      }
  }

}