const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Address = require('./model/models')


//I nitialize express app
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


// Connecting to DB
mongoose.connect('mongodb://localhost:27017/AddressBook', {useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
	console.log('connected to db')
}).catch((error) => {
	console.log(error)
})


// Reading a Uder from AddressBook

app.get('/:id', (req, res) =>{
	Address.findById(req.params.id, (err, user) =>{
		res.send(user)
	})
})

// Adding a User to AddressBook
app.post('/register', (req, res) => {

    console.log('req.body :>> ', req.body);

	name = req.body.name,
	email = req.body.email,
	phone = req.body.phone,
	place = req.body.place

	let newAddress = new Address({
		name: name,
		email: email,
		phone: phone,
		place: place
	})

	newAddress.save().then((address) => {
		res.send(address)
	}).catch((err) => {
		console.log(err)
	})
})

// Updating the User

app.post('/update/:id', (req, res) => {
	let address = {}
	if (req.body.name) address.name = req.body.name
	if (req.body.email) address.email = req.body.email
	if (req.body.phone) address.phone = req.body.phone
	if (req.body.place) address.place = req.body.place

	address = { $set: address }

	Address.update({_id: req.params.id}, address).then(() => {
		res.send(address)
	}).catch((err) => {
		console.log(error)
	})
})


// Deleting the User from AddressBook

app.delete('/delete/:id', (req, res) => {
	Address.deleteOne({_id: req.params.id}).then(() => {
		res.send('user deleted')
	}).catch((err) => {
		console.log(error)
	})
})

// Initialize the sever
app.listen(3030, () => {
    console.log('sever listening on port:3030');
});