const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Train = require('./models/Train');

dotenv.config();

const trains = [
  {
    trainNumber: "12001",
    trainName: "Chennai Express",
    source: "Chennai Central",
    destination: "Mumbai CST",
    departureTime: "06:00",
    arrivalTime: "20:30",
    days: ["Mon", "Wed", "Fri"],
    totalSeats: 500
  },
  {
    trainNumber: "12002",
    trainName: "Coromandel Express",
    source: "Chennai Central",
    destination: "Howrah",
    departureTime: "08:45",
    arrivalTime: "10:30",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    totalSeats: 450
  },
  {
    trainNumber: "12003",
    trainName: "Shatabdi Express",
    source: "Chennai Central",
    destination: "Bangalore",
    departureTime: "06:00",
    arrivalTime: "11:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    totalSeats: 300
  },
  {
    trainNumber: "12004",
    trainName: "Brindavan Express",
    source: "Chennai Central",
    destination: "Bangalore",
    departureTime: "07:30",
    arrivalTime: "12:30",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    totalSeats: 400
  },
  {
    trainNumber: "12005",
    trainName: "Tamil Nadu Express",
    source: "Chennai Central",
    destination: "Delhi",
    departureTime: "22:00",
    arrivalTime: "06:30",
    days: ["Mon", "Wed", "Fri", "Sun"],
    totalSeats: 600
  },
  {
    trainNumber: "12006",
    trainName: "Mysore Express",
    source: "Chennai Central",
    destination: "Mysore",
    departureTime: "09:15",
    arrivalTime: "15:45",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    totalSeats: 350
  },
  {
    trainNumber: "12007",
    trainName: "Mumbai Mail",
    source: "Chennai Central",
    destination: "Mumbai CST",
    departureTime: "21:00",
    arrivalTime: "11:30",
    days: ["Tue", "Thu", "Sat"],
    totalSeats: 550
  },
  {
    trainNumber: "12008",
    trainName: "Hyderabad Express",
    source: "Chennai Central",
    destination: "Hyderabad",
    departureTime: "18:00",
    arrivalTime: "06:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    totalSeats: 400
  },
  {
    trainNumber: "12009",
    trainName: "Rockfort Express",
    source: "Chennai Central",
    destination: "Trichy",
    departureTime: "07:00",
    arrivalTime: "11:30",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    totalSeats: 300
  },
  {
    trainNumber: "12010",
    trainName: "Pearl City Express",
    source: "Chennai Central",
    destination: "Tuticorin",
    departureTime: "08:00",
    arrivalTime: "16:30",
    days: ["Mon", "Wed", "Fri", "Sun"],
    totalSeats: 350
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    await Train.deleteMany({});
    console.log('Cleared existing trains');

    await Train.insertMany(trains);
    console.log('Trains seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();