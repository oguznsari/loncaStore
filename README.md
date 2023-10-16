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

Useful insights from data (order table)

```json
{
  "payment_at": {
    "max": "2023-03-14T09:16:41.000+00:00",
    "min": "2021-12-12T13:26:20.920+00:00"
  }
}
```

API collection can be imported by postman File > import and import the file

```bash
  store/Lonca.postman_collection.json
```

# How to run

1. Go to api and create .env file give your mongodb atlas URI

```bash
cd api
npm i # to install packages
touch .env
# add 2 lines
MONGO_URI=mongodb+srv://AAAA:AAAA@AAAA/LONCA?retryWrites=true&w=majority
PORT=3001

# cd to utils directory and run the script to populate mock data on your db
cd utils
node populate.js
# confirm you see the below log indicating you've successfully populated
"Data populated successfully."
# I've also logged the count of data per each item, so that you can compare the collection count in your mongo db instance and make sure you've the data
# go back the root folder for next step
```

2. start the api server

```bash
cd api
npm run dev
# confirm you see the below log
"Server is running on port 3001..."
```

3. start the nextJS Ui

```bash
cd store
npm i # install packages
npm run dev
```
