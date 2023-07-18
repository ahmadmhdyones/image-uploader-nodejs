# image-uploader-nodejs

![Node.js](./cover.jpg)

NodeJS application that support upload images API and request the image with specific width and height.

---

## Task

You are requested to create NodeJS application that support upload images API with the following features:

- User can upload new image and image saved locally on the node application.
- User can request the image by its name (suggestion: use a method to change the image name to hashed name).
- User can request the image with specific width and height, the application must convert the image to that width and height (suggestion: use [sharp package](https://www.npmjs.com/package/sharp)).
- when the user request image with specific width and height, the new generated image must be saved and next time requested with same width and height it should be returned from the saved image not regenerate new one.

The frontend for this app can be with any framework or lib, there is not design required.

## Configuration

1. Create a `.env` file in the root directory based on the provided `.env.example` file.
2. Fill in the necessary environment variables in the **.env** file:
   - **PORT**: The port on which the server will run (default: 8000).
   - **MONGODB_CONNECTION_STRING**: The URI for connecting to your MongoDB database (default: <mongodb://localhost:27017>).
   - **APP_URL**: The url of your server (default: <http://localhost:8000> - Port number must be matching with the *PORT* env).
   - **NODE_ENV**: The working environment (development [default], staging, test, production, etc.).
   - **NODE_PATH**: The relative path of project sourcecode root directory (default: `.`).

## Installation and Usage

1. Clone the project

    ```sh
    git clone https://github.com/ahmadmhdyones/image-uploader-nodejs.git
    ```

2. Install packages and dependencies

    ```sh
    cd project-dir
    npm install
    ```

- Start the server in development mode:

   ```sh
   npm run start:dev
   ```

- Access the debug mode:

   ```sh
    npm run debug
   ```

- Formatting and lintting code:

   ```sh
    npm run format:fix
    npm run lint:fix
   ```

### API Endpoints

The following API endpoints are available:

- **POST** `/image/upload`: Uploads an image.
- **GET** `/image/:name`: Retrieves an image by name and resolution.

You can use the provided Postman collection [api.postman_collection.json](./api.postman_collection.json) to test the API endpoints. Import the collection into Postman and modify the base URL to match your local server setup, or you can visit the homepage to use the UI forms.

![Homepage](./public/images/Screenshot%20from%202023-07-18%2004-44-54.png)

![Collection](./public/images/Screenshot%20from%202023-07-18%2004-47-30.png)

## Project Structure

- `.vscode`: Contains the Visual Studio Code configuration files.
- `app`: Contains the core application files.
  - `config`: Contains configuration files for the application.
    - `app.conf.js`: Configuration file for the application settings.
    - `db.conf.js`: Configuration file for the database connection.
    - `srv.conf.js`: Configuration file for the server settings.
  - `controllers`: Contains the controllers responsible for handling requests.
    - `image.controller.js`: Controller for handling image-related requests.
  - `database`: Contains the files related to the database.
    - `Mongo.database.js`: Database connection file for MongoDB.
  - `middleware`: Contains the middleware functions used in the application.
    - `addRequestStartTime.mw.js`: Middleware to add the start time of the request.
    - `checkPayload.mw.js`: Middleware to check the request payload (size, content-type, etc).
    - `errorHandler.mw.js`: Middleware for handling express errors.
    - `index.js`: Middleware index file.
    - `parseFormData.mw.js`: Middleware to parse form data request and upload them to the server storage.
  - `models`: Contains the Mongoose models for the application.
    - `ImageEntity.model.js`: Mongoose model for the image entity.
  - `routes`: Contains the route files for the application.
    - `api`: Contains the API routes.
      - `image.router.js`: Router for image-related API endpoints.
      - `index.js`: Index file for the API routes.
    - `web`: Contains the web routes.
      - `index.js`: Index file for the web routes.
    - `index.js`: Index file for the routes.
  - `services`: Contains the service files for the application.
    - `image.service.js`: Service file for image-related functionality.
  - `utils`: Contains utility files for the application.
    - `AppError.js`: Custom error class.
    - `index.js`: Utility index file.
    - `media.js`: Utility functions for handling media files.
    - `requests.js`: Utility functions for handling HTTP requests.
  - `views`: Contains the HTML views or templates.
    - `index.html`: Main HTML file for the application.
  - `app.js`: Main application file.
- `logs`: Contains log files.
- `public`: Contains the publicly accessible files (e.g., stylesheets, scripts, images).
- `uploads`: Directory for storing uploaded images.
- `.editorconfig`: Editor configuration file.
- `.env`: Environment variables file (create based on `.env.example`).
- `.env.example`: Example environment variables file.
- `.eslintrc`: ESLint configuration file.
- `.gitignore`: Git ignore file.
- `.nvmrc`: Node Version Manager (NVM) configuration file.
- `.prettierignore`: Prettier ignore file.
- `.prettierrc`: Prettier configuration file.
- `LICENSE`: Project license file.
- `README.md`: Project README file.
- `api.postman_collection.json`: Postman collection for API testing.
- `cover.jpg`: Placeholder image for the README.
- `package-lock.json`: Auto-generated file for package dependency lock.
- `package.json`: Project's package.json file.
- `server.js`: Main server file.
- `tree`: Text file showing the project tree structure.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to submit a pull request or open an issue in the repository.

## License

This project is licensed under the [MIT License](https://chat.openai.com/c/LICENSE).
