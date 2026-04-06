import { Author } from '../model/Author.js';

export const getAllAuthors = (req, res, next) => {
  Author.findAll()
    .then((authors) => {
      res.status(200).json({ author: authors });
    })
    .catch((err) => res.status(500).json({ message: err }));
};

export const getAuthor = (req, res, next) => {
  const { authorId } = req.params;

  Author.findByPk(authorId)
    .then((author) => {
      if (!author) {
        return res.status(404).json({ message: 'Author not found' });
      }
      res.status(200).json({ author: author });
    })
    .catch((err) => res.status(500).json({ message: err }));
};

export const createAuthor = (req, res, next) => {
  const { name, bio } = req.body;

  if (!name) {
    res.status(400).send({
      message: 'Name is required.',
    });
  }
  if (!bio) {
    res.status(400).send({
      message: 'Bio is required.',
    });
  }

  Author.create({
    name: name,
    bio: bio,
  })
    .then((result) => {
      res.status(201).json({
        message: 'Author created successfuly!',
        user: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateAuthor = (req, res, next) => {
  const { authorId } = req.params;
  const { name, bio } = req.params;

  if (!name) {
    res.status(400).json({ message: 'Name is required.' });
  }
  if (!bio) {
    res.status(400).json({ message: 'Bio is required.' });
  }

  Author.findByPk(authorId)
    .then((author) => {
      if (!author) {
        return res.status(404).json({ message: 'Author not found.' });
      }
      author.name = name;
      author.bio = bio;
      return author.save();
    })
    .then((result) => {
      if (!result) return;
      res.status(200).json({ message: 'Author updated!', author: result });
    })
    .catch((err) => console.log(err));
};

export const deleteAuthor = async (req, res, next) => {
  const { authorId } = req.params;

  Author.findByPk(authorId)
    .then((author) => {
      if (!author) {
        return res.status(404).json({ message: 'Author not found!' });
      }
      return Author.destroy({
        where: {
          id: authorId,
        },
      });
    })
    .then((result) => {
      if (!result) return;
      res.status(200).json({ message: 'Author deleted!' });
    })
    .catch((err) => console.log(err));
};
