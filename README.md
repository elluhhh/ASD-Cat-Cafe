## ASD Cat Cafe

GitHub
https://github.com/elluhhh/ASD-Cat-Cafe

Azure Web App
https://asd-cat-cafe-ajhtfwf3a8h5ezeh.australiaeast-01.azurewebsites.net

## Run Locally
    * Download from GitHub Repo
    * Unzip file
    * Open Command Prompt and change the current directory to the directory of the unzipped file
    * Run "npm install" to download necessary modules
    * Run "npm start" to start server
    * View website on http://localhost:8000/

## Staff Login

email: staff@email.com  
pw: password

## Contributors

Jiyun Choi (14445124)  
Email: jiyun.choi@student.uts.edu.au  
Features: F103 Menu View & F104 Food Ordering (UI, client validation), cart API, tests/CI

Ena Debnath (24782839)  
Email: Ena.Debnath@student.uts.edu.au  
Features: F106 Food ManageMent & F109 Checkout & Payment

Ella Gibbs (24548354)  
Features: F105 Booking System & F108 Booking Management  
Email: Ella.r.gibbs@student.uts.edu.au

Sarah White (24844072)  
Email: sarah.e.white@student.uts.edu.au  
Features: F101 Adoption View & F110 Adoption Management

Jean Quisumbing (13192190)  
Email: JeanPaulette.P.Quisumbing@student.uts.edu.au  
Features: F102 Adoption Request & F107 Cat Detail Management

## Code Structure

Menu View & Cart
- Reusable cart utilities: `toCents`, `money`, `nextCart`, `computeTotals` (`public/cart.js`)
- Cart API routes with input validation(`routes/cartRoutes.js, utils/cartValidation.js`)
- Front-end cart UI + client-side validation (`public/menu.js, public/cart.js000`)

Food Management
- Model: `models/foodModel.js`
- Controller: `controllers/foodController.js`
- Route: `routes/foodRoutes.js`
- Views: `views/foodManagement.ejs`, `views/menu.ejs`

Checkout & Payment
- Model: `models/orderModel.js`
- Controller: `controllers/checkoutController.js`
- Route: `routes/checkoutRoutes.js`
- Views: `views/checkout.ejs`, `views/paymentSuccess.ejs`

Adoption View
- Model: `Cat.js`
- View: `cat-display.ejs`, `cat-profile.ejs`
- Controller: `catController.js`, `catRoutes.js`
- Utils: `filterUtils.js`

Adoption Management
- Model: `adoptionRequest.js`
- View: `adoptionRequest.ejs`, `adoptionRequests.ejs`
- Controller: `requestController.js`, `adoptionRequestRoute.js`
- Utils: `filterUtils.js`, `requestValidator.js`

Booking
- Model: `bookingModel.js`
- View: `booking.ejs`
- Route: `bookingRoutes.js`
- Controller: `bookingController.js` 

Booking Managmenet
- Model: `bookingModel.js`
- View: `bookingManagment.ejs`
- Route: `bookingManagementRoutes.js`
- Controller: `bookingManagementController.js`

## Version History

* 2
    * Continuous Deployment, Security Considerations, Finalised Features

* 1
    * Automated Testing, integrated with DevOps Pipeline

* 0
    * Initial Release
