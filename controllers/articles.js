const Article = require('../models/article');
const BadRequest = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

const getSavedArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((data) => res.send({ data }))
    .catch((err) => next(err));
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((data) => res.status(201).send({ data }))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequest('Ошибка валидации данных'));
      else next(err);
    });
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId).select('+owner')
    .then((article) => {
      if (!article) throw new NotFoundError('Статья не найдена');
      else if (article.owner.equals(req.user._id)) {
        Article.deleteOne(article)
          .then(() => res.send({ article, message: 'Статья удалена' }))
          .catch((err) => next(err));
      } else {
        throw new ForbiddenError('Нельзя удалять чужие статьи');
      }
    })
    .catch((err) => next(err));
};

module.exports = { getSavedArticles, createArticle, deleteArticle };
