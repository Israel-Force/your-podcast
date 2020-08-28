const mongoose = require("mongoose");

const Podcast = require("../model/podcast");

exports.get_all_podcast = (req, res, next) => {
  Podcast.find()
    .select("_id title description by")
    .populate("user", "firstName lastName")
    .exec()
    .then((doc) => {
      const response = {
        count: doc.length,
        podcast: doc.map((document) => {
          return {
            id: document._id,
            title: document.title,
            filePath: document.filePath,
            description: document.description,
            by: document.by,
            user: document.user,
            request: {
              type: "GET",
              url: "http://localhost:4000/podcast/" + document._id,
            },
          };
        }),
      };
      res.status(200).json({
        message: "handling general get request to /podcast",
        podcasts: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_a_particular_podcast = (req, res, next) => {
  const id = req.params.podcast_id;
  Podcast.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          message: "handling general get request to /podcast" + doc._id,
          podcast: {
            title: doc.title,
            filePath: doc.filePath,
            description: doc.description,
            by: doc.by,
            request: {
              type: "GET",
              description: "GET_ALL_PODCAST",
              url: "http://localhost:4000/podcast/",
            },
          },
        });
      } else {
        res.status(404).json({
          message: "no such podcast",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.upload_podcast = (req, res, next) => {
  const { title, description, by } = req.body;
  const user = req.user.userId;
  if (req.file !== undefined) {
    const podcast = new Podcast({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      filePath: req.file.path,
      by,
      user,
    });
    podcast
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Save Podcast Successfully",
          createdPodcast: {
            podacst: {
              title: result.title,
              filePath: result.filePath,
              description: result.description,
              by: result.by,
              request: {
                type: "POST",
                url: "http://localhost:4000/podcast/" + result._id,
              },
            },
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.status(400).json({
      message: "wrong file type",
    });
  }
};

exports.delete_a_podcast = (req, res, next) => {
  const id = req.params.podcast_id;
  Podcast.findOneAndDelete({ _id: id }, (err, doc) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    } else if (doc !== null) {
      res.status(200).json({
        message: "deleted successfully",
        request: {
          type: "POST",
          description: "You can upload a podcast with the body below",
          body: {
            title: "String",
            filePath: "String",
            description: "String",
            by: "String",
          },
          url: "http://localhost:4000/podcast",
        },
      });
    } else {
      res.status(404).json({
        message: " podcast does not exist",
      });
    }
  });
};

exports.update_a_podcast = (req, res, next) => {
  const id = req.params.podcast_id;
  const { title, description, by } = req.body;
  Podcast.findOneAndUpdate(
    { _id: id },
    {
      title,
      description,
      by,
    },
    {
      new: true,
    },
    (err, doc) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      } else {
        res.status(200).json({
          message: "podcast updated",
          UpdatedPodcast: {
            title: doc.title,
            filePath: doc.filePath,
            description: doc.description,
            by: doc.by,
            request: {
              type: "GET",
              description: "GET_ALL_PODCAST",
              url: "http://localhost:4000/podcast",
            },
          },
        });
      }
    }
  );
};
