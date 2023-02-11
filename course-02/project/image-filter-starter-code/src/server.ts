import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get( "/filteredimage/", async ( req: Request, res: Response ) => {
    // Make sure the image url is included in the request
    if ( !req.query.image_url ) {
      return res.status(400).send(`image url is required`);
    }

    var image_url: string = req.query.image_url.toString();

    // Validate the image url
    try {
      new URL(image_url);
    } catch (err) {
      console.log(err);
      return res.status(400).send(`not a valid url`);
    }

    // Apply filter to the image and return its local path
    try {
      var filtered_image_path: string = await filterImageFromURL(image_url);
    } catch (err) {
      console.log(err);
      return res.status(500).send(`error processing the input image`);
    }

    // Return the filtered image and delete afterwards
    res.status(200).sendFile(filtered_image_path, function (err) {
      if (err) {
        return res.status(500).send(`error sending the output image`);
      } else {
        console.log('Image filtered and sent successfully');
        deleteLocalFiles([filtered_image_path]);
        console.log('Local file deleted');
      }
      });
  });
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();