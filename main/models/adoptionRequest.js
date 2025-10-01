const mongoose = require('mongoose');

const STATUSES = ['RECEIVED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'NEEDS_INFO'];

const adoptionRequestSchema = new mongoose.Schema({
    trackingCode: { type: String, index: true, unique: true },
    applicant: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        address: String,
        livesWithChildren: { type: Boolean, default: false },
        hasOtherPets: { type: Boolean, default: false },
        whyAdopt: { type: String, maxlength: 1000 },
    },
    catId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cat', required: false },
    status: { type: String, enum: STATUSES, default: 'RECEIVED', index: true },
    staffNotes: String,
}, { timestamps: true });

module.exports = {
    AdoptionRequest: mongoose.model('AdoptionRequest', adoptionRequestSchema),
    ADOPTION_STATUSES: STATUSES,
};