import { Cloudinary } from "@cloudinary/url-gen";

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'dsccpsoaw',
    apiKey: '959411716384624',
    apiSecret: 'mxTXExIyt5aoW9K7rqXi7yF8MQ0'
  }
});

export default cloudinary;