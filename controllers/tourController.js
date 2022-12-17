const APIFeatures = require('../utilis/apiFeature');
const Tour = require('../models/tourModel');

exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = '5',
    req.query.sort = '-ratingAverage,price',
    req.query.fields = 'name,price,duration'

    next()
};

exports.getAllTours = async (req, res) => {

  try {

    // EXECUTING THE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    })

  } catch (err) {
    res.status(500).json({ status: 'error', err})
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    })

  } catch (err) {
    res.status(500).json({ status: 'error'})
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);

    res.status(200).json({
      status: 'success',
      data: tour
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    })

  } catch (err) {
    res.status(500).json({ status: 'error'})
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      data: null
    })

  } catch (err) {
    res.status(500).json({ status: 'error'})
  }
};

exports.tourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: -1 }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getMontyPlan = async (req, res) => {
  try {

    const year = req.params.year * 1;

    const data = await Tour.aggregate([
      {
        $unwind: "$startDates"
      },
      //getting the tour by year
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      //grouping the tour by year and name and total number of tours
      {
        $group: {
          _id: {
            $month: "$startDates"
          },
          totalTours: {
            $sum: 1
          },
          tours: {
            $push: "$name"
          }
        }
      },
      {
        $addFields: {
          month: "$_id"
        }
      },
      {
        $project: {
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      total: data.length,
      data: data
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
  res.status(200).json({
    "message" : "Monty plan"
  })
};
