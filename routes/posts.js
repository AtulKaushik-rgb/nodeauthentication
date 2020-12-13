const router = require("express").Router();
const bodyParser = require("body-parser");
const verify = require('./verifytoken')

router.get("/",verify, (req, res) => {

    console.log('inside posts route')
  res.json({
    posts: {
      title: "my first post",
      description: "random data you shouldnt access",
    },
  });
});

module.exports = router;
