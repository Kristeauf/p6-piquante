const Sauce = require("../models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const newSauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  newSauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};
exports.likeOrDislike = (req,res,next)=>{
console.log(req.body.like);
  if (req.body.like === 1) {
    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like }, $push: { usersLiked: req.body.userId } })
        .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
        .catch(error => res.status(400).json({ error }))
} else if (req.body.like === -1) {
    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like)*-1},$push: { usersDisliked: req.body.userId } })
        .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
        .catch(error => res.status(400).json({ error }))
} 



else {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.usersLiked.includes(req.body.userId)) {
                Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes:-1} })
                    .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                    .catch(error => res.status(400).json({ error }))
            } else if (sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: {unlikes:-1} })
                    .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                    .catch(error => res.status(400).json({ error }))
            }
        })
        .catch(error => res.status(400).json({ error }))
}
}
   
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
  
    .then((sauce) => {
      
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};



exports.modifySauce = (req, res, next) => {
  console.log(req.file)
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.updateOne({ _id: req.params.id }, sauceObject)
    .then(() => {
      res.status(201).json({
        message: "sauce updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(401).json({
          error: new Error("Unauthorized request!"),
        });
      }
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id }).then(() => {
          res.status(200).json({
            message: "Deleted!",
          });
        });
      });
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};