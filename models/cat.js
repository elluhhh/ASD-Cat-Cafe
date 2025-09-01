function createCat(name, gender, dob, breed, price, microchipId, colour, description, photo) {
    return {
        name,
        gender,
        dob,
        breed,
        price,
        microchipId,
        colour,
        description,
        photo,
        isAdopted: false
    };
}

module.export = createCat;