1. Populate given JSON data in the Mongo Database

```bash
    cd api
    vi .env        # create .env file if you don't have it already

    # add below environment variable to your .env file
    MONGO_URI=mongodb+srv://YOURUSER:YOURKEY@YOURLINK/LONCA?retryWrites=true&w=majority

    # after you saved the file, run populate script, this will populate data to your db instance
    cd utils
    node populate.js

```
