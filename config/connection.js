const mongoose = require('mongoose');

function connect() {
  mongoose.connect("mongodb+srv://regancrowley1:xewTYZA6ttZZgQ5r@cluster0.skizpzi.mongodb.net/social_network",
    {
      useNewUrlParser: true,
      // auto_reconnect: true,
    }
  )

  console.log('DB connected');
}

mongoose.connection.on('error', function (error) {
  console.log(`Could not connect to MongoDB: ${error}`);
});

module.exports = { connect };