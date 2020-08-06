const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getSavedArticles, createArticle, deleteArticle } = require('../controllers/articles');

router.get('/', getSavedArticles);
router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required()
      .regex(/^https?:\/\/(www\.)?(((\d{1,3}\.){3}\d{1,3})|([А-ЯЁа-яё0-9][0-9А-ЯЁа-яё\-.]*\.[А-ЯЁа-яё]+|[a-zA-Z0-9][a-zA-Z0-9\-.]*\.[a-zA-Z]+))(:[1-9]\d{1,4})?\/?([-0-9/a-zA-Z&=?+%._]+#?)?$/)
      .error(new Error('Ошибка валидации url')),
    image: Joi.string().required()
      .regex(/^https?:\/\/(www\.)?(((\d{1,3}\.){3}\d{1,3})|([А-ЯЁа-яё0-9][0-9А-ЯЁа-яё\-.]*\.[А-ЯЁа-яё]+|[a-zA-Z0-9][a-zA-Z0-9\-.]*\.[a-zA-Z]+))(:[1-9]\d{1,4})?\/?([-0-9/a-zA-Z&=?+%._]+#?)?$/)
      .error(new Error('Ошибка валидации url')),
  }),
}), createArticle);
router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
}), deleteArticle);

module.exports = router;
