const rideService = require('../services/rideService');

exports.offerRide = async (req, res) => {
  try {
    const ride = await rideService.offerRide(req.body);
    return res.json({
      success: true,
      message: 'Ride offered successfully',
      data: ride,
    });
  } catch (error) {
    const isNotFound = error.message === 'User not found';
    return res.status(isNotFound ? 404 : 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

exports.getMyRides = async (req, res) => {
  try {
    const { phone } = req.params;
    const rides = await rideService.getMyRides(phone);
    return res.json({
      success: true,
      data: rides,
    });
  } catch (error) {
    const isNotFound = error.message === 'User not found';
    return res.status(isNotFound ? 404 : 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

exports.findRides = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return ApiResponse.error(res, 'User not authenticated', 401);
    const rides = await rideService.findRides(req.query, userId);
    return res.status(200).json({
      success: true,
      data: rides,
    });
  } catch (error) {
    const isValidationError = 
      error.message === 'pickup and drop locations are required' ||
      error.message === 'pickup is required' ||
      error.message === 'drop is required';
    return res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: error.message || 'Failed to fetch rides',
    });
  }
};

exports.getRideDetails = async (req, res) => {
  try {
    const { ride_id } = req.params;
    const details = await rideService.getRideDetails(ride_id);
    return res.status(200).json({
      success: true,
      data: details,
    });
  } catch (error) {
    const isNotFound = error.message === 'Ride not found';
    return res.status(isNotFound ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to fetch ride details',
    });
  }
};

exports.startRide = async (req, res) => {
  try {
    const { ride_id } = req.params;
    const ride = await rideService.startRide(ride_id);
    return res.status(200).json({
      success: true,
      message: 'Ride started successfully',
      data: {
        ride_id: ride.id,
        ride_status: ride.status,
      },
    });
  } catch (error) {
    const isNotFound = error.message === 'Ride not found';
    return res.status(isNotFound ? 404 : 400).json({
      success: false,
      message: error.message || 'Failed to start ride',
    });
  }
};

exports.cancelRide = async (req, res) => {
  try {
    const { ride_id } = req.params;
    await rideService.cancelRide(ride_id);
    return res.json({
      success: true,
      message: 'Ride cancelled successfully',
    });
  } catch (error) {
    const isNotFound = error.message === 'Ride not found';
    return res.status(isNotFound ? 404 : 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

exports.updateRide = async (req, res) => {
  try {
    const { ride_id } = req.params;
    const ride = await rideService.updateRide(ride_id, req.body);
    return res.json({
      success: true,
      message: 'Ride updated successfully',
      data: ride,
    });
  } catch (error) {
    const isNotFound = error.message === 'Ride not found';
    return res.status(isNotFound ? 404 : 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};

exports.getUserVehicles = async (req, res) => {
  try {
    const { phone } = req.params;
    const vehicles = await rideService.getUserVehicles(phone);
    return res.json({
      success: true,
      data: vehicles,
    });
  } catch (error) {
    const isNotFound = error.message === 'User not found';
    return res.status(isNotFound ? 404 : 500).json({
      success: false,
      message: error.message || 'Server Error',
    });
  }
};