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

## 14: Logout
Logging out is very simple. In order to log out the jwt cookie should be removed from the browser. Previously this has been achieved by simple deleting it by right clicking on it and choosing delete, however we want to do this programmatically when the user selects logout.

While we cannot access and delete the cookie directly, as it is protected from the js by being sent as `httpOnly: true`, what we can do is replace it with a new jwt cookie that has an almost instant expire time

On the front end we create a button that triggers a method that sends a GET request to `http://127.0.0.1:3000/logout`. This endpoint then responds with a new jwt cookie with no content and a 1 millisecond lifespan, which is received by the client and replaces the original jwt cookie and then immediately expires.

## 15: Auth Summary and Theory
Authentication is a complex subject, but at this stage we have a complete signup/login/logout system.

No is a good time to recap and look back at what was added and how it works.

### Utilities Needed
For authentication to work using json web tokens sent via cookies, we need to enable several things that allow the transmission of cookies.

The way JWT based authentication works is that for a user to be considered logged in, their requests should come with a json web token, a special encrypted string that contains some identifying information that can be verified by the back end. As long as the client is sending requests with this information attached, then they are considered logged in. The server checks each requests to protected routes and looks for the valid token before allowing a response or rejecting the request.

Think of it kind of like having a stampt that lets you into a club or event. As long as you have the stamp on your hand, you are considered authenticated and are granted access. To log out, we simply remove the token from the requests, i.e. we remove the stamp.

So essentially, instead of the server storing a list of all the users who are currently logged in, like a guest list at an event, instead we give the client a token they can use to get access to routes, like a pass or a stamp. Both ways are valid and have their pros and cons, but we are gonna use the latter.

The question then becomes, how do we add the token to the requests and where do we store it? The client needs to receive the token and hnd on to it for as long as they are logged in so we need some way to transmit and store it. 

For transmission, we could just transmit the token as part of the request payload or in the url, but this isn't particularly secure. We will also need to store the token on the client side once it is issued to the client by the server upon logging in.

A solution that addresses both issues is using cookies. Cookies are small text files that are used to transfer and hold information and are saved by the browser. They are used to allow the browser to 'remember' information about websites such as logins, preferences, settings etc. When you choose a theme on your fav website or when you select 'remember my details' after placing an online order, you are asking to receive a cookie from the server that stores that information in the browser and is then re used next time you visit to remember those settings or details.

Cookies are attached to http requests and responses and transmit this information back and forth with each http interaction.

When a user logs in to the site, we can put the JWt into a cookie and then send that cookie down to the user to act as the stamp or pass to get into the club or event. The cookie is stored on the browser and has an expiry time, but as long as it is not expired it can be attached to every request the client makes to the server and acts as the authentication for accessing protected routes. The server can check each incoming request to see if the cookie is attached and then validated the token inside to see if the user is authentic.

In order to enable the transmission of cookies in our application, some steps need to be taken first however, as cookies can be a potential security issue (this is why many websites have a popup asking about cookies, a recent law change in the EU brought this about with regards to information privacy and awareness). Browsers are very skeptical of cookies from addresses other than the one that the front end is being served from, and since our application front and back run on two different ports, they are considered separate servers and requests and cookies are flagged as 'cross origin' and 'third party', which normally are blocked.

Here's hwo we can circumvent that:

- Back End cors options need to be set to allow the traffic through from one server to the other
  - Cors needs to have the credentials option set to `true`. This allows the attachment of cookies to the reqeusts and responses.
  - Cors needs to have at least one specific origin address whitelisted (the addresses of the front end). This is because attaching credentials comes with a higher security risk so we can't just allow any address, we need to explicitly state which ones are allowed. This avoids our cookies being intercepted and used by some other random address to impersonate our front end.
- `cookie-parser` package needs to be installed on the back end to facilitate the reading and setting of cookies
- On the front end, any requests to routes that will require authentication should have an option added: `credentials: "include"`. Similar to the back end, this enables the front end to transmit cookies with the request.
- It is also important to make sure that consistent addresses are used on the front and back end. Mixing localhost and 127.0.0.1 will now cause issues. Even though they refer to the same thing, the increased paranoia of the browser when using cookies will result in them beig considered mismatched, so I would suggest just using 127.0.0.1 everywhere. In the example I have whitelisted both.
- When issuing the cookie, it is important to ensure that it has `sameSite: 'none` and `secure: true` set otherwise due to the front and back being on separate servers CORS will reject the cookies. Cookies sent from a different address are considered 'third party' cookies and are by default mistrusted unless certain conditions are met.


With that sorted, here is a recap of the processes


### Signup
The front end needs a form that allows the user to insert their details. This form is then submitted via POST to the back end.

The back end receives the user details, and uses a User Schema and User Model to create a new user entry. Importantly, the User Schema has a hook built into it that triggers everytime the model is used to save a new user. This hook fires right before the save and it uses `bcrypt` to salt and hash the password before it is saved into the database. This is good because it is considered extremely bad practice to store passwords as plain text.

### Login
For Login things get a little more complicated.

The front end needs a form that is used to POST the username and password to a login route on the back end.

1. The back end receives this request and first searches for the user.
1. If the user is found, it then checks the password against the encrypted one stored on the database.
1. If it is a match, then the user is authentic and should get a token. Having a token is how a user is considered logged in.
1. The endpoint uses `jsonwebtoken` to create a new token, encoding into it the id of the user it was created for, and then inserts it into a cookie.
1. The cookie is attached to the response and then the response is sent back, ending the interaction.
1. The cookie is received by the front end and is stored in the browser. Any request with `credentials: 'include'` set will now have that cookie attached to it when sent to the back end.

### Logout
Since for a lcient to be considered 'logged in' they simply need to have a valid token attached to their requests, to log out we must remove the token from the client. Since it is not possible to just outright delete a cookie through javascript, we can use the following method.

Logout is very simple, a GET is sent to an endpoint that simply creates an empty cookie with the same name as the jwt cookie, and sets its expiry time to 1ms. This cookie is sent to the client, and because it has the same name as the jwt cookie, it replaces it and then immediately self destructs. Now the client has no cookie with a valid token in it and they can no longer access protected routes. They will need to log in again and be issued a new token if they want to be considered authentic again.

### Authorization for Protected Routes
To actually handle access, we can lock off certain routes to only be accessible to requests that have a valid token cookie attached. If a request is made to create a new post for example, and we decide that only logged in users should be able to do so, then we can add route protection to the create new post endpoint that will reject any request without a valid token.

We can create a middleware (like an endpoint that isn't the end, it passes on the request after doing its job) that checks if there is a token and if there is, it checks it for authenticity. If authentic, it allows the request to continue, if not, it terminates the interaction by immediately sending back a response, which ends the http req/res cycle.

This middleware can be attached to any route that we want to only be accessible to authentic, logged in users.

### Next Steps
That is where we are so far, the next steps would be to distinguish different roles for users, such as administrators, or user who own the particular resource they are accessing. There are a variety of ways to acheive this, a straightforward and secure way would be every time the authentication middleware is used to check an incoming request, it decodes the user id out of the token (remember that when the token is created it has the user id encoded into it?). The middleware can then attach the user id to the request object before passing it on the the endpoint it is attached to. The endpoint can then read the id and look up the user in the database to see what roles they have, or it can compare the id to the author id of the post or comment it is handling to check if it is a match and whether to proceed or not. Lots of options for how to handle this, but that is one way.

## 16: Tracking Logged In vs Logged Out State
When a user logs in successfully, the API sends back the user data of the logged user. We can store this on the App.vue data(). Once the user clicks log out, we can clear it again. By keeping track of if there is a saved user and what their details are on the front end, we can conditionally render a welcome message and also swap out the log out and log in buttons as appropriate.

In the next steps we will also use this data to add an author field to posts.

