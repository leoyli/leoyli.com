## The Project CMS
### TL;DR
The Project CMS is a self-learning project as a proto-demo of my knowledges and progress in WebApp development.  This A-to-Z project is developed independently from scratch (except the use of libraries in limited).  The architecture is based on MERN stack, one of the most popular tech stacks.  Deployment is done with Amazon Cloud Services.

👉 You can visited GitHub to view the source code for this project: https://github.com/leoyli/leoyli.com/


## What and Why Is MERN?
MERN is a shorthand for the combination of [MongoDB](https://www.mongodb.com) + [Express.js](http://expressjs.com) + [React.js](http://reactjs.org) + [Node.js](https://nodejs.org/). It is good for quickly prototyping a concept for many good benefits:

![MERN Stack](https://leoyli.com/static/media/mern.png "MERN Stack")

***

#### JavaScrip in Node.js
Based on [the result of 2018 annual developer survey collected by StackOverflow](https://insights.stackoverflow.com/survey/2018/):

> Node.js and AngularJS continue to be the most commonly used technologies in this category (note: Frameworks, Libraries, and Tools), with React and .Net Core also important to many developers.

In comparison of previous years, a growing trend of the adaptions of Node.js, React.js, and MongoDB could be found over developer communities.  No doubts, JavaScript nowadays is the most dominant language on the web for its high integrations among all browsers as the only way to manipulate DOM directly.  Therefore, the advantage for using single language that united the front-end and back-end makes Node.js truly an ideal environment for the developer who is on his path to master in full-stack web development.

#### Express.js for serving RESTful API
One of the biggest drift in current industry compared with the past is the separation of front-end and back-end.  Back-end now more or less handle the controlling and data modelling logic, while front-end are more focusing on view rendering and user experiences (UI/UX), with some overlapping possible though. Express.js, based on their homepage — _"fast, unopinionated, minimalist web framework for Node.js"_, is a prototypical option for serving RESTful API.  Although GraphQL is believed to be the standard for the next generation (and fashionable) by many, I found it is important to first know about the most common pattern which its concept have been solidified into the convention.

#### The Front-end Frameworks
As for the front-end, there are many frameworks or libraries such as Angular, Vue, and React are available.  Choosing one over the other is case-by-case and can rise many debates since they all come for its pros and cons.  I believe the developer must capable to quickly switch the gear if needs, especially in such a fast changing moment in the web history.  However, standing as a returning developer like myself, I made the chose of React over the others mainly for a learning reasons.  React is famous for its flexibility in logic with a learning-friendly curve.  Also, one of the selling points for React is its informative error messages, making it easy to debug.  Here, this project is aim to quickly prototype a CMS with basic functionality, and React is good starting point.

#### NoSQL Database
I have experienced developing several websites over 2010-2015 using WordPress CMS, where naturally MySQL is used.  Often I found myself lost in the complexity of relational tables stored in my database.  On the other hand, with the merge of new technology and the growing need to build a flexible and easy to scale WebApp, MongoDB as a non-tabular database is one of the super nova among NoSQL Databases.

> MongoDB’s document data model maps naturally to objects in application code, making it simple for developers to learn and use.

Quoted from [MongoDB v.s. MySQL](https://www.mongodb.com/compare/mongodb-mysql), I found my data is more maintainable, approachable, and scalable using MongoDB.

## Features in This App

![Architecture](https://leoyli.com/static/media/architecture.png "Architecture in The Project CMS")

_For an overview discussion of the app architecture, please read the blog post: [The Project CMS: The Architecture](https://leoyli.com/blog/the-project-cms-the-architecture)._

***

- For a CMS, the minimum functionality is allow the user to publish content and manage content centralizedly.  In this, user can use markdown syntax for content customization.  Also, a secured content manage board provide an easy to use interface for managing contents in a single batch.
- User-defined data are stored in MongoDB hosted on [mLab](https://mlab.com/). Data manipulation is incorporated with the most common used [Mongoose package](http://mongoosejs.com), a library for object data modelling (ODM).  With Mongoose, virtual fields are available for the application, which reduced the undesired equivalent data duplications.
- **RESTful API** is served by Node/Express. A customized router mapping driver have been developed for centralizing endpoints, which makes optional tuning and routing management easier. Also, by adapting [`async/await` error handling pattern](https://thecodebarbarian.com/80-20-guide-to-express-error-handling), the middleware can be written in more intuitive fashion.
- **The content recycling mechanism** is fulfilled using [Mongo TTL index](https://docs.mongodb.com/manual/core/index-ttl/).  This preventing the user from deleting content accidentally.  The reversible operation can be done through the content manage board (bin mode).
- A middleware for query handling have been developed to leverage the power of [Mongo aggregation framework](https://www.mongodb.com/presentations/aggregation-framework-0).  This allows the API to serve **paginated result** together with **the full-text search** capability.
- Taking one of the most important advantages in Node.js as [the stream](https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93), **streaming file upload** API have been implemented and integrated with the corresponding document model.
- React **Serve-side rendering (SSR)** is here.  With SSR, user experience (UX) can be greatly improved with faster page loading.  Meanwhile, the search engine optimization (SEO) can no longer be a problem as found in the traditional single page application (SPA).
- [Auth0](http://auth0.com) as a third-party authentication provider is introduced.  JSON web tokens (JWTs) are issued to authorized data operations and to track user authentication states at the client.  The token validation is verified and cached by the server session and can be recalled by the corresponding cookie.  The use of session allows the server and client to stay in synchronized.


## Achievements
This website is empowered by the CMS developed in this project.  For the past 10+ months (using my spare time from the rest of my graduate study 😌), I have progressively designed and deployed a modern web application from A to Z.  The following is listed several important milestones or experiences that have been accomplished throughout this project:

- The ability to read and understand the latest [ECMAScript Language Specifications](https://www.ecma-international.org/publications/standards/Ecma-262.htm).
- Mastered in git and GitHub for version control over developing branches.
- Wrote in test-driven-development (TDD) pattern with [Jest](https://jestjs.io) as a testing framework.
- Wrote a traditional template-basted [Express.js view engine](https://github.com/leoyli/leoyli.com/blob/ea386c548ccc369a3852ff50392499ef1820c3dd/controllers/engines/view.js) from scratch. (code was deprecated for the sake of SSR)
- Wrote stylesheet using SASS on top of Bootstrap 4 in the user interface (UI) design.
- Familiarized in Babel, Webpack 4 and other relevant packages to rollup and optimize the production build.
- Familiarized in ESLint followed the AirBnb Javascript guideline to write a much elegant code.
- Had deployed a WebApp on Amazon Cloud Services (AWS) — as a practice in some basic DevOps.
- Had configured Nginx as the load balancer of the website for serving public files to save the computing resources.
- Had set-up [domain email forwarding](https://github.com/arithmetric/aws-lambda-ses-forwarder) using AWS Simple E-mail Services, S3, and Lambda to my private Gmail.
- Had positive contributions in one of the most popular NPM package — [qs](https://www.npmjs.com/package/qs).


## Declaration and Licence
🚗 This project is maintained by Leo Y. Li under MIT license, and the repository is hosted for the demonstration purpose.  Any rising issues or pull requests for reporting bugs or security risks are appreciated. 🙏

🚨 Although the author is welcoming anyone who want to grab any code from this project, please use it in your own risks.  The author is not responsible or obligated to any damage or lost if you decide to use any part of code hosted from this repository.
