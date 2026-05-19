const axios = require('axios');

exports.searchPlaces = async (req, res) => {
  try {
    const input = req.query.input;

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
      {
        params: {
          input,
          key: process.env.GOOGLE_MAPS_API_KEY,
          components: 'country:in',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};