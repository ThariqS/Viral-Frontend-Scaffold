To build:
===========================
  - Run gulp
  - Go to localhost:(port in your config file)

To publish to AWS:
===========================
  - Create a bucket in AWS
  - Give it a public policy
  - Turn on static hosting
  - Copy your AWS credentials into config.json and change the bucket name
  - Run gulp publish
