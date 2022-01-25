const notFoundMiddleware = (req, res) =>
	res.status(404).send('Данный маршрут не существует!')

export default notFoundMiddleware