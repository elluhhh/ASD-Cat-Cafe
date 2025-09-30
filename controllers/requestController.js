const { AdoptionRequest, ADOPTION_STATUSES } = require('../models/adoptionRequest.js');

const getAllRequests = async (req, res) => {
	try {
		const requests = await AdoptionRequest.find({}).populate('catId');
		res.render("adoptionRequests", { requests });
	} catch (err) {
        console.error(err);
		res.status(500).send(err);
	}
};

const getRequestById = async (req, res) => {
	try {
		const request = await AdoptionRequest.findById(req.params.id).populate('catId', 'name');
        if (!request) return res.status(404).send('Request not found');
		res.render("adoptionRequest", { request, ADOPTION_STATUSES, errors: [] });
	} catch (err) {
        console.error(err);
		res.status(500).send(err);
	}
};
module.exports = {
	getAllRequests,
	getRequestById,
    ADOPTION_STATUSES
};