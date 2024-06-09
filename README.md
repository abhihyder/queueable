# Queueable

A versatile JavaScript utility for simplifying queue management in applications, serving as an abstraction layer over Bull, a Redis-backed queue package for Node.js. Ideal for building scalable and efficient JavaScript applications.

## Why Use Queueable?
- **Minimal Boilerplate Code**: Avoid writing extensive code for queue instantiation, Redis connection, and cleanup. **Queueable** handles these tasks seamlessly for you.
- **Easy to Use**: Just extend the `Queueable` class and implement your `handler` method.
- **Customizable**: Supports custom Redis configurations through a simple `queueable.config.js` file.

With **Queueable**, you don't need to write a lot of code to:
- Get a queue instance
- Close the Redis connection after completion
- Close the queue after completion

Everything is handled efficiently within the library.

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