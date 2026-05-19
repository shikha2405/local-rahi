const express = require('express');

const router = express.Router();






const axios = require('axios');

const GOOGLE_API_KEY = 'AIzaSyBNZZaKMouX8HmW258j0g6UR-VoLFm4Zeo';

router.get('/autocomplete', async (req, res) => {
  try {
    const input = req.query.input;

    const url =
      `https://maps.googleapis.com/maps/api/place/autocomplete?input=${input}&components=country:in&key=${GOOGLE_API_KEY}`;

    console.log(url);

    const response = await axios.get(url);

    res.json(response.data);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
});

module.exports = router;