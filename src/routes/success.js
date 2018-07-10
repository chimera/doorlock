module.exports = (req, res) => {
  const name = req.query.name
  res.render('success', { name })
}
