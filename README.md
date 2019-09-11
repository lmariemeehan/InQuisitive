## Formerly known as blocipedia-node. This is a back-end app built with Node.js that allows users to create, collaborate, and share wikis. Lot of fun features.

## List of features:
* Users are able to create public or private wikis depending on whether they are a premium or standard user.
* Option to create wikis in markdown.
* Stripe has been integrated in order to charge users to upgrade their accounts from standard to premium for additional features.
* User authentication and email sending has been implemented by using external API's including SendGrid and Passport.js.
* Ability to collaborate with others by inputting your friend's email.

## List of tools that played a role in the make up of this baby:
* npm - Node package manager
* Morgan - logging tool for debugging
* Heroku - for deployment
* Bootstrap - for easy styling
* SendGrid - authentication system that sends emails to users upon sign up.
* Git - version-control
* bcrypt - for storing hashed passwords in the database.
* Passport - middleware for user authentication. This authenticates users by email & password.
* PostgreSQL - database storage
* Sequelize - ORM
* Sequelize seed - to create dummy users/wikis for the development database.
* Jasmine - for TDD testing
* Stripe - to charge the users for upgrading status
* Markdown - to enable users to create markdown wikis

## Check out the Live Version at https://lmariemeehan-blocipedia.herokuapp.com












# blocipedia-node
