var express = require('express');
var app = express();
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;


//Oauth 2.0 realizzata con la libreria googleapis/lib/auth/oauth2client.js
var CLIENT_ID = "INSERIRE_IL_CLIENT_ID";
var CLIENT_SECRET = "INSERIRE_IL_CLIENT_SECRET";
var REDIRECT_URL = "http://localhost:3000/code";

var code;

var OAuth2 = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

var scopes = ["https://www.googleapis.com/auth/drive.install",
			"https://www.googleapis.com/auth/drive",
			"https://www.googleapis.com/auth/drive.appdata", 
			"https://www.googleapis.com/auth/drive.file",
			"https://www.googleapis.com/auth/drive.metadata",
			 "https://www.googleapis.com/auth/drive.photos.readonly"];

var Ourl = OAuth2.generateAuthUrl({
				access_type: 'offline',
				scope: scopes,
				prompt :'consent',
				});
var credentials = new Array();
app.get('/',function(req,res){
	res.send("<br><br><button onclick='window.location.href=\""+ Ourl +"\"'>Log in</button>");
		});
app.get('/code',function(req,res){
	res.send('code: ' +req.query.code + 
			"<br><br><button onclick='window.location.href=\"/token\"'>retrieve Token</button>");
	code = req.query.code;
	console.log("Code is: "+code);
	});
app.get('/token',function(req,res){
	var url = 'https://www.googleapis.com/oauth2/v3/token';
	var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
	var body ="code="+code+"&client_id="+CLIENT_ID+"&client_secret="+CLIENT_SECRET+"&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcode&grant_type=authorization_code";

  
    var request = require('request');


	request.post({
		headers: headers,
		url:     url,
		body: body
		}, function(error, response, body){
			console.log(body );
			res.send(body + "<br><br><button onclick='window.location.href=\"/token_info\"'>Get Token Info</button>"
			+ "<br><br><button onclick='window.location.href=\"/drive\"'>Access Drive</button>");
			my_obj=JSON.parse(body);
			credentials[0] = my_obj.access_token;
			credentials[1] = my_obj.refresh_token;
			console.log("The token is: "+credentials);
		});
	});
app.get('/token_info', function(req, res){
	
    var url = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+credentials[0];
    var request = require('request');

	request.get({
		url:     url
		}, function(error, response, body){
			console.log(body);
			res.send(body+"<br><br><button onclick='window.location.href=\"/drive\"'>Access DRIVE</button>");
		});
    
});
// il Servizio utilizza le API di Drive per scaricare uno tra 3 file prelevabili
var Drive; 
var file1id, file2id, file3id; //i file id che mi servono per lanciare la richiesta di download
var A_obj;
var FileIDs;
var file1, file2, file3; //i nomi dei file
var FileNames = new Array();
app.get('/drive', function(req,res){
	
	Drive = google.drive({version : 'v3', auth: OAuth2});
	console.log("Access_token is :"+credentials[0]);	
	
	var request2 = require('request');
	
	request2.get({
		headers: {'Authorization':'Bearer '+credentials[0]},
		url: "https://www.googleapis.com/drive/v3/files?corpus=user&pageSize=3&spaces=drive&access_token="+credentials[0],
		}, function (error,response,body){
			 A_obj=JSON.parse(body);
			 FileIDs = A_obj.files;
			 console.log(body);
			 file1id = FileIDs[0].id; file1 = FileIDs[0].name;
			 file2id = FileIDs[1].id; file2 = FileIDs[1].name;
			 file3id = FileIDs[2].id; file3 = FileIDs[2].name;			 
			})	
	res.send("<br><br><button onclick='window.location.href=\"/download\"'>Scarica File</button>");	
	});
app.get('/download', function(req,res){
		res.send("<br><br><button onclick='window.location.href=\"/download/1\"'>File 1</button>"+
				"<br><br><button onclick='window.location.href=\"/download/2\"'>File 2</button>"+
				"<br><br><button onclick='window.location.href=\"/download/3\"'>File 3</button>");
			});
var fs = require('fs');
 
app.get('/download/1',function(req,res){
	OAuth2.refreshToken_(credentials[1], function(err){
		if(err) console.log("token non ripristinato!")
		});
	var dest = fs.createWriteStream(file1+'.pdf');
	var request = require('request');
	var url = "https://www.googleapis.com/drive/v3/files/"+file1id+"/export?mimeType=application%2fpdf";
	var headers = {'Authorization':'Bearer '+credentials[0]};
	
	request.get({
		headers: headers,
		url: url}).on('error', function (err) {
      console.log('Error downloading file', err);
      process.exit();
    }).pipe(dest);
	 dest.on('finish', function () {
        console.log('Downloaded %s!', file1);
        process.exit();
      }).on('error', function (err) {
        console.log('Error writing file', err);
        process.exit();
      });
	})
app.get('/download/2',function(req,res){
	OAuth2.refreshToken_(credentials[1], function(err){
		if(err) console.log("token non ripristinato!")
		});
	var dest = fs.createWriteStream(file2+'.pdf');
	var request = require('request');
	var url = "https://www.googleapis.com/drive/v3/files/"+file2id+"/export?mimeType=application%2fpdf";
	var headers = {'Authorization':'Bearer '+credentials[0]};
	
	request.get({
		headers: headers,
		url: url}).on('error', function (err) {
      console.log('Error downloading file', err);
      process.exit();
    }).pipe(dest);
	 dest.on('finish', function () {
        console.log('Downloaded %s!', file2);
        process.exit();
      }).on('error', function (err) {
        console.log('Error writing file', err);
        process.exit();
      });
	})
app.get('/download/3',function(req,res){
	OAuth2.refreshToken_(credentials[1], function(err){
		if(err) console.log("token non ripristinato!")
		});
	var dest = fs.createWriteStream(file3+'.pdf');
	var request = require('request');
	var url = "https://www.googleapis.com/drive/v3/files/"+file3id+"/export?mimeType=application%2fpdf";
	var headers = {'Authorization':'Bearer '+credentials[0]};
	
	request.get({
		headers: headers,
		url: url}).on('error', function (err) {
      console.log('Error downloading file', err);
      process.exit();
    }).pipe(dest);
	 dest.on('finish', function () {
        console.log('Downloaded %s!', file3);
        process.exit();
      }).on('error', function (err) {
        console.log('Error writing file', err);
        process.exit();
      });
	})
app.listen(3000,function(req,res){
	console.log("server in ascolto alla porta 3000, connettersi a localhost");
	});
	
