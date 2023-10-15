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
