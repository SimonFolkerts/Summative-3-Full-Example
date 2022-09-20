## Initial Setup
Initial Setup has been completed. The front end has the bare minimum required to laod and serves as an empty scaffolding for the new project. Placeholder content has been removed, such as styles and welcome components

For the back end, the basic utilities are installed.
dotenv to hide credentials, cors for security bypass for local development, mongoose for db connection,
and express to handle functionality. Inital connections established but no routes defined yet

# 1: Create Post Basic
New component CreatePost.vue added, and a basic form with v-model for text and a listener for file selection added.
For basic styling, sass was added using `npm add -D sass` to make the form a bit tidier while developing.

A method was added that reacts to the file listener, whenever a file is selected it is loaded into the data.

A second method was added that formats and sends a post request to the server with some test data attached

Meanwhile on the back end, a route for posts was added, with a single endpoint for post requests. This just sends back the request data for now, but we will add the ability to upload to the database soon using mongoose.

A catchall end point was added to the main file, this will be the last enpoint and will catch any requests that don't match with anything specific. (app.use means any method is matched, and the asterisk means any route is matched, so it is truly universal). This endpoint will handle 404 response if an incorrect route is entered on any method.

## 2: Create Post Data
Instead of just sending a test message, we can now send data from the forms to the back end by sending the object that contains the form data to the back end.

On the back end, we have created a Schema file that exports a model that represents Posts. We use the Post model to create a new document using the data from the request (ignoring the images for now)  and save it to the database.

## 3: Create Post Image
On the front end we modify the upload method to manually construct formData representing our fields. This lets us send the image up to multer, as application/json data wouldn't work.

On the back end, multer is configured on the posts route and attached as middleware to the post endpoint. Here the data is assembled into the new document from the model and saved.

# 4: List Vue
Now that basic upload is ready we can add the ability to view a list of uploaded posts. A new componenet is created on the front end that can be used to view the list.

This new component has the ability to GET request to the server, which has a new route added that can handle GET requests to POST. The endpoint retreives the posts from the database and sends them back as JSON data. Note the use of `lean()` on the .find() method, this ensures that the data comes back as a simple object, instead of using a mongoose document model. It also means that the image data is converted to base64, which can be rendered in image tags using a special code in the src atttribute.

Some minimal styling is added as well.

# 5: Delete Posts
A button with a data attribute is added to the list view. This buttons data attribute contains the id of the post that it belongs to. When the button is clicked it triggers an event handler that reads the data attribute and then sends a DELETE request to the back end for the specified post by appending the id of the cicked to the url.

On the backend an endpoint has been added that can receive DELETE requests with a second url segment. This is intended to be the id of a post to be deleted. The API uses the Post model to send a delete by ID request to the database.

## 6: Refactor for Quality of Life Improvements
Post list items were made into a component, using a prop to put the data from the list view into them. Each list item has the ability to request deletion from the db and will also trigger a fetch when the state changes

The list view has got loading indicators for a fresh load

The create component now has an upload indicator for the button, and also triggers a page refresh when uploading is complete, which also gets the list component to reload

# 7: Detail View
By adding a new detail view component that when navigated to using vue router it gets given an id for a post and uses fetch to retreive the data for the post.
We can create a new route in index.js that accepts an :id param and then create a routerlink in the post list item to navigate to this view, attaching the post id as a param

The view then can load the post and render it. This means that it can also be navigated to through the address bar if the user has the id of a post.

We can also modify the router view to use keep-alive and v-slots to prevent the home view component from being unloaded when navigated away from. This means that we don't need to wait for it to reload the list of posts everytime we leave and then return to it.

# 8: Edit View
Adding an edit button that can show the CreatePost form allows us to then modify the Create form to also support editing. There are a variety of approaches to editing, such as having a dedicated edit component in its own view, but in this case it could be interesting to re use the create form and make it multi purpose.

By adding a prop to the create component that a parent can use to pass a post object into, the create create component can then check if the prop has a value, and if it does, switch to edit mode. The fields get prepopulated, and the create button turns into an edit button. The method changes from POST to PUT and therefore will match with a different endpoint.

# 9: Login and Signup Views and Endpoints
Now that we have full CRUD for a data type, we could move on to users. We can create a login view and a signup view, as well as a new router on the back end to handle authentication requests. Each view will send username and password form data from the front to the back, and each endpoint will recieve the request and log tha data before sending a generic response.

The next step will be to create the user schema and model and set up the creation of new users.

## 10: Signup Create User
By adding a schema and model we can enable the application to create new users. We create a new User.js file and use that to define our schema, which inlcudes some basic validation.

This schema is used to export a model that can then be imported to the authentication route, where it is used to save a new user on the post to signup route. Some basic error handling is present too.

## 11: Signup Password Hashing
Storing passwords in plain text is extremely insecure and irresponsible. Instead, we can encrypt the passwords. By running `npm install bcrypt` we can install bcrypt, a package that can salt and hash passwords.
We can create a mongoose hook for the user schema, which executes prior to every save of a new user. This hook will run a function that uses bcrypt to encrypt the password before storage. Note the use of a regular `function` rather than an arrow function `() => {}`. This is done to allow the use of the `this` keyword to refer to the correct object. Arrow functions do not handle `this` the same way that regular functions do. This is something worth looking into if doing object oriented programming.

## 12: Login JWT Cookie
By adding `jsonwebtoken` and `cookie-parser` packages, we can create an endpoint that can log the user in after signup.
We first need to modify CORS to use credientials (this enables the backend to send and receive cookies) and we need to whitelist the front end address, since browser CORS policies would other wise prevent same origin credential sharing.

We also need to add an option property to the fetch function on the login view on the frontend. We need to add `credentials: "include"` to allow the front end to send and receive cookies.

Once that is sorted, we modify the login endpoint to check the submitted user information sent from the login component on the front end. It checks the username using findOne, and then if a user is found it checks the password using bcrypt.compare.

If username and password are both correct, then a new JWT is minted using the user id, which gets encoded into the token. This then gets attached to the response as a cookie, and finally the response is sent back.

On the front end the cookie should arrive and be visible in the applications tab of the dev tools. On the sidebar click on the cookies dropdown and click on the address of the front end application, and the jwt cookie should be visible in the list with the json web token string as its value.

Now we are able to use the signup view to create a new user, and we are able to use the login view to get issud an new json web token. As a final step we could add router links for the login and signup pages, which later on will be conditionally rendered.

The next step is to add route protection to certain routes, allowing us to lock certain endpoints to only those who are logged in.

## 13: Route Protection
Now on the front end it is time to make sure everything is in order to set up route protection and to ensure that cookies get sent properly. In the code the adresses for the fetch have all been changed to use `127.0.0.1` instead of `lcoalhost` in order to be consistent with the server. Without this consistency CORS will block the cookies.

For those operations that we will add protection too, at this point DELETE and POST a post, we will need to add an option to the request: `credentials: "include"`.

Router links have also been added to the navigation for the login and sign up pages.

On the back end, a new file is added called auth middleware. This file contains the logic for checking a token and authorising a request. It can be attached to routes to serve as a route protection middleware. Every request that arrives at a route that has this middleware attached to it, will pass through the middleware first. The middleware will then check the token, and if it is a valid match it will pass the request on to the endpoint using `next()`. If it isn't a match, it will intercept the request and immediately respond back with an 'unauthorized' message of some sort, ending the transaction.

This middleware is imported into the relevant routes and attached as an argument to the endpoint methods for the relevant routes