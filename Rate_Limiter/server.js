const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const mongoose = require('mongoose');

const DEV_PORT = 3000;

const app = express();
const router = express.Router();

mongoose.connect('mongodb://localhost/my_database');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

const IpRecordSchema = new mongoose.Schema({
	ipAddr: String,
	startTime: { type: Date, default: Date.now },
	counter: { type: Number, default: 999 },
});

const IpRecordModel = mongoose.model("IpRecord", IpRecordSchema);

const checkInDB = (ip, myNext) => {
	const query  = IpRecordModel.where({ ipAddr: ip });
	query.findOne((err, ipRecord) => {
		if (err) {
			let newRecord = new IpRecordModel();
			newRecord.ipAddr = ip;
			newRecord.save();
			myNext(newRecord.counter, newRecord.startTime.toString());
		} else if (ipRecord) {
			const now = Date.now();
			if (Date.now() - ipRecord.startTime > 3600000) {
				ipRecord.startTime.startTime = now;
				ipRecord.counter = 999;
				ipRecord.save();
			} else if (ipRecord.counter > 0) {
				ipRecord.counter -= 1;
				ipRecord.save();
			}
			myNext(ipRecord.counter, ipRecord.startTime.toString());
		} else {
			// should not happen

			let newRecord = new IpRecordModel();
			newRecord.ipAddr = ip;
			newRecord.save();
			myNext(newRecord.counter, newRecord.startTime.toString());
		}
	});
};

const checkRateLimit = (req, res, next) => {
	let remaining, time;
	// console.log(req.connection.remoteAddress);
	checkInDB(req.connection.remoteAddress, (remaining, time) => {
		res.set({
			"X-RateLimit-Remaining": remaining,
			"X-RateLimit-Reset": time,
		});

		if (remaining == 0) {
			let err = new Error();
			err.status = 429;
			next(err);
			return;
		}
		
		next();
	});
};

router.get('/', function(req, res, next) {
	console.log(res.get("X-RateLimit-Remaining"));
	console.log(res.get("X-RateLimit-Reset"));
	res.render('index', {
		"remaining": res.get("X-RateLimit-Remaining"),
		"reset": res.get("X-RateLimit-Reset")
	});
});


app.use(checkRateLimit);
app.use('/', router);
app.use((err, req, res, next) => {
	res.sendStatus(429);
});

app.listen(DEV_PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});
