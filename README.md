# Queueable

A versatile JavaScript utility for simplifying queue management in applications, serving as an abstraction layer over Bull, a Redis-backed queue package for Node.js. Ideal for building scalable and efficient JavaScript applications.

## Installation

Install via npm:

```bash
npm install @abhihyder/queueable
```

## Usage
Before using @abhihyder/queueable, make sure you have a `Redis` server installed and running. 
```javascript
const Queueable = require("@abhihyder/queueable");

class Job extends Queueable {
  handler() {
    console.log("Console output from handler");
  }
}

const job = new Job();
job.dispatch({});
```

## Configuration

Create a `queueable.config.js` file in your application's root directory to customize the Redis configuration for Bull. If not provided, default configuration values will be used.

Example `queueable.config.js`:

```javascript
module.exports = {
  redis: {
    host: "127.0.0.1",
    port: 6379,
    username: "",
    password: ""
  }
};
```

## License

This project is licensed under the [MIT License](LICENSE).