const { AdoptionRequest, ADOPTION_STATUSES } = require('../models/adoptionRequest.js');
const { validateAdoptionRequestUpdate } = require('../public/js/requestValidator.js');

const getAllRequests = async (req, res) => {
	try {
        // get requests first so cat fields can be searched
        const { search, status } = req.query;
        const requests = await AdoptionRequest.find({}).populate('catId');
        const regex = new RegExp(search, 'i');

        const filtered = requests.filter(req => 
            (!search || regex.test(req.applicant?.name) || regex.test(req.trackingCode) || regex.test(req.catId?.name)) &&
            (!status || req.status === status)
        );

		res.render("adoptionRequests", { requests: filtered, ADOPTION_STATUSES });
	} catch (err) {
        console.error(err);
		res.status(500).send(err);
	}
};

const getRequestById = async (req, res) => {
	try {
		const request = await AdoptionRequest.findById(req.params.id).populate('catId');
        if (!request) return res.status(404).send('Request not found');
		res.render("adoptionRequest", { request, ADOPTION_STATUSES, errors: [] });
	} catch (err) {
        console.error(err);
		res.status(500).send(err);
	}
};

// admins can update adoption requests
const updateRequest = async (req, res) => {
    try {
        const {
            id,
            name,
            email,
            phone,
            address,
            livesWithChildren,
            hasOtherPets,
            whyAdopt,
            status,
            staffNotes
        } = req.body;
        
        const errors = validateAdoptionRequestUpdate({ name, email, whyAdopt, address });

        // if errors exist, show on form and reject update
        if (errors.length > 0) {
            // populate cat information before refreshing page
            const fullRequest = await AdoptionRequest.findById(id).populate('catId');
            return res.status(400).render('adoptionRequest', {
                request: fullRequest,
                ADOPTION_STATUSES,
                errors
            })
        }

        // otherwise update adoption request
        const updatedRequest = await AdoptionRequest.findByIdAndUpdate(
            id,
            {
                applicant: {
                    name,
                    email,
                    phone,
                    address,
                    livesWithChildren: livesWithChildren === 'yes',
                    hasOtherPets: hasOtherPets === 'yes',
                    whyAdopt
                },
                status,
                staffNotes
            },
            { new: true, runValidators: true }
        );

        if (!updatedRequest) {
            return res.status(404).send('New Adoption request not found');
        }
        res.redirect(`/requests/${req.body.id}`);
    } catch (err) {
        console.error(err);
		res.status(500).send(err);
    }
}

module.exports = {
	getAllRequests,
	getRequestById,
    ADOPTION_STATUSES,
    updateRequest
};