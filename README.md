# 2 Factor Authentication

A Node.js RESTful API to generate a Captcha image and verify the code. The create service generates and returns base64 encoded PNG data for the Captcha image and writes the code to the session, whilst the verify service accepts a user supplied code and verifies it against the code stored in the session.
Uses nodemon to automatically restart the server when code changes are saved.
Includes tests written using Mocha and Chai.

## Usage

1. Clone the repository and change the siteName variable in server.js to reflect the label you want displayed in the authenticator app.
2. Install the dependencies `npm install`
3. Start the server `nodemon server.js`
4. Make web service requests as described below; you could use Postman to experiment.
5. Run the tests `npm run test`

### Generate and return base64 encoded PNG Captcha image data, and write the Captcha code to the session

Create a GET request to http://localhost:8080/create and extract the data from the JSON response.

The response body should contain JSON like this, or an error message:

```
  {
    "success": true,
    "data: "data:image/png;base64,iVBORw0KGgoAAA..."
  }
```

Display the Captcha image to the user like this:

```
<img alt="Captcha" src="data:image/png;base64,iVBORw0KGgoAAA..." />
```

### Verify a Captcha code against that stored in the session

Create a POST request to http://localhost:8080/verify

```
  {
    code: QRf7k9
  }
```

The response body should contain JSON like this, or an error message:

```
  {
    "success": true,
    "message": "Code is valid"
  }
```
