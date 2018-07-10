## The Project CMS
The Project CMS is a self-learning project as a proto-demo of my knowledges and progress in WebApp development.  This A-to-Z project is developed independently from scratch (except the use of libraries in limited), and mainly based on MERN stack, one of the most popular tech stacks.  Deployment is done with Amazon Cloud Services.

👉 You can visited GitHub to view the source code for this project: https://github.com/leoyli/leoyli.com/


## What and Why Is MERN?
MERN is a shorthand for the combination of [MongoDB](https://www.mongodb.com) + [Express.js](http://expressjs.com) + [React.js](http://reactjs.org) + [Node.js](https://nodejs.org/). And it is good for quickly prototyping a concept for many good benefits:

![MERN Stack](https://leoyli.com/static/media/mern.png "MERN Stack")

***

#### JavaScrip in Node.js
Based on [the result of 2018 annual developer survey collected by StackOverflow](https://insights.stackoverflow.com/survey/2018/):

> Node.js and AngularJS continue to be the most commonly used technologies in this category (note: Frameworks, Libraries, and Tools), with React and .Net Core also important to many developers.

If we look this survey closely, it won’t be so hard to find a growing trend of the adaptions of Node.js, React.js, and MongoDB over developer communities.  And no doubts, JavaScript nowadays is the most dominant language on the web for its high integrations among all browsers as the only way to manipulate DOM directly.  Therefore, the advantage for using single language that united the front-end and back-end makes Node.js truly an ideal environment for the developer who is on his path to master in full-stack web development.

#### Express.js for serving RESTful API
One of the biggest drift I found in current industry compared with the past is the separation of front-end and back-end.  Back-end now more or less handle the controlling and data modelling logic, while front-end are more focusing on view rendering and user experiences (UI/UX), with some overlapping possible though. Express.js, based on their homepage — "fast, unopinionated, minimalist web framework for Node.js", is a reasonable option for serving RESTful web API.  Although GraphQL is believed to be the next standard of webAPI (and fashionable) by many, I found it is important to first know about the most common pattern which its concept have been solidified into the convention.

#### The Front-end Frameworks
As for the front-end, there are many frameworks or libraries such as Angular, Vue, and React are available.  Choosing one over the other is case-by-case and can rise many debates since they all come for its pros and cons.  I believe the developer must capable to quickly switch the gear if needs, especially in such a fast changing moment in the web history.  However, standing as a returning developer like myself, I made the chose of React over the others mainly for a learning reasons.  React is famous for its flexibility in logic with a learning-friendly curve.  This project is aim to quickly prototype a CMS with basic functionality, and React is good starting point.

#### NoSQL Database
I have experienced developing several websites over 2010-2015 using WordPress CMS, where naturally MySQL is used.  Often I found myself lost in the complexity of relational tables stored in my database.  Now in 2018, on the other hand, with the merge of new technology and the growing need to build a flexible and easy to scale WebApp, MongoDB as a non-tabular database is one of the super nova among NoSQL Databases.  The following quote from [MongoDB v.s. MySQL](https://www.mongodb.com/compare/mongodb-mysql) really stick into my heart:

> MongoDB’s document data model maps naturally to objects in application code, making it simple for developers to learn and use.


## Features in This App
- RESTful API is served by Node/Express. A customized router driver have been developed for centralizing endpoints, which makes optional tuning and routing management easier.
- User-defined data are stored in MongoDB. Data manipulation is incorporated with the most common used [Mongoose package](http://mongoosejs.com), a library for object data modelling (ODM).  With Mongoose, **virtual fields** are available for the application, which reduced the undesired equivalent data duplications.
- A middleware for query handling have been developed to leverage the power of **Mongo aggregation framework**.  This allows the API to serve **paginated result** with optional **full-text search** capability.
- Taking one of the most important advantages in Node.js as stream, streaming file upload have been implemented and integrated with the corresponding document model.
- **Serve-side rendering (SSR)** is here.  With SSR, user experience (UX) can be greatly improved with faster page loading.  Meanwhile, the search engine optimization (SEO) can no longer be a problem as found in the traditional single page application (SPA).
- [Auth0](http://auth0.com) as a third-party authentication provider is introduced.  JSON web tokens (JWTs) are issued to authorized data operations and to track user authentication states at the client.  The token validation is verified and cached by the server session and can be recalled by the corresponding cookie.  The use of session allows the server and client to stay in synchronized.
- For a CMS, the minimum functionality is allow the user to publish content and manage content centralizedly.  In this, user can use markdown syntax for content customization.  Also, a secured content manage board provide an easy to use interface for managing contents in a single batch.
- **The content recycling mechanism** is fulfilled using Mongo TTL index.  This preventing the user from deleting content accidentally.  The reversible operation can be done through the content manage board (bin mode).


## Achievements
This website is empowered by the CMS developed in this project.  For the past 10 months (using my spare time from the rest of my graduate study 😌), I have successfully designed and deployed my first WebApp from A to Z.  Aside from above features, I want to denoted several important milestones or experiences that have been accomplished:

- The ability to read and understand the [ECMAScript Language Specifications](https://www.ecma-international.org/publications/standards/Ecma-262.htm) — the core definition of JavaScripts.
- Experience in git and GitHub for version control over developing branches.
- Experience in test-driven-development (TDD) using jest as a testing framework.
- Experience in writing [Express.js view engine](https://github.com/leoyli/leoyli.com/blob/ea386c548ccc369a3852ff50392499ef1820c3dd/controllers/engines/view.js) from scratch. (code was deprecated for the sake of SSR)
- Experience in using Bootstrap 4 with customized SASS in the user interface (UI) design.
- Experience in using Babel, Webpack 4 and other relevant packages to rollup and optimize the production build.
- Experience in using ESLint followed the AirBnb Javascript guideline to write a much elegant code.
- Had deployed a WebApp on Amazon Cloud Services (AWS) — as a practice in some basic DevOps.
- Had configured Nginx as the load balancer of the website.
- Had set-up [domain email forwarding](https://github.com/arithmetric/aws-lambda-ses-forwarder) using AWS Simple E-mail Services, S3, and Lambda to my private Gmail.
- Had positive contributions in one of the most popular NPM package — [qs](https://www.npmjs.com/package/qs).


## Declaration and Licence
🚗 This project is maintained by Leo Y. Li under MIT license, and the repository is hosted for the demonstration purpose.  Any rising issues or pull requests for reporting bugs or security risks are appreciated. 🙏

🚨 Although the author is welcoming anyone who want to grab any code from this project, please use it in your own risks.  The author is not responsible or obligated to any damage or lost if you decide to use any part of code hosted from this repository.
