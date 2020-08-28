const express = require("express");
const router = express.Router();
const multer = require("multer");

const podcastController = require("../controller/podcast");
const authCheck = require("../../authCheck");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 15,
  },
});

router.get("/", authCheck, podcastController.get_all_podcast);

router.get("/:podcast_id", podcastController.get_a_particular_podcast);

router.post("/", authCheck, upload.single("audio"), podcastController.upload_podcast);

router.delete("/:podcast_id", authCheck, podcastController.delete_a_podcast);

router.put("/:podcast_id", authCheck, podcastController.update_a_podcast);

module.exports = router;
