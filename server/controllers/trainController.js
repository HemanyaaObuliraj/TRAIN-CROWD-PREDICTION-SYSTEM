const Train = require('../models/Train');

// GET ALL TRAINS
exports.getAllTrains = async (req, res) => {
  try {
    const trains = await Train.find();
    res.status(200).json(trains);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// SEARCH TRAINS BY SOURCE + DESTINATION
exports.searchTrains = async (req, res) => {
  try {
    const { source, destination } = req.query;

    const trains = await Train.find({
      source: { $regex: source, $options: 'i' },
      destination: { $regex: destination, $options: 'i' }
    });

    if (trains.length === 0) {
      return res.status(404).json({ message: 'No trains found' });
    }

    res.status(200).json(trains);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getLiveTrains = async (req, res) => {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = days[now.getDay()];
    const currentTime = currentHour * 60 + currentMinute;

    // Get all trains running today
    const trains = await Train.find({ days: today });

    // Filter trains currently running
    const liveTrains = trains.filter(train => {
      const [depHour, depMin] = train.departureTime.split(':').map(Number);
      const [arrHour, arrMin] = train.arrivalTime.split(':').map(Number);
      
      const depTime = depHour * 60 + depMin;
      let arrTime = arrHour * 60 + arrMin;

      // Handle overnight trains
      if (arrTime < depTime) arrTime += 24 * 60;

      return currentTime >= depTime && currentTime <= arrTime;
    });

    // Add crowd level to each train
    const liveTrainsWithCrowd = liveTrains.map(train => {
      const [depHour] = train.departureTime.split(':').map(Number);
      let crowdLevel;

      if ((depHour >= 7 && depHour <= 9) || (depHour >= 17 && depHour <= 20)) {
        crowdLevel = 'High';
      } else if (today === 'Sat' || today === 'Sun') {
        crowdLevel = 'Medium';
      } else {
        crowdLevel = 'Low';
      }

      return { ...train._doc, crowdLevel };
    });

    res.status(200).json(liveTrainsWithCrowd);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET CROWD LEVEL
exports.getCrowdLevel = async (req, res) => {
  try {
    const { hour, day } = req.query;

    const h = parseInt(hour);
    let crowdLevel;

    if ((h >= 7 && h <= 9) || (h >= 17 && h <= 20)) {
      crowdLevel = 'High';
    } else if (day === 'Sat' || day === 'Sun') {
      crowdLevel = 'Medium';
    } else {
      crowdLevel = 'Low';
    }

    res.status(200).json({ crowdLevel });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};