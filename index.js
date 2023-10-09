const express = require("express"), http = require('http'), UAParser = require('ua-parser-js'), fs = require('fs'), path = require("path"), app = express(), directory = __dirname, htmlfileloc = directory + "/public/pages", rawfileloc = directory + "/public/raw", cssfileloc = directory + "/public/scripts", jsfileloc = directory + "/public/styles", iconfileloc = directory + "/public/icons", errorfileloc = directory + "/public/errors", dynamfileloc = directory + "/public/dynamic", err404loc = errorfileloc + "/404.ejs", err422loc = errorfileloc + "/422.ejs", err403loc = errorfileloc + "/403.ejs", err500loc = errorfileloc + "/500.ejs", conloc = htmlfileloc + "/construction.html", port = 8080, validImageTypes = ['.jpg', '.jpeg', '.png', '.gif'], imgsrv = "https://image-hosting.firepup650.repl.co", axios = require('axios'), und = undefined, users = ["youngchief","coderelijah","bigminiboss","pikachub2005","jayayseaohbee14","9pfs","omegaorbitals"], aliases = {"smallmaxworker":"bigminiboss","9pfs1":"9pfs"}, exec = require('child_process').exec;
var tracks = und, datas = und;
//app.use(require("expressjs-remembering-doomsdaybear"))
app.set('trust proxy', 1)
const cookieCheck = (req, res, next) => {
  const options = {
    maxAge: 1000 * 60 * 60 * 24 * 365 * 20,
    httpOnly: true,
    sameSite: 'strict',
  };
  res.cookie('cookiesEnabled', 'true', options);
  next();
};
const spotifyRequest = ((rawData, name, time, deezerData) => {
  axios.get('https://api.youngchief.xyz/spotify/now').then(res => {
    let data = res.data;
    // console.log(data);
    //data = JSON.parse(data.replace(/'/g, "\""));
    axios.get(`https://api.deezer.com/2.0/track/isrc:${data.isrc}`).then(resp => {
      let dzData = resp.data;
      let song = dzData.title;
      let duration = dzData.duration;
      //console.log(dzData);
      rawData(data,song,duration,dzData);
    }).catch(err => {
      console.log('YCSPR Error (ISRC API):', err.message);
    rawData(data,"Unknown","Unknown",{});
    });
  }).catch(err => {
    console.log('YCSPR Error (YC\'s end):', err.message);
    rawData(und,err.message,und,und);
  });
});
const spotifyQueueRequest = ((rawData, isrcs, names, dzDatas) => {
  axios.get('https://api.youngchief.xyz/spotify/queue').then(res => {
    let data = res.data;
    // console.log(data);
    //data = JSON.parse(data.replace(/'/g, "\""));
    let ids    = [];
    let tracks = [];
    let datas  = [];
    for (track in data.queue) {
      ids.push(data.queue[track]);
      axios.get(`https://api.deezer.com/2.0/track/isrc:${data.queue[track]}`).then(resp => {
        let dzData = resp.data;
        datas.push(dzData);
        let song = dzData.title;
        tracks.push(song);
      }).catch(err => {
        console.log('YCSPR Error (ISRC API):', err.message);
      });
    }
    console.log("DEBUG: TRACKS =",tracks);
    console.log("DEBUG: IDS   =",ids);
    rawData(data,ids,tracks,datas);
  }).catch(err => {
    console.log('YCSPR Error (YC\'s end):', err.message, err);
    rawData(und,err.message,und,und);
  });
});
const spotifyHistoryRequest = ((rawData, isrcs, names, dzDatas) => {
  axios.get('https://api.youngchief.xyz/spotify/history').then(res => {
    let data = res.data;
    // console.log(data);
    //data = JSON.parse(data.replace(/'/g, "\""));
    let ids    = [];
    tracks = [];
    datas  = [];
    for (track in data.history) {
      ids.push(data.history[track]);
      axios.get(`https://api.deezer.com/2.0/track/isrc:${data.history[track]}`).then(resp => {
        let dzData = resp.data;
        datas.push(dzData);
        let song = dzData.title;
        tracks.push(song);
      }).catch(err => {
        console.log('YCSPR Error (ISRC API):', err.message);
      });
    }
    console.log("DEBUG: TRACKS =",tracks);
    console.log("DEBUG: IDS   =",ids);
    rawData(data,ids,tracks,datas);
  }).catch(err => {
    console.log('YCSPR Error (YC\'s e nd):', err.message, err);
    rawData(und,err.message,und,und);
  });
});
let startTime = Date.now();
let totalPages = 0;
const countPages = (dir, callback) => {
  let count = 0;
  fs.readdir(dir, (err, files) => {
    if (err) return callback(err);
    let pending = files.length;
    if (!pending) return callback(null, count);
    files.forEach(file => {
      let filePath = path.join(dir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return callback(err);
        if (stats.isDirectory()) {
          countPages(filePath, (err, res) => {
            if (err) return callback(err);
            count += res;
            if (!--pending) callback(null, count);
          });
        } else if (stats.isFile() && ['.html', '.ejs'].includes(path.extname(file))) {
          count++;
          if (!--pending) callback(null, count);
        } else {
          if (!--pending) callback(null, count);
        }
      });
    });
  });
};
countPages('public', (err, count) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(count + " pages")
  totalPages = count;
});
function isUser(user) {
  let valid = false;
  for (id in users) {
    if (user === users[id]) {
      valid = true;
    }
  }
  return valid;
};
function isAlias(user) {
  let realUser = "";
  for (var key in aliases) {
    if (key === user) {
      realUser = aliases[key];
    }
  }
  return realUser;
};
function getContributors(dezData) {
  let contribs = dezData.contributors;
  let retValue = "";
  for (value in contribs) {
    if (retValue) {
      retValue = `${retValue}, ${contribs[value].name}`
    } else {
      retValue = contribs[value].name
    }
  }
  console.log(retValue);
  return retValue;
};
// Next function was provided by Youngchief
function secondsToMinutes(seconds) {
  let minutes = Math.floor(seconds / 60); // get the number of whole minutes
  let leftoverSeconds = seconds % 60; // get the remaining seconds
  if (leftoverSeconds >= 10) {
    return minutes + ":" + leftoverSeconds;
  } else {
    return minutes + ":" + leftoverSeconds + "0";
  }
};
function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};
function format(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}
app.use(cookieCheck);
app.use(express.static(cssfileloc));
app.use(express.static(jsfileloc));
app.use(express.static(iconfileloc));
app.get("/images/:filename", function(req, res, next) {
  let path = '/' + req.params.filename;
  let fulllink = imgsrv + path;
  res.redirect(fulllink)
});
app.get("/images/:directory/:filename", function(req, res, next) {
  let path = '/' + req.params.directory + '/' + req.params.filename;
  let fulllink = imgsrv + path;
  res.redirect(fulllink)
});
app.set("view engine", "ejs");
app.get("/cause-error-500", function(req, res, next) {
  throw new Error("Intentional 500 Internal Server Error");
});
app.get("/cause-error-404", function(req, res) {
  res.status(404).render(err404loc, { message: "Intentional 404 Not Found" });
});
app.get("/cause-error-403", function(req, res) {
  res.status(403).render(err403loc, { message: "Intentional 403 Forbidden" });
});
app.get('/', function(req, res) {
  res.sendFile(path.join(htmlfileloc, `index.html`));
});
app.get(/\.html$/, function(req, res) {
  if (!req.url.endsWith('.js') && !req.url.endsWith('.css') && req.url.endsWith('.html')) {
    const strippedUrl = req.url.slice(0, -5);
    return res.redirect(strippedUrl);
  }
  next();
});
app.get("/about-browser", function(req, res) {
  return res.redirect("/about-you");
});
app.get("/youngchief-spotify", function(req, res) {
  return res.redirect("/youngchief/spotify");
});
app.get('/about-you', function(req, res) {
  let uAH = req.headers['user-agent'];
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  let cookiesEnabled = req.headers.cookie ? true : false;
  let platformName = 'Unknown';
  let platformVersion = 'Unknown';
  let deviceModel = 'Unknown';
  let deviceType = 'Unknown';
  let deviceVendor = 'Unknown';
  let agent = new UAParser(uAH);
  platformName = agent.getOS().name;
  platformVersion = agent.getOS().version;
  deviceModel = agent.getDevice().model;
  deviceType = agent.getDevice().type;
  deviceVendor = agent.getDevice().vendor;
  browserName = agent.getBrowser().name;
  browserVersion = agent.getBrowser().version;
  let datarray = [platformName, platformVersion, deviceModel, deviceVendor, browserName, browserVersion];
  let itemid = 0;
  datarray.forEach((item) => {
    if (item == undefined) {
      datarray[itemid] = "Unknown";
    }
    itemid++;
  });
  platformName = datarray[0];
  platformVersion = datarray[1];
  deviceModel = datarray[2];
  deviceVendor = datarray[3];
  browserName = datarray[4];
  browserVersion = datarray[5];
  if (deviceType == undefined) {
    deviceType = 'Unknown, might be desktop.';
  }
  res.render(path.join(dynamfileloc, 'about-you'), {
    userAgent: uAH,
    browserName: browserName,
    browserVersion: browserVersion,
    cookiesEnabled: cookiesEnabled,
    platformName: platformName,
    platformVersion: platformVersion,
    deviceModel: deviceModel,
    deviceType: deviceType,
    deviceVendor: deviceVendor
  });
});
app.get("/server-info", (req, res) => {
  execute("uptime -p", (sysup) => {
    let uptime = process.uptime();
    let author = "Firepup650";
    res.render(dynamfileloc + '/server-info.ejs', {
      author: author,
      uptime: format(process.uptime()),
      system: sysup,
      images: totalPages
    })
  });
});
// Youngchief
app.get("/youngchief/spotify", (req, res) => {
  spotifyRequest((data, song, length, dzData) => {
    let playing   = "Not set by route";
    let progress  = "Not set by route";
    let isrc      = "Not set by route";
    let name      = "Not set by route";
    let raw       = "Not set by route";
    let dur       = "Not set by route";
    let contribs  = "Not set by route";
    let cal       = "Not set by route";
    let end       = "Not set by route";
    let error     = und;
    if (data && data.error) {
      end      = "Youngchief's end";
      raw      = JSON.stringify(data).replace(/,/g,", ");
      cal      = imgsrv+"/error.png";
      error    = data.error;
    } else if (data && data.playing) {
      playing  = data.playing;
      progress = Math.round(data.progress/1000);
      isrc     = data.isrc;
      name     = song;
      dur      = secondsToMinutes(length);
      raw      = JSON.stringify(data).replace(/,/g,", ");
      contribs = getContributors(dzData);
      cal      = dzData.album.cover_xl;
    } else {
      end      = "My end, probably";
      raw      = "Unknown (Server Error)";
      cal      = imgsrv+"/error.png";
      error    = song;
    }
    res.render(dynamfileloc + '/spotify.ejs', {
      playing:  playing,
      progress: secondsToMinutes(progress),
      isrc:     isrc,
      name:     name,
      len:      dur,
      raw:      raw,
      cont:     contribs,
      cal:      cal,
      end:      end,
      err:      error
    });
  });
});
app.get("/youngchief/spotify/queue", (req, res) => {
  spotifyQueueRequest((data, ids, tracks, dzDatas) => {
    let isrcs     = "Not set by route";
    let names     = "Not set by route";
    let raw       = "Not set by route";
    let end       = "Not set by route";
    let error     = und;
    if (data && data.error) {
      end      = "Youngchief's end";
      raw      = JSON.stringify(data).replace(/,/g,", ");
      error    = data.error;
    } else if (data && ids) {
      isrcs    = JSON.stringify(ids).replace(/,/g,", ").replace(/\[/g,"").replace(/\]/g,"").replace(/\"/g,"");
      names    = JSON.stringify(tracks).replace(/,/g,", ").replace(/\[/g,"").replace(/\]/g,"").replace(/\"/g,"");
      raw      = JSON.stringify(data).replace(/,/g,", ");
    } else {
      end      = "My end, probably";
      raw      = "Unknown (Server Error)";
      error    = "Internal Error";
    }
    res.render(dynamfileloc + '/spotify-queue.ejs', {
      isrc:     isrcs,
      name:     names,
      raw:      raw,
      end:      end,
      err:      error
    });
  });
});
app.get("/youngchief/spotify/history", (req, res) => {
  spotifyHistoryRequest((data, ids, tracks, dzDatas) => {
    let isrcs     = "Not set by route";
    let names     = "Not set by route";
    let raw       = "Not set by route";
    let end       = "Not set by route";
    let error     = und;
    if (data && data.error) {
      end      = "Youngchief's end";
      raw      = JSON.stringify(data).replace(/,/g,", ");
      error    = data.error;
    } else if (data && ids) {
      isrcs    = JSON.stringify(ids).replace(/,/g,", ").replace(/\[/g,"").replace(/\]/g,"").replace(/\"/g,"");
      names    = JSON.stringify(tracks).replace(/,/g,", ").replace(/\[/g,"").replace(/\]/g,"").replace(/\"/g,"");
      raw      = JSON.stringify(data).replace(/,/g,", ");
    } else {
      end      = "My end, probably";
      raw      = "Unknown (Server Error)";
      error    = "Internal Error";
    }
    res.render(dynamfileloc + '/spotify-history.ejs', {
      isrc:     isrcs,
      name:     names,
      raw:      raw,
      end:      end,
      err:      error
    });
  });
});
// EOY
app.get('/users/:name', function(req, res) {
  return res.redirect(`/user/${req.params.name}`);
});
app.get('/rating/:name', function(req, res) {
  return res.redirect(`/ratings/${req.params.name}`);
});
app.get('/user/:name', function(req, res) {
  let user = req.params.name
  if (isUser(user)) {
    const htmlFilePath = path.join(htmlfileloc, `users/${user}.html`);
    res.sendFile(htmlFilePath);
  } else {
    let test = isAlias(user);
    if (test) {
      return res.redirect(`/user/${test}`)
    } else {
      res.status(404).render(err404loc, {message: `User "${user}" does not have a user page. Contact @Firepup650 if you believe you have seen this message in error.`});
    }
  }
});
app.get('/ratings/:name', function(req, res) {
  let user = req.params.name
  if (isUser(user)) {
    const htmlFilePath = path.join(htmlfileloc, `ratings/${user}.html`);
    res.sendFile(htmlFilePath);
  } else {
    let test = isAlias(user);
    if (test) {
      return res.redirect(`/ratings/${test}`)
    } else {
      res.status(404).render(err404loc, {message: `User "${user}" does not have a ratings page. Contact @Firepup650 if you believe you have seen this message in error.`});
    }
  }
});
app.get('/:file', function(req, res) {
  const fileName = req.params.file;
  const htmlFilePath = path.join(htmlfileloc, `${fileName}.html`);
  if (fs.existsSync(htmlFilePath) && fileName != "construction") {
    if (fileName.startsWith('forbid')) {
      res.status(403).render(err403loc);
    } else {
      res.sendFile(htmlFilePath);
    }
  } else {
    if (isUser(fileName)) {
      return res.redirect(`/user/${fileName}`)
    } else if (!(isAlias(fileName))) {
    res.status(404).render(err404loc);
    } else {
      return res.redirect(`/user/${isAlias(fileName)}`);
    }
  }
});
app.get('/raw/:file', function(req, res) {
  const fileName = req.params.file;
  const filePath = path.join(rawfileloc, `${fileName}`);
  if (fs.existsSync(filePath)) {
    if (fileName.startsWith('forbid')) {
      res.status(403).render(err403loc);
    } else {
      res.sendFile(filePath);
      /*
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.render(dynamfileloc+"/raw.ejs", {fileName: "Error", fileData: err});
          return;
        }
        res.render(dynamfileloc+"/raw.ejs", {fileName: fileName, fileData: data.replace(/\n/g, "<br />").replace(/=/g, " = ")});
      })
      //*/
    }
  } else {
    res.status(404).render(err404loc, {message: "The requested file was not found on the server."});
  }
});
app.get('/rawFile/:file', function(req, res) {
  const fileName = req.params.file;
  const filePath = path.join(rawfileloc, `${fileName}`);
  if (fs.existsSync(filePath)) {
    if (fileName.startsWith('forbid')) {
      res.status(403).render(err403loc);
    } else {
      //res.sendFile(filePath);
      ///*
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.render(dynamfileloc+"/raw.ejs", {fileName: "Error", fileData: err, raw: false});
          return;
        }
        res.render(dynamfileloc+"/raw.ejs", {fileName: fileName, fileData: data.replace(/\n/g, "<br />"), raw: true});
      })
      //*/
    }
  } else {
    res.status(404).render(err404loc, {message: "The requested file was not found on the server."});
  }
});
app.get('/file/:file', function(req, res) {
  const fileName = req.params.file;
  const filePath = path.join(rawfileloc, `${fileName}`);
  if (fs.existsSync(filePath)) {
    if (fileName.startsWith('forbid')) {
      res.status(403).render(err403loc);
    } else {
      //res.sendFile(filePath);
      ///*
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.render(dynamfileloc+"/raw.ejs", {fileName: "Error", fileData: err, raw: false});
          return;
        }
        res.render(dynamfileloc+"/raw.ejs", {fileName: fileName, fileData: data.replace(/\n/g, "<br />").replace(/=/g, " = "), raw: false});
      })
      //*/
    }
  } else {
    res.status(404).render(err404loc, {message: "The requested file was not found on the server."});
  }
});
app.use(function(req, res, next) {
  res.status(404).render(err404loc);
});
app.use(function(error, req, res, next) {
  res.status(500).render(err500loc, { error });
});
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
app.on("error", error => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      break;
    default:
      throw error;
  }
});
