require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./model/user');
const becrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

//Initialize express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());


	eventEmitter.on("sayMyName", (name) => {
		console.log("my name is ", name)
	});

	eventEmitter.on("sayMyName", () => {
		console.log("middle name is singh")
	});

	eventEmitter.on("sayMyName", () => {
		console.log("last name is rawat")
	});

	eventEmitter.emit("sayMyName", 'manendra');


///////////////// second example of event emitter /////
	let myEvent = function ringBill(){
		console.log('ringBill event is emitted :>> ');
	}
	eventEmitter.on("emitEvent", myEvent);
	eventEmitter.emit('emitEvent');







// Connecting to DB
mongoose.connect('mongodb://localhost:27017/AddressBook', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('connected to db')
}).catch((error) => {
	console.log(error)
})

// register a User
app.post('/register', async(req, res) => {
	try {
		const userModal = new User({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			phone: req.body.phone
		});

		const token = await userModal.generateAuthToken();
		console.log('token :>> ', token);

		res.cookie("jwt", token, { 
			expires: new Date(Date.now() + 30000),
			httpOnly: true
		 });
		const userResponse = await userModal.save();
		res.send(userResponse);

	} catch (error) {
		console.log('error :>> ', error);
		res.status(500).send({
			response: 'something went wrong'
		});
	}
});

// login a User
app.post('/login', async(req, res) => {

	try {
		const email = req.body.email;
		const password = req.body.password;

		const userModal = await User.findOne({
			email: email
		});
		console.log('userModal :>> ', userModal);

		const isMatch = await becrypt.compare(password, userModal.password)
		console.log('isMatch :>> ', isMatch);

		const token = await userModal.generateAuthToken();
		console.log('modal after login  :>> ', userModal);

		res.cookie("jwt", token, { 
			expires: new Date(Date.now() + 30000),
			httpOnly: true,
			//secure: true
		 });

		 console.log('req.cookies.jwt :>> ', req.cookies.jwt);

		if (isMatch) {
			res.send({
				_id: userModal._id,
				email: userModal.email,
				name: userModal.name,
				phone: userModal.phone
			});
		} else {
			res.status(401).send({
				'response': 'invalid user credentials'
			});
		}
	} catch (error) {
		console.log('error :>> ', error);
		res.status(400).send({
			response: 'invalid login details'
		});
	}

});

// logout user
app.get('/logout', auth, async (req, res) => {

	try {
		res.clearCookie("jwt");
		await req.user.save();
	} catch (error) {
		res.status(500).send(error);
	}
	
});


// access secure page
app.get('/home', auth, (req, res) => {
	
});



// Updating the User
app.post('/update/:id', (req, res) => {
	let address = {}
	if (req.body.name) address.name = req.body.name
	if (req.body.email) address.email = req.body.email
	if (req.body.phone) address.phone = req.body.phone
	if (req.body.place) address.place = req.body.place

	address = {
		$set: address
	}

	Address.update({
		_id: req.params.id
	}, address).then(() => {
		res.send(address)
	}).catch((err) => {
		console.log(error)
	})
});


// Deleting the User from AddressBook
app.delete('/delete/:id', (req, res) => {
	Address.deleteOne({
		_id: req.params.id
	}).then(() => {
		res.send('user deleted')
	}).catch((err) => {
		console.log(error)
	})
});

// Reading a Uder from AddressBook

app.get('/:id', (req, res) => {
	Address.findById(req.params.id, (err, user) => {
		res.send(user);
	})
});


// Initialize the sever
app.listen(3030, () => {
	console.log('sever listening on port:3030');
});
