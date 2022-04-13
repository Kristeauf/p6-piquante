const Sauce = require("../models/Sauce")
module.exports = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        if (sauce.userId !== req.auth.userId) {
            res.status(403).json({
                error: new Error("forbidden request"),
            });
        }

    })
    next()
}
