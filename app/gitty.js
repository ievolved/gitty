
var https = require("https");
var fs = require("fs");
var settings = require("./settings.js").settings;

console.log("");
console.log(process.cwd());
console.log("");

var url = "https://api.github.com/orgs/ga-wdi-lessons/repos";

var options = {
  host: "api.github.com",
  path: "/orgs/ga-wdi-lessons/repos",
  headers: { "user-agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13" }
};

var fromFile = fs.readFileSync("./ga-wdi-lessons.txt", "utf8");

function loadOrgRepos(callback) {
  return https.get(options, function(response) {
    response.setEncoding("utf8");

    var data = "";
    response.on("data", function(chunk) {
      data += chunk;
    });

    response.on("end", function() {
      try {
        var json = JSON.parse(data);
      }
      catch (error) {
        console.error("Unable to parse response as JSON.", error.message);
        return callback(error);
      }
      json = data;
      callback(null, json);
    });
  }).on("error", function(error) {
    console.error("Error with the request.", error.message);
  });
}

if (fromFile === undefined) {
  loadOrgRepos(function (err, json) {
    iterateEachRepo(json);
  });
}
else {
  var json = JSON.parse(fromFile.toString("utf8"));
  iterateEachRepo(json);
}


function iterateEachRepo(json) {
  for(var repo in json) {
    console.log(json[repo].name);
  };
}