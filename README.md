# Streamline-Precision-Timecard

This is the readme for the streamline precision timecard app

# QR Installation instructions

QR Simple QR code Reader walkthrough: 
* [Here](https://medium.com/readytowork-org/implementing-a-qr-code-scanner-in-react-4c8f4e3c6f2e)

* All the necessay packages:
```
npm i qr-scanner --legacy-peer-deps

npm install @svgr/webpack --save-dev

npm install moment axios # Moment For timestamp formatting and Axios for database API interaction

next dev --experimental-https

```

Reasoning behind packages:
- all the new code written today was from there and now, i am moving towards altering the sample to make it better. 
you need to just use one extension
- npm i qr-scanner
- You will need to use typescript, src/path, tailwind, and app routing
- npm install @svgr/webpack --save-dev
this is a package that is needed to display your svg files, I then had to change the next.config,js file. Make sure to leave the " /** @type {import('next').NextConfig} */"

- another thing that I figured out was that you need to put your global/public variables into public folder and then you can acces them anywhere. Perfect for images and non-secure data to be stored.
- npm install moment axios # For timestamp formatting and database API interaction
These two modules make it easier to make Timestamps and axios for database interation. 


## Next Steps:

looking currently for an npm for hashing services to help create QR codes then decode them for an increase of difficulty in accessing them. The Idea is that we hash the code on creation and dehash it when scanning on the software. 


