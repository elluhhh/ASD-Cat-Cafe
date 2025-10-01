const { AdoptionRequest, ADOPTION_STATUSES } = require('../models/adoptionRequest.js');

const getAllRequests = async (req, res) => {
	try {
        const { search, status } = req.query;
        // let filter = {};
        
        // if (search) {
        //     const regex = new RegExp(search, 'i');
        //     filter.$or = [
        //         { 'applicant.name': regex },
        //         { 'trackingCode': regex }
        //     ];
        // }
        // if (status) filter.status = status;

        const requests = await AdoptionRequest.find({}).populate('catId');

        const regex = new RegExp(search, 'i');

        const filtered = requests.filter(req => 
            (!search || regex.test(req.applicant?.name) || regex.test(req.trackingCode) || regex.test(req.catId?.name)) &&
            (!status || req.status === status)
        );

		// const requests = await AdoptionRequest.find(filter).populate('catId', 'name');
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
        
        const errors = [];
        if (!name || name.trim().length < 2) {
            errors.push('Name must be at least 2 characters');
        }

        if (!email || !email.includes('@')) {
            errors.push('Please enter a valid email address');
        }

        if (whyAdopt && whyAdopt.length > 1000) {
            errors.push('Adoption reason must be less than 1000 characters');
        }

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