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
