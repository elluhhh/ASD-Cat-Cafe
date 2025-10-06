function validateAdoptionRequestUpdate({ name, email, whyAdopt, address }) {
    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }

    const nameRegex = /^[a-zA-Z\s'-]{2,}$/;
    if (!nameRegex.test(name)) {
        errors.push('Name contains invalid characters');
    }

    if (!email || !email.includes('@')) {
        errors.push('Please enter a valid email address');
    }

    if (address && address.trim().length < 10) {
        errors.push('Please enter a valid residential address');
    }

    if (whyAdopt && whyAdopt.length > 1000) {
        errors.push('Adoption reason must be less than 1000 characters');
    }

    return errors;
}

module.exports = { validateAdoptionRequestUpdate };